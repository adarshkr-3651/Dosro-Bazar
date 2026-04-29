import asyncErrorWrapper from "express-async-handler";
import User from "../Models/user.js";
import Admin from "../Models/Admin.js";
import RefreshToken from "../Models/refreshToken.js";
import PasswordResetRecord from "../Models/PasswordResetRecord.js";
import CustomError from "../Helpers/error/CustomError.js";
import { sendTokens, verifyAndRotateRefreshToken } from "../Helpers/auth/tokenHelpers.js";
import { getRefreshToken, clearAuthCookies } from "../Helpers/auth/cookieHelpers.js";
import sendEmail from "../Helpers/Libraries/sendEmail.js";
import { passwordResetTemplate, loginNotificationTemplate, verificationCodeTemplate, loginOtpTemplate, welcomeTemplate, signupWelcomeTemplate } from "../Helpers/Libraries/emailTemplates.js";
import { validateUserInput, comparePassword } from "../Helpers/input/inputHelpers.js";
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import axios from 'axios';

// OAuth2Client will be initialized inside controllers to ensure env variables are loaded

// Helper function to track devices
const trackDevice = async (user, req) => {
    // Get real IP address (handle proxies/load balancers)
    let ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';
    if (ipAddress && ipAddress.indexOf(',') > -1) {
        ipAddress = ipAddress.split(',')[0];
    }
    if (ipAddress && ipAddress.includes('::ffff:')) {
        ipAddress = ipAddress.replace('::ffff:', '');
    }
    if (ipAddress === '::1') {
        ipAddress = '127.0.0.1 (Localhost)';
    }

    const userAgent = req.headers['user-agent'] || 'Unknown';

    if (!user.devices) {
        user.devices = [];
    }

    // Check if device already exists
    const existingDeviceIndex = user.devices.findIndex(
        device => device.ipAddress === ipAddress && device.userAgent === userAgent
    );

    if (existingDeviceIndex >= 0) {
        // Update lastActive
        user.devices[existingDeviceIndex].lastActive = Date.now();
    } else {
        // Add new device
        user.devices.push({
            ipAddress,
            userAgent,
            lastActive: Date.now()
        });

        // Keep only last 10 devices to avoid document size issues
        if (user.devices.length > 10) {
            user.devices.shift();
        }
    }
    await user.save();
};

const getPrivateData = asyncErrorWrapper((req, res, next) => {
    return res.status(200).json({
        success: true,
        message: "You got access to the private data in this route ",
        user: req.user
    })
})

const register = asyncErrorWrapper(async (req, res, next) => {
    const { username, email, password, phone } = req.body;

    // Validate that phone is provided
    if (!phone) {
        return next(new CustomError("Phone number is required", 400))
    }

    // Ensure phone string
    if (typeof phone !== 'string') {
        return next(new CustomError("Invalid phone format", 400));
    }

    // Check if phone or email already exists to prevent duplicate account login issues
    const existingUser = await User.findOne({ 
        $or: [
            { phone }, 
            ...(email ? [{ email }] : [])
        ] 
    });

    if (existingUser) {
        if (existingUser.phone === phone) {
            return next(new CustomError("An account with this phone number already exists. Please log in.", 400));
        }
        if (email && existingUser.email === email) {
            return next(new CustomError("An account with this email already exists", 400));
        }
    }

    const newUser = await User.create({
        username,
        email: email || undefined, // Make email optional
        phone,
        password,
        authProvider: 'email',
        authProviders: ['email']
    })

    // Generate Verification Code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    newUser.verificationCode = verificationCode;
    newUser.verificationCodeExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await newUser.save();

    // Send Welcome Email
    if (email) {
        try {
            await sendEmail({
                from: process.env.EMAIL_USERNAME,
                to: email,
                subject: '🚀 Welcome to Dosro Bazar!',
                html: signupWelcomeTemplate(username)
            });
        } catch (error) {
            console.error('[auth.js] register() - Failed to send welcome email:', error.message);
        }
    }

    // Log the user in directly after registration
    return await sendTokens(newUser, 201, res, req);
})

const verifyEmail = asyncErrorWrapper(async (req, res, next) => {
    const { email, code } = req.body;

    if (!email || !code || typeof email !== 'string' || typeof code !== 'string') {
        return next(new CustomError("Please provide a valid email and verification code", 400));
    }

    const user = await User.findOne({
        email,
        verificationCode: code,
        verificationCodeExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new CustomError("Invalid or expired verification code", 400));
    }

    // Mark as verified
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpire = undefined;
    await user.save();

    // Send Welcome Email
    sendEmail({
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: '🚀 Welcome to Dosro Bazar!',
        html: welcomeTemplate(user.username)
    }).catch(err => console.error('[auth.js] verifyEmail() - Welcome email error:', err.message));

    // After verification, generate tokens and log them in
    await sendTokens(user, 200, res, req);
})

const resendVerificationCode = asyncErrorWrapper(async (req, res, next) => {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
        return next(new CustomError("Please provide a valid email address", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new CustomError("No user found with this email", 404));
    }

    if (user.isVerified) {
        return next(new CustomError("This email is already verified", 400));
    }

    // Generate new code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = verificationCode;
    user.verificationCodeExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
        await sendEmail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: '🛡️ New Verification Code - Dosro Bazar',
            html: verificationCodeTemplate(verificationCode, user.username)
        });

        return res.status(200).json({
            success: true,
            message: "A new verification code has been sent to your email."
        });
    } catch (error) {
        return next(new CustomError("Email could not be sent. Please try again later.", 500));
    }
})

const login = asyncErrorWrapper(async (req, res, next) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return next(new CustomError("Please provide all fields", 400));
    }

    if (typeof identifier !== 'string' || typeof password !== 'string') {
        return next(new CustomError("Invalid credentials format", 400));
    }

    // Search by either email or phone
    const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }]
    }).select("+password")

    if (!user) {
        const isEmail = identifier.includes('@');
        return next(new CustomError(
            isEmail
                ? `No account found with email: ${identifier}`
                : `No account found with phone number: ${identifier}`,
            404
        ))
    }

    if (!comparePassword(password, user.password)) {
        return next(new CustomError("Incorrect password. Please try again.", 401))
    }

    // CHECK EMAIL VERIFICATION (New Logic)
    if (user.authProvider === 'email' && !user.isVerified) {
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationCode = verificationCode;
        user.verificationCodeExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        // Send Verification Email
        try {
            await sendEmail({
                from: process.env.EMAIL_USERNAME,
                to: user.email,
                subject: '🛡️ Verify Your Email - Dosro Bazar',
                html: verificationCodeTemplate(verificationCode, user.username)
            });
        } catch (error) {
            console.error('[auth.js] login() - Failed to send verification email:', error.message);
        }

        return res.status(200).json({
            success: false,
            verificationRequired: true,
            email: user.email,
            message: "Email not verified. A new verification code has been sent."
        });
    }

    await trackDevice(user, req);

    // CHECK FOR 2FA (Login OTP)
    if (user.loginOtpEnabled && user.email && user.isVerified) {
        const loginOtp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = loginOtp;
        user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
        user.loginOTPFails = 0; // Reset fails on new OTP request
        await user.save();

        try {
            await sendEmail({
                from: process.env.EMAIL_USERNAME,
                to: user.email,
                subject: "Dosro Bazar - Login Verification OTP",
                html: loginOtpTemplate(loginOtp, user.username)
            });
        } catch (emailError) {
            console.error('[auth.js] login() - Failed to send login OTP email:', emailError.message);
        }

        return res.status(200).json({
            success: true,
            otpRequired: true,
            email: user.email,
            message: "A verification code has been sent to your email."
        });
    }

    await sendTokens(user, 200, res, req);

    // Send login notification email (non-blocking)
    // Only if verified and logged in
    const loginTime = new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'long'
    });

    // Get real IP address (handle proxies/load balancers)
    let ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';

    // If x-forwarded-for contains multiple IPs, take the first one
    if (ipAddress && ipAddress.indexOf(',') > -1) {
        ipAddress = ipAddress.split(',')[0];
    }

    // Clean up IPv6 prefix if present (::ffff:)
    if (ipAddress && ipAddress.includes('::ffff:')) {
        ipAddress = ipAddress.replace('::ffff:', '');
    }

    // Handle localhost IPv6
    if (ipAddress === '::1') {
        ipAddress = '127.0.0.1 (Localhost)';
    }

    // Only send email if user has an email address
    if (user.email) {
        // Fetch location in background so as not to block login response
        (async () => {
            let location = 'Unknown Location';
            const cleanIp = ipAddress.split(' ')[0]; // Handle cases like "127.0.0.1 (Localhost)"

            if (cleanIp !== '127.0.0.1' && cleanIp !== 'Unknown' && !cleanIp.startsWith('192.168.') && !cleanIp.startsWith('10.')) {
                try {
                    const response = await axios.get(`http://ip-api.com/json/${cleanIp}`);
                    if (response.data && response.data.status === 'success') {
                        const { city, regionName, country, lat, lon } = response.data;
                        location = `${city}, ${regionName}, ${country}`; // Initial fallback

                        // Apply the location feature application idea
                        if (lat && lon) {
                            try {
                                const geoRes = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`, {
                                    headers: { 'User-Agent': 'DosroBazar-Backend/1.0' }
                                });
                                if (geoRes.data && geoRes.data.address) {
                                    const addr = geoRes.data.address;
                                    const parts = [];

                                    if (addr.hospital) parts.push(addr.hospital);
                                    if (addr.amenity && addr.amenity !== addr.hospital) parts.push(addr.amenity);
                                    if (addr.building) parts.push(addr.building);
                                    if (addr.landmark) parts.push(addr.landmark);
                                    if (addr.road) parts.push(addr.road);
                                    
                                    if (addr.suburb) parts.push(addr.suburb);
                                    else if (addr.neighbourhood) parts.push(addr.neighbourhood);
                                    else if (addr.hamlet) parts.push(addr.hamlet);
                                    else if (addr.village) parts.push(addr.village);
                                    
                                    if (addr.city) parts.push(addr.city);
                                    else if (addr.town) parts.push(addr.town);
                                    
                                    if (addr.district) parts.push(addr.district);
                                    else if (addr.county) parts.push(addr.county);
                                    
                                    if (addr.state) parts.push(addr.state);
                                    
                                    if (addr.country && !parts.includes(addr.country)) {
                                        parts.push(addr.country);
                                    } else if (!parts.includes(country)) {
                                        parts.push(country);
                                    }

                                    if (parts.length > 0) {
                                        location = parts.join(", ");
                                    }
                                }
                            } catch (geoErr) {
                                console.error('[auth.js] login() - Detailed location fetch failed:', geoErr.message);
                            }
                        }
                    }
                } catch (err) {
                    console.error('[auth.js] login() - Failed to fetch IP location:', err.message);
                }
            }

            console.log(`[auth.js] login() - IP: ${cleanIp} | Fetched Location: ${location}`);

            sendEmail({
                from: process.env.EMAIL_USERNAME,
                to: user.email,
                subject: '🔐 New Login to Your Account',
                html: loginNotificationTemplate(user.username, user.email, loginTime, ipAddress, location)
            }).catch(error => {
                console.error('[auth.js] login() - Failed to send login notification email:', error.message);
            });
        })();
    }
})





const adminLogin = asyncErrorWrapper(async (req, res, next) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return next(new CustomError("Please provide admin credentials", 400));
    }

    // 1. Find the admin in the dedicated Admin collection
    const admin = await Admin.findOne({
        $or: [{ email: identifier }, { username: identifier }]
    }).select("+password");

    if (!admin) {
        return next(new CustomError("Invalid administrative credentials", 401));
    }

    // 2. Verify Password
    const isMatched = await admin.matchPassword(password);
    if (!isMatched) {
        return next(new CustomError("Invalid administrative credentials", 401));
    }

    // 3. Generate Tokens
    // Note: trackDevice might need to be implemented for Admin as well if desired
    // For now, we use a custom response or sendTokens if compatible
    const accessToken = admin.generateAccessToken();
    
    // Set admin cookie for compatibility
    res.cookie("admin_access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        path: "/",
    });

    return res.status(200).json({
        success: true,
        message: "Administrative login successful",
        accessToken,
        admin: {
            id: admin._id,
            username: admin.username,
            role: admin.role
        }
    });
});

const forgotpassword = asyncErrorWrapper(async (req, res, next) => {
    const { URI, EMAIL_USERNAME } = process.env;
    // console.log("forgotpassword function of Controllers auth.js")
    const resetEmail = req.body.email;

    if (!resetEmail || typeof resetEmail !== 'string') {
        return next(new CustomError("Please provide a valid email address", 400));
    }

    const user = await User.findOne({ email: resetEmail })

    if (!user) {
        return next(new CustomError("There is no user with that email", 400))
    }

    // Rate Limiting Logic:
    // 1. Check for 1 minute cooldown
    const lastAttempt = await PasswordResetRecord.findOne({ email: resetEmail }).sort({ createdAt: -1 });
    if (lastAttempt) {
        const timeSinceLastAttempt = Date.now() - new Date(lastAttempt.createdAt).getTime();
        if (timeSinceLastAttempt < 60000) { // 1 minute = 60000 ms
            const secondsLeft = Math.ceil((60000 - timeSinceLastAttempt) / 1000);
            return next(new CustomError(`Please wait ${secondsLeft} seconds before requesting another reset link.`, 429));
        }
    }

    // 2. Check for monthly limit (5 attempts per 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentAttemptsCount = await PasswordResetRecord.countDocuments({
        email: resetEmail,
        createdAt: { $gte: thirtyDaysAgo }
    });

    if (recentAttemptsCount >= 5) {
        return next(new CustomError("You have reached the limit of 5 password reset requests per month. Please contact support or try again later.", 429));
    }

    // If allowed, generate OTP and log this attempt
    await PasswordResetRecord.create({ email: resetEmail });

    const otp = user.getResetPasswordOTPFromUser();

    await user.save();

    // console.log("[auth.js] forgotpassword() - Sending OTP to:", resetEmail);

    try {
        await sendEmail({
            from: EMAIL_USERNAME,
            to: resetEmail,
            subject: "🔐 Reset Your Password - OTP",
            html: passwordResetTemplate(otp, user.username)
        })

        // console.log("[auth.js] forgotpassword() - Password reset OTP sent successfully")

        return res.status(200)
            .json({
                success: true,
                message: "A 6-digit OTP has been sent to your email. Please check your inbox.",
                email: resetEmail
            })

    }
    catch (error) {
        console.error("[auth.js] forgotpassword() - Error sending email:", error.message)

        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpire = undefined;

        await user.save();

        return next(new CustomError('Email could not be sent. Please try again later.', 500))
    }
})


const resetpassword = asyncErrorWrapper(async (req, res, next) => {
    // console.log("resetpassword function of Controllers auth.js")
    const { email, otp, newPassword, password } = req.body;
    const finalPassword = newPassword || password;

    if (!email || !otp || !finalPassword) {
        return next(new CustomError("Please provide email, OTP, and your new password.", 400))
    }

    if (typeof email !== 'string' || typeof otp !== 'string' || typeof finalPassword !== 'string') {
        return next(new CustomError("Invalid input format", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new CustomError("No user found with this email", 404))
    }

    // Check if OTP has expired or doesn't exist
    if (!user.resetPasswordOTP || user.resetPasswordOTPExpire < Date.now()) {
        return next(new CustomError("Invalid or expired OTP. Please request a new one.", 400))
    }

    // Check for Lockout (3 failed attempts)
    if (user.resetPasswordOTPFails >= 3) {
        // Clear OTP for security
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpire = undefined;
        user.resetPasswordOTPFails = 0;
        await user.save();
        return next(new CustomError("Too many failed attempts. This OTP is now locked. Please request a new one.", 403));
    }

    // Verify OTP
    if (user.resetPasswordOTP !== otp) {
        user.resetPasswordOTPFails += 1;
        await user.save();

        const attemptsLeft = 3 - user.resetPasswordOTPFails;
        if (attemptsLeft <= 0) {
            user.resetPasswordOTP = undefined;
            user.resetPasswordOTPExpire = undefined;
            user.resetPasswordOTPFails = 0;
            await user.save();
            return next(new CustomError("Too many failed attempts. This OTP is now locked.", 403));
        }

        return next(new CustomError(`Invalid OTP code. You have ${attemptsLeft} attempts remaining.`, 401));
    }

    // Success! Update password and clear fields
    user.password = finalPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;
    user.resetPasswordOTPFails = 0;

    await user.save();

    // Reset password successfully: Restart count from 1 (delete all tracking records for this user)
    await PasswordResetRecord.deleteMany({ email: user.email });

    return res.status(200).json({
        success: true,
        message: "Password reset successful! You can now log in with your new password."
    })
})

/**
 * Verify Password Reset OTP
 * (Step 2 of the 3-step reset wizard)
 */
const verifyResetOTP = asyncErrorWrapper(async (req, res, next) => {
    console.log("verifyResetOTP function of Controllers auth.js")
    const { email, otp } = req.body;

    if (!email || !otp || typeof email !== 'string' || typeof otp !== 'string') {
        return next(new CustomError("Please provide a valid email and OTP", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new CustomError("No user found with this email", 404));
    }

    // Check if OTP has expired or doesn't exist
    if (!user.resetPasswordOTP || user.resetPasswordOTPExpire < Date.now()) {
        return next(new CustomError("Invalid or expired OTP. Please request a new one.", 400));
    }

    // Check for Lockout
    if (user.resetPasswordOTPFails >= 3) {
        // Clear OTP for security
        user.resetPasswordOTP = undefined;
        user.resetPasswordOTPExpire = undefined;
        user.resetPasswordOTPFails = 0;
        await user.save();
        return next(new CustomError("Too many failed attempts. This OTP is now locked. Please request a new code.", 403));
    }

    // Verify OTP
    if (user.resetPasswordOTP !== otp) {
        user.resetPasswordOTPFails += 1;
        await user.save();

        const attemptsLeft = 3 - user.resetPasswordOTPFails;
        if (attemptsLeft <= 0) {
            user.resetPasswordOTP = undefined;
            user.resetPasswordOTPExpire = undefined;
            user.resetPasswordOTPFails = 0;
            await user.save();
            return next(new CustomError("Too many failed attempts. This OTP is now locked.", 403));
        }

        return next(new CustomError(`Invalid OTP code. You have ${attemptsLeft} attempts remaining.`, 401));
    }

    // Success! Verification successful.
    // We DON'T clear the OTP yet, because it will be needed for the final resetpassword call
    // to actually authorize the password change securely.
    
    return res.status(200).json({
        success: true,
        message: "OTP verified! You can now reset your password.",
        email: email
    });
});

// Refresh access token using refresh token
const refreshAccessToken = asyncErrorWrapper(async (req, res, next) => {
    // console.log("refreshAccessToken function of Controllers auth.js")

    // Get refresh token from cookie or body
    const refreshToken = getRefreshToken(req);

    if (!refreshToken) {
        return next(new CustomError("Refresh token is required", 400))
    }

    try {
        // Verify and rotate refresh token
        const { user, accessToken, refreshToken: newRefreshToken } =
            await verifyAndRotateRefreshToken(refreshToken, req);

        // console.log("[auth.js] refreshAccessToken() - Tokens refreshed successfully")

        // Check if using cookies
        const useCookies = process.env.USE_HTTP_ONLY_COOKIES?.trim() === 'true';
        const isProduction = process.env.NODE_ENV === 'production';
        const isCrossSiteLocal = process.env.URI?.startsWith('https://') && process.env.SERVER_URL?.startsWith('http://');
        const secureCookie = isProduction || isCrossSiteLocal;
        const sameSiteCookie = isProduction ? 'strict' : (isCrossSiteLocal ? 'none' : 'lax');

        if (useCookies) {
            // Update cookies
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: secureCookie,
                sameSite: sameSiteCookie,
                maxAge: 15 * 60 * 1000,
                path: '/'
            });

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: secureCookie,
                sameSite: sameSiteCookie,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/'
            });

            return res.status(200).json({
                success: true,
                message: 'Tokens refreshed successfully',
                expiresIn: 900,
                tokenType: 'Bearer'
            })
        } else {
            // Return tokens in response
            return res.status(200).json({
                success: true,
                accessToken,
                refreshToken: newRefreshToken,
                expiresIn: 900,
                tokenType: 'Bearer'
            })
        }
    } catch (error) {
        // console.log("[auth.js] refreshAccessToken() - Error:", error.message)
        return next(new CustomError(error.message, 401))
    }
})

// Logout user (revoke refresh tokens)
const logout = asyncErrorWrapper(async (req, res, next) => {
    // console.log("logout function of Controllers auth.js")

    const userId = req.user._id;

    // Revoke all refresh tokens for this user
    await RefreshToken.revokeAllForUser(userId, 'User logout');

    // Clear cookies if using httpOnly cookies
    if (process.env.USE_HTTP_ONLY_COOKIES?.trim() === 'true') {
        clearAuthCookies(res);
    }

    // console.log("[auth.js] logout() - All refresh tokens revoked for user:", req.user.email)

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
})

const googleLogin = asyncErrorWrapper(async (req, res, next) => {
    const { idToken, code } = req.body;

    const client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        'postmessage' // Special redirect URI for popup/iframe flows
    );

    let email, name, picture, googleId;

    try {
        if (idToken) {
            // Handle ID token directly (Google One Tap, recommended)
            // console.log('[auth.js] googleLogin() - Verifying ID token');
            const ticket = await client.verifyIdToken({
                idToken: idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            email = payload.email;
            name = payload.name;
            picture = payload.picture;
            googleId = payload.sub;
        } else if (code) {
            // Exchange authorization code for tokens (requires client secret)
            // console.log('[auth.js] googleLogin() - Exchanging authorization code for tokens');

            if (!process.env.GOOGLE_CLIENT_SECRET) {
                return next(new CustomError('Google Client Secret not configured. Please use Google One Tap login.', 500));
            }

            const { tokens } = await client.getToken(code);

            // Verify the ID token
            const ticket = await client.verifyIdToken({
                idToken: tokens.id_token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            email = payload.email;
            name = payload.name;
            picture = payload.picture;
            googleId = payload.sub;
        } else {
            return next(new CustomError('No valid Google credentials provided', 400));
        }

        // console.log('[auth.js] googleLogin() - User authenticated:', email);

        let user = await User.findOne({ $or: [{ googleId }, { email }] });
        let isNewUser = false;

        if (user) {
            // Update googleId if not present (e.g. user signed up with email before)
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
            
            // If existing user was not verified, verify them now since Google verified the email
            if (!user.isVerified) {
                user.isVerified = true;
                await user.save();
            }
        } else {
            // Create new user - phone is optional for Google users
            const randomPassword = crypto.randomBytes(16).toString('hex');

            user = await User.create({
                username: name,
                email,
                phone: '', // Empty phone for Google OAuth users
                photo: picture,
                password: randomPassword,
                googleId,
                role: 'buyer',
                authProvider: 'google',
                authProviders: ['google'],
                isVerified: true
            });
            // console.log('[auth.js] googleLogin() - New user created');
            isNewUser = true;
        }

        // Add google to authProviders if not present
        if (!user.authProviders) {
            user.authProviders = [];
        }
        if (!user.authProviders.includes('google')) {
            user.authProviders.push('google');
            await user.save();
        }

        // User has valid phone, proceed with normal login
    await trackDevice(user, req);
        await sendTokens(user, 200, res, req);
    } catch (error) {
        console.error('[auth.js] googleLogin() - Error:', error.message);
        return next(new CustomError('Google authentication failed: ' + error.message, 400));
    }
});

const facebookLogin = asyncErrorWrapper(async (req, res, next) => {
    const { accessToken, userID } = req.body;

    try {
        // Verify the access token with Facebook Graph API
        const response = await fetch(
            `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
        );

        if (!response.ok) {
            return next(new CustomError('Facebook authentication failed', 400));
        }

        const fbData = await response.json();
        console.log('[auth.js] facebookLogin() - FB Data:', JSON.stringify(fbData, null, 2));

        if (fbData.id !== userID) {
            console.error('[auth.js] facebookLogin() - ID mismatch:', { fbId: fbData.id, providedId: userID });
            return next(new CustomError('Facebook user ID mismatch', 400));
        }

        const { id: facebookId, name, email, picture } = fbData;
        
        // Find user by facebookId or email
        let user = await User.findOne({ 
            $or: [
                { facebookId }, 
                ...(email ? [{ email }] : [])
            ] 
        });

        if (user) {
            // Update facebookId if not present
            if (!user.facebookId) {
                user.facebookId = facebookId;
                await user.save();
            }

            // If existing user was not verified, verify them now since Facebook verified the email
            if (!user.isVerified) {
                user.isVerified = true;
                await user.save();
            }
        } else {
            // Create new user
            const randomPassword = crypto.randomBytes(16).toString('hex');

            user = await User.create({
                username: name,
                email: email || undefined,
                phone: '', // Empty phone for Facebook OAuth users (same as Google)
                photo: picture?.data?.url || 'user.png',
                password: randomPassword,
                facebookId,
                role: 'buyer',
                authProvider: 'facebook',
                authProviders: ['facebook'],
                isVerified: true
            });
            // console.log('[auth.js] facebookLogin() - New user created');
        }

        // Add facebook to authProviders if not present
        if (!user.authProviders) {
            user.authProviders = [];
        }
        if (!user.authProviders.includes('facebook')) {
            user.authProviders.push('facebook');
            await user.save();
        }

        await trackDevice(user, req);
        await sendTokens(user, 200, res, req);
    } catch (err) {
        console.error('[auth.js] facebookLogin() - Error:', err.message);
        return next(new CustomError("Facebook Sign In Failed: " + err.message, 400));
    }
});

// Complete OAuth registration by adding phone number
const completeOAuthRegistration = asyncErrorWrapper(async (req, res, next) => {
    // console.log("completeOAuthRegistration function of Controllers auth.js");

    const { tempUserId, phone } = req.body;

    if (!tempUserId || !phone) {
        return next(new CustomError('User ID and phone number are required', 400));
    }

    // Validate phone is exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return next(new CustomError('Phone number must be exactly 10 digits', 400));
    }

    // console.log('[auth.js] completeOAuthRegistration() - Updating phone for user:', tempUserId);

    try {
        // Check if phone already exists for another user
        const existingUser = await User.findOne({ phone, _id: { $ne: tempUserId } });
        if (existingUser) {
            return next(new CustomError('Phone number already in use', 400));
        }

        // Update user's phone number
        const user = await User.findById(tempUserId);
        if (!user) {
            return next(new CustomError('User not found', 404));
        }

        user.phone = phone;

        // Recalculate role based on new profile data
        user.updateRoleBasedOnProfile();

        await user.save();

        // console.log('[auth.js] completeOAuthRegistration() - Phone updated successfully');

        // Send authentication tokens
        await trackDevice(user, req);
        await sendTokens(user, 200, res, req);
    } catch (error) {
        console.error('[auth.js] completeOAuthRegistration() - Error:', error.message);
        return next(new CustomError('Failed to complete registration: ' + error.message, 400));
    }
});

const verifyLoginOtp = asyncErrorWrapper(async (req, res, next) => {
    const { email, otp } = req.body;

    console.log("[auth.js] verifyLoginOtp() - Request received for:", email, "with OTP:", otp);

    if (!email || !otp) {
        return next(new CustomError("Please provide email and OTP", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        console.log("[auth.js] verifyLoginOtp() - User not found for email:", email);
        return next(new CustomError("User not found", 404));
    }

    if (user.otpExpires < Date.now()) {
        return next(new CustomError("OTP expired", 401));
    }

    if (user.loginOTPFails >= 5) {
        return next(new CustomError("Too many failed attempts. Please log in again to receive a new code.", 403));
    }

    if (user.otp !== otp) {
        user.loginOTPFails += 1;
        await user.save();
        
        const remaining = 5 - user.loginOTPFails;
        return next(new CustomError(
            remaining > 0 
                ? `Invalid OTP. ${remaining} attempts remaining.` 
                : "Too many failed attempts. Please log in again.", 
            401
        ));
    }

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Send tokens
    await trackDevice(user, req);
    await sendTokens(user, 200, res, req);
});


export {
    register,
    login,
    adminLogin,
    resetpassword,
    forgotpassword,
    getPrivateData,
    refreshAccessToken,
    logout,
    googleLogin,
    facebookLogin,
    completeOAuthRegistration,
    verifyEmail,
    resendVerificationCode,
    verifyResetOTP,
    verifyLoginOtp
};
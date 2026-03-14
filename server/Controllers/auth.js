import asyncErrorWrapper from "express-async-handler";
import User from "../Models/user.js";
import RefreshToken from "../Models/refreshToken.js";
import CustomError from "../Helpers/error/CustomError.js";
import { sendTokens, verifyAndRotateRefreshToken } from "../Helpers/auth/tokenHelpers.js";
import { getRefreshToken, clearAuthCookies } from "../Helpers/auth/cookieHelpers.js";
import sendEmail from "../Helpers/Libraries/sendEmail.js";
import { passwordResetTemplate, loginNotificationTemplate, verificationCodeTemplate, welcomeTemplate } from "../Helpers/Libraries/emailTemplates.js";
import { validateUserInput, comparePassword } from "../Helpers/input/inputHelpers.js";
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage' // Special redirect URI for popup/iframe flows
);

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
    console.log("getPrivateData function of Controllers auth.js")
    console.log("[auth.js] getPrivateData() - User from middleware:", req.user ? req.user.email : "No user")

    console.log("[auth.js] getPrivateData() - Token validation successful")
    return res.status(200).json({
        success: true,
        message: "You got access to the private data in this route ",
        user: req.user
    })
})

const register = asyncErrorWrapper(async (req, res, next) => {
    console.log("register function of Controllers auth.js")

    const { username, email, password, phone } = req.body;
    console.log("[auth.js] register() - Registration data:", { username, email, phone, passwordLength: password?.length })

    // Validate that phone is provided
    if (!phone) {
        return next(new CustomError("Phone number is required", 400))
    }

    console.log("[auth.js] register() - Creating new user in database...")
    const newUser = await User.create({
        username,
        email: email || undefined, // Make email optional
        phone,
        password,
        authProvider: 'email',
        authProviders: ['email']
    })

    console.log("[auth.js] register() - User created successfully:", newUser.phone)

    // Generate Verification Code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    newUser.verificationCode = verificationCode;
    newUser.verificationCodeExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await newUser.save();

    console.log("[auth.js] register() - Verification code generated:", verificationCode);

    // Send Verification Email
    if (email) {
        try {
            await sendEmail({
                from: process.env.EMAIL_USERNAME,
                to: email,
                subject: '🛡️ Verify Your Email - Dosro Bazar',
                html: verificationCodeTemplate(verificationCode, username)
            });
            console.log("[auth.js] register() - Verification email sent to:", email);
        } catch (error) {
            console.error('[auth.js] register() - Failed to send verification email:', error.message);
            // We don't return error here because the user is created, 
            // but they might need to use 'resend' later if email fails.
        }
    }

    return res.status(201).json({
        success: true,
        message: email
            ? "Registration successful! Please check your email for verification code."
            : "Registration successful! (No email provided for verification)",
        email: email
    });
})

const verifyEmail = asyncErrorWrapper(async (req, res, next) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return next(new CustomError("Please provide email and verification code", 400));
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

    console.log("[auth.js] verifyEmail() - User verified successfully:", email);

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

    if (!email) {
        return next(new CustomError("Please provide an email address", 400));
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

    console.log("[auth.js] resendVerificationCode() - New code generated for:", email, code = verificationCode);

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
    console.log("login function of Controllers auth.js")

    const { identifier, password } = req.body; // identifier can be email or phone
    console.log("[auth.js] login() - Login attempt with identifier:", identifier)

    if (!identifier || !password) {
        console.log("[auth.js] login() - Input validation failed")
        return next(new CustomError("Please provide phone/email and password", 400))
    }
    console.log("[auth.js] login() - Input validation passed")

    console.log("[auth.js] login() - Searching for user in database...")
    // Search by either email or phone
    const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }]
    }).select("+password")

    if (!user) {
        console.log("[auth.js] login() - User not found:", identifier)
        // Be specific about what wasn't found
        const isEmail = identifier.includes('@');
        return next(new CustomError(
            isEmail
                ? `No account found with email: ${identifier}`
                : `No account found with phone number: ${identifier}`,
            404
        ))
    }
    console.log("[auth.js] login() - User found:", user.email || user.phone)

    console.log("[auth.js] login() - Comparing passwords...")
    if (!comparePassword(password, user.password)) {
        console.log("[auth.js] login() - Password comparison failed")
        return next(new CustomError("Incorrect password. Please try again.", 401))
    }
    console.log("[auth.js] login() - Password comparison successful")

    // CHECK EMAIL VERIFICATION (New Logic)
    if (user.authProvider === 'email' && !user.isVerified) {
        console.log("[auth.js] login() - User email not verified. Sending new code...")

        // Generate new verification code
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
            console.log("[auth.js] login() - Verification email sent to:", user.email);
        } catch (error) {
            console.error('[auth.js] login() - Failed to send verification email:', error.message);
            // Even if email fails, we block login. User can try again to resend.
        }

        return res.status(200).json({
            success: false,
            verificationRequired: true,
            email: user.email,
            message: "Email not verified. A new verification code has been sent."
        });
    }

    console.log("[auth.js] login() - Generating access and refresh tokens...")
    await trackDevice(user, req);
    await sendTokens(user, 200, res, req);
    console.log("[auth.js] login() - Login completed successfully")

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
        // Don't await - send email in background to not block response
        sendEmail({
            from: process.env.EMAIL_USERNAME,
            to: user.email,
            subject: '🔐 New Login to Your Account',
            html: loginNotificationTemplate(user.username, user.email, loginTime, ipAddress)
        }).catch(error => {
            console.error('[auth.js] login() - Failed to send login notification email:', error.message);
            // Don't throw error - email failure shouldn't prevent login
        });
    }
})





const adminLogin = asyncErrorWrapper(async (req, res, next) => {
    console.log("adminLogin function of Controllers auth.js")

    const { identifier, password } = req.body;

    // 1. Validate Input
    if (!identifier || !password) {
        return next(new CustomError("Please provide admin credentials", 400));
    }

    // 2. Check against Environment Variables
    const { ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD } = process.env;

    const isIdentifierMatch = (identifier === ADMIN_EMAIL || identifier === ADMIN_PHONE);
    const isPasswordMatch = (password === ADMIN_PASSWORD);

    if (!isIdentifierMatch || !isPasswordMatch) {
        console.log("[auth.js] adminLogin() - Invalid admin credentials provided");
        return next(new CustomError("Invalid admin credentials", 401));
    }

    console.log("[auth.js] adminLogin() - Env credentials validated. Completing login...");

    // 3. Find the user in DB to get the _id for the token
    const adminUser = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!adminUser) {
        console.log("[auth.js] adminLogin() - Admin user not found in DB despite Env match.");
        return next(new CustomError("Admin account setup incomplete. Please restart server.", 500));
    }

    // 4. Generate Tokens
    await trackDevice(adminUser, req);
    await sendTokens(adminUser, 200, res, req);
    console.log("[auth.js] adminLogin() - Admin login successful");
});

const forgotpassword = asyncErrorWrapper(async (req, res, next) => {
    const { URI, EMAIL_USERNAME } = process.env;
    console.log("forgotpassword function of Controllers auth.js")
    const resetEmail = req.body.email;

    const user = await User.findOne({ email: resetEmail })

    if (!user) {
        return next(new CustomError("There is no user with that email", 400))
    }

    const resetPasswordToken = user.getResetPasswordTokenFromUser();

    await user.save();

    const resetPasswordUrl = `${URI}/resetPassword?resetPasswordToken=${resetPasswordToken}`

    try {
        await sendEmail({
            from: EMAIL_USERNAME,
            to: resetEmail,
            subject: "🔐 Reset Your Password",
            html: passwordResetTemplate(resetPasswordUrl, user.username)
        })

        console.log("[auth.js] forgotpassword() - Password reset email sent successfully")

        return res.status(200)
            .json({
                success: true,
                message: "Password reset email sent successfully. Please check your inbox."
            })

    }
    catch (error) {
        console.error("[auth.js] forgotpassword() - Error sending email:", error.message)

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return next(new CustomError('Email could not be sent. Please try again later.', 500))
    }
})


const resetpassword = asyncErrorWrapper(async (req, res, next) => {

    console.log("resetpassword function of Controllers auth.js")
    const newPassword = req.body.newPassword || req.body.password

    const { resetPasswordToken } = req.query

    if (!resetPasswordToken) {

        return next(new CustomError("Please provide a valid token ", 400))
    }

    const user = await User.findOne({

        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }

    })

    if (!user) {
        return next(new CustomError("Invalid token or Session Expired", 400))
    }


    user.password = newPassword;

    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Reset Password access successfull"
    })

})

// Refresh access token using refresh token
const refreshAccessToken = asyncErrorWrapper(async (req, res, next) => {
    console.log("refreshAccessToken function of Controllers auth.js")

    // Get refresh token from cookie or body
    const refreshToken = getRefreshToken(req);

    if (!refreshToken) {
        return next(new CustomError("Refresh token is required", 400))
    }

    try {
        // Verify and rotate refresh token
        const { user, accessToken, refreshToken: newRefreshToken } =
            await verifyAndRotateRefreshToken(refreshToken, req);

        console.log("[auth.js] refreshAccessToken() - Tokens refreshed successfully")

        // Check if using cookies
        const useCookies = process.env.USE_HTTP_ONLY_COOKIES?.trim() === 'true';
        const isProduction = process.env.NODE_ENV === 'production';

        if (useCookies) {
            // Update cookies
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'strict' : 'lax',
                maxAge: 15 * 60 * 1000,
                path: '/'
            });

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'strict' : 'lax',
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
        console.log("[auth.js] refreshAccessToken() - Error:", error.message)
        return next(new CustomError(error.message, 401))
    }
})

// Logout user (revoke refresh tokens)
const logout = asyncErrorWrapper(async (req, res, next) => {
    console.log("logout function of Controllers auth.js")

    const userId = req.user._id;

    // Revoke all refresh tokens for this user
    await RefreshToken.revokeAllForUser(userId, 'User logout');

    // Clear cookies if using httpOnly cookies
    if (process.env.USE_HTTP_ONLY_COOKIES?.trim() === 'true') {
        clearAuthCookies(res);
    }

    console.log("[auth.js] logout() - All refresh tokens revoked for user:", req.user.email)

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    })
})

const googleLogin = asyncErrorWrapper(async (req, res, next) => {
    const { idToken, code } = req.body;

    let email, name, picture, googleId;

    try {
        if (idToken) {
            // Handle ID token directly (Google One Tap, recommended)
            console.log('[auth.js] googleLogin() - Verifying ID token');
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
            console.log('[auth.js] googleLogin() - Exchanging authorization code for tokens');

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

        console.log('[auth.js] googleLogin() - User authenticated:', email);

        let user = await User.findOne({ $or: [{ googleId }, { email }] });
        let isNewUser = false;

        if (user) {
            // Update googleId if not present (e.g. user signed up with email before)
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
            console.log('[auth.js] googleLogin() - Existing user found');

            // Existing user - proceed with login
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
                authProviders: ['google']
            });
            console.log('[auth.js] googleLogin() - New user created');
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

        if (fbData.id !== userID) {
            return next(new CustomError('Facebook user ID mismatch', 400));
        }

        const { id: facebookId, name, email, picture } = fbData;
        console.log('[auth.js] facebookLogin() - User authenticated:', email || facebookId);

        let user = await User.findOne({ $or: [{ facebookId }, { email: email || undefined }].filter(Boolean) });

        if (user) {
            // Update facebookId if not present
            if (!user.facebookId) {
                user.facebookId = facebookId;
                await user.save();
            }
            console.log('[auth.js] facebookLogin() - Existing user found');
        } else {
            // Create new user
            const randomPassword = crypto.randomBytes(16).toString('hex');
            // Generate a temporary phone number for OAuth users
            const tempPhone = `+FB${facebookId.substring(0, 12)}`;

            user = await User.create({
                username: name,
                email: email || undefined,
                phone: tempPhone, // Temporary phone for OAuth users
                photo: picture?.data?.url || 'user.png',
                password: randomPassword,
                facebookId,
                role: 'buyer',
                authProvider: 'facebook',
                authProviders: ['facebook']
            });
            console.log('[auth.js] facebookLogin() - New user created');
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
    console.log("completeOAuthRegistration function of Controllers auth.js");

    const { tempUserId, phone } = req.body;

    if (!tempUserId || !phone) {
        return next(new CustomError('User ID and phone number are required', 400));
    }

    // Validate phone is exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        return next(new CustomError('Phone number must be exactly 10 digits', 400));
    }

    console.log('[auth.js] completeOAuthRegistration() - Updating phone for user:', tempUserId);

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

        console.log('[auth.js] completeOAuthRegistration() - Phone updated successfully');

        // Send authentication tokens
        await trackDevice(user, req);
        await sendTokens(user, 200, res, req);
    } catch (error) {
        console.error('[auth.js] completeOAuthRegistration() - Error:', error.message);
        return next(new CustomError('Failed to complete registration: ' + error.message, 400));
    }
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
    resendVerificationCode
};
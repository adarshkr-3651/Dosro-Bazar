const asyncErrorWrapper = require("express-async-handler")
const User = require("../Models/user");
const RefreshToken = require("../Models/refreshToken");
const CustomError = require("../Helpers/error/CustomError");
const { sendTokens, verifyAndRotateRefreshToken } = require("../Helpers/auth/tokenHelpers");
const { getRefreshToken, clearAuthCookies } = require("../Helpers/auth/cookieHelpers");
const sendEmail = require("../Helpers/Libraries/sendEmail");
const { passwordResetTemplate, loginNotificationTemplate } = require("../Helpers/Libraries/emailTemplates");
const { validateUserInput, comparePassword } = require("../Helpers/input/inputHelpers");
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage' // Special redirect URI for popup/iframe flows
);

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

// User Registration
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

    console.log("[auth.js] register() - Generating access and refresh tokens...")
    await sendTokens(newUser, 201, res, req)
    console.log("[auth.js] register() - Registration completed successfully")
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

    console.log("[auth.js] login() - Generating access and refresh tokens...")
    await sendTokens(user, 200, res, req);
    console.log("[auth.js] login() - Login completed successfully")

    // Send login notification email (non-blocking)
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
        const useCookies = process.env.USE_HTTP_ONLY_COOKIES === 'true';
        const isProduction = process.env.NODE_ENV === 'production';

        if (useCookies) {
            // Update cookies
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'strict' : 'lax',
                maxAge: 15 * 60 * 1000
            });

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'strict' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
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
    if (process.env.USE_HTTP_ONLY_COOKIES === 'true') {
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
            const randomPassword = require('crypto').randomBytes(16).toString('hex');

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
            const randomPassword = require('crypto').randomBytes(16).toString('hex');
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
        await user.save();

        console.log('[auth.js] completeOAuthRegistration() - Phone updated successfully');

        // Send authentication tokens
        await sendTokens(user, 200, res, req);
    } catch (error) {
        console.error('[auth.js] completeOAuthRegistration() - Error:', error.message);
        return next(new CustomError('Failed to complete registration: ' + error.message, 400));
    }
});


module.exports = {
    register,
    login,
    resetpassword,
    forgotpassword,
    getPrivateData,
    refreshAccessToken,
    logout,
    googleLogin,
    facebookLogin,
    completeOAuthRegistration
}
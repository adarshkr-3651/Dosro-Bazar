// ========================================
// TOKEN HELPERS
// Utilities for token generation and management
// ========================================

import crypto from 'crypto';
import RefreshToken from '../../Models/refreshToken.js';

const isTokenIncluded = (req) => {
    return (
        req.headers.authorization && req.headers.authorization.startsWith("Bearer")
    );
};

const getAccessTokenFromHeader = (req) => {
    const authorization = req.headers.authorization;
    const access_token = authorization.split(" ")[1];
    return access_token;
};

/**
 * Send both access and refresh tokens to client
 * Supports both httpOnly cookies (more secure) and JSON response
 */
const sendTokens = async (user, statusCode, res, req) => {
    console.log("[tokenHelpers] sendTokens() - Generating tokens for user:", user.email);

    // Generate access token (short-lived)
    const accessToken = user.generateAccessToken();

    // Generate refresh token (long-lived)
    const refreshToken = user.generateRefreshToken();

    // Create token family ID for rotation tracking
    const family = crypto.randomBytes(16).toString('hex');

    // Hash refresh token before storing
    const hashedRefreshToken = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

    // Calculate expiration date (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store refresh token in database
    await RefreshToken.create({
        user: user._id,
        token: hashedRefreshToken,
        family: family,
        expiresAt: expiresAt,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent')
    });

    console.log("[tokenHelpers] sendTokens() - Tokens generated and stored successfully");

    // Check if client prefers cookies (from environment or request header)
    const useCookies = process.env.USE_HTTP_ONLY_COOKIES?.trim() === 'true';

    if (useCookies) {
        // Send tokens as httpOnly cookies (more secure for web apps)
        const isProduction = process.env.NODE_ENV === 'production';

        // Set access token cookie (15 minutes)
        res.cookie('accessToken', accessToken, {
            httpOnly: true,  // Prevents JavaScript access (XSS protection)
            secure: isProduction,  // HTTPS only in production
            sameSite: isProduction ? 'strict' : 'lax',  // CSRF protection
            maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
            path: '/' // Make cookie available everywhere
        });

        // Set refresh token cookie (7 days)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,  // Prevents JavaScript access (XSS protection)
            secure: isProduction,  // HTTPS only in production
            sameSite: isProduction ? 'strict' : 'lax',  // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
            path: '/' // Make cookie available everywhere
        });

        console.log("[tokenHelpers] Tokens sent as httpOnly cookies");

        return res.status(statusCode).json({
            success: true,
            message: 'Authentication successful',
            expiresIn: 900, // 15 minutes in seconds
            tokenType: 'Bearer'
        });
    } else {
        // Send tokens in JSON response (for mobile apps, SPAs)
        return res.status(statusCode).json({
            success: true,
            accessToken,
            refreshToken,
            expiresIn: 900, // 15 minutes in seconds
            tokenType: 'Bearer'
        });
    }
};

/**
 * Legacy method for backward compatibility
 */
const sendToken = async (user, statusCode, res, req) => {
    // Use new sendTokens method
    return sendTokens(user, statusCode, res, req);
};

/**
 * Verify and rotate refresh token
 */
const verifyAndRotateRefreshToken = async (refreshToken, req) => {
    console.log("[tokenHelpers] verifyAndRotateRefreshToken() - Verifying refresh token");

    // Hash the provided refresh token
    const hashedToken = crypto
        .createHash('sha256')
        .update(refreshToken)
        .digest('hex');

    // Find the refresh token in database
    const tokenDoc = await RefreshToken.findValidToken(hashedToken);

    if (!tokenDoc) {
        console.log(`[tokenHelpers] Token not found or invalid for hashed token: ${hashedToken.substring(0, 10)}...`);
        throw new Error('Invalid or expired refresh token');
    }

    // Check if token was already used (potential attack)
    if (tokenDoc.used) {
        console.log(`[tokenHelpers] ⚠️ Token reuse detected for family ${tokenDoc.family}! Revoking entire family`);
        // Revoke all tokens in this family (security measure)
        await RefreshToken.revokeFamily(tokenDoc.family, 'Token reuse detected - potential attack');
        throw new Error('Token reuse detected. All tokens revoked for security.');
    }

    // Mark current token as used
    await tokenDoc.markAsUsed();

    // Generate new tokens
    const user = tokenDoc.user;
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    // Hash new refresh token
    const hashedNewRefreshToken = crypto
        .createHash('sha256')
        .update(newRefreshToken)
        .digest('hex');

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store new refresh token (same family for rotation tracking)
    await RefreshToken.create({
        user: user._id,
        token: hashedNewRefreshToken,
        family: tokenDoc.family, // Keep same family
        expiresAt: expiresAt,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent')
    });

    console.log("[tokenHelpers] Refresh token rotated successfully");

    return {
        user,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    };
};

export {
    sendToken,
    sendTokens,
    isTokenIncluded,
    getAccessTokenFromHeader,
    verifyAndRotateRefreshToken
};

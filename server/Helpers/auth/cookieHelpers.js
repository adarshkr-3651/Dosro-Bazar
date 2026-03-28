// ========================================
// COOKIE HELPER FUNCTIONS
// Extract tokens from httpOnly cookies
// ========================================

/**
 * Check if token is in cookies
 */
const isTokenInCookies = (req) => {
    return req.cookies && req.cookies.accessToken;
};

/**
 * Basic check to see if a string could be a JWT
 */
const isPotentialJwt = (token) => {
    if (typeof token !== 'string') return false;
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
};

/**
 * Get access token candidates from cookies or header
 * Returns an array of potential tokens to try
 */
const getAccessToken = (req) => {
    const candidates = [];

    // 1. Check cookies (httpOnly)
    if (req.cookies) {
        // Standard user token
        if (req.cookies.accessToken && isPotentialJwt(req.cookies.accessToken)) {
            candidates.push(req.cookies.accessToken);
        }
        // Admin token
        if (req.cookies.admin_access_token && isPotentialJwt(req.cookies.admin_access_token)) {
            candidates.push(req.cookies.admin_access_token);
        }
    }

    // 2. Fallback to Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        const token = req.headers.authorization.split(" ")[1];
        if (token && isPotentialJwt(token)) {
            candidates.push(token);
        }
    }

    // Return unique candidates only
    return [...new Set(candidates)];
};

/**
 * Get refresh token from cookie or body
 */
const getRefreshToken = (req) => {
    // First check cookies (httpOnly)
    if (req.cookies && req.cookies.refreshToken && req.cookies.refreshToken !== "undefined" && req.cookies.refreshToken !== "null") {
        return req.cookies.refreshToken;
    }

    // Fallback to request body
    if (req.body.refreshToken && req.body.refreshToken !== "undefined" && req.body.refreshToken !== "null") {
        return req.body.refreshToken;
    }
    return null;
};

/**
 * Clear authentication cookies
 * Must use the same options as when setting cookies for proper clearing
 */
const clearAuthCookies = (res) => {
    const isProduction = process.env.NODE_ENV === 'production';

    // Clear access token cookie with same options used when setting
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/' // Explicitly set path
    });

    // Clear refresh token cookie with same options used when setting
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/' // Explicitly set path
    });
};

export {
    isTokenInCookies,
    getAccessToken,
    getRefreshToken,
    clearAuthCookies
};

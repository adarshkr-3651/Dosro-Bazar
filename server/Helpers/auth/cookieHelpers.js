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
 * Returns an array of potential tokens to try, intelligently ordered by context.
 */
const getAccessToken = (req) => {
    const candidates = [];
    
    // Check if the request is destined for an administrative route
    // We check both the current path and the original URL for context
    const urlToCheck = req.originalUrl || req.url || '';
    const isAdminRoute = urlToCheck.includes("/admin") || urlToCheck.includes("/admin-auth");

    // 1. Check cookies (httpOnly)
    if (req.cookies) {
        const userToken = req.cookies.accessToken;
        const adminToken = req.cookies.admin_access_token;

        if (isAdminRoute) {
            // Context: Admin page. Prioritize administrative token.
            if (adminToken && isPotentialJwt(adminToken)) candidates.push(adminToken);
            if (userToken && isPotentialJwt(userToken)) candidates.push(userToken);
        } else {
            // Context: Normal user page. Prioritize standard user token.
            if (userToken && isPotentialJwt(userToken)) candidates.push(userToken);
            if (adminToken && isPotentialJwt(adminToken)) candidates.push(adminToken);
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

    // Clear admin access token cookie
    res.clearCookie('admin_access_token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/'
    });
};

export {
    isTokenInCookies,
    getAccessToken,
    getRefreshToken,
    clearAuthCookies
};

import CustomError from "../../Helpers/error/CustomError.js";
import User from "../../Models/user.js";
import Admin from "../../Models/Admin.js";
import jwt from "jsonwebtoken";
import asyncErrorWrapper from "express-async-handler";
import { getAccessToken } from "../../Helpers/auth/cookieHelpers.js";
import keyManager from "../../Helpers/auth/keyManager.js";

/**
 * Middleware to check if user has access to a protected route.
 * Handles both regular Users and Admins from separate collections.
 */
const getAccessToRoute = asyncErrorWrapper(async (req, res, next) => {
    const tokenCandidates = getAccessToken(req);

    if (tokenCandidates.length === 0) {
        return next(new CustomError("You are not authorized to access this route", 401))
    }

    let lastError = null;

    for (const token of tokenCandidates) {
        try {
            const decoded = jwt.verify(token, keyManager.getPublicKey(), {
                algorithms: ['RS256']
            });

            let user;
            // Check the isAdmin flag in the JWT payload to decide which collection to query
            if (decoded.isAdmin) {
                user = await Admin.findById(decoded.id);
            } else {
                user = await User.findById(decoded.id);
            }

            if (!user) {
                continue; 
            }

            // Cross-check: Ensure admin token is used for admin routes if possible
            const urlToCheck = req.originalUrl || req.url || '';
            const isAdminRoute = urlToCheck.includes("/admin") || urlToCheck.includes("/admin-auth") || urlToCheck.includes("/advertisements");
            
            if (decoded.isAdmin && !isAdminRoute && tokenCandidates.indexOf(token) < tokenCandidates.length - 1) {
                req.potentialAdmin = user;
                continue;
            }

            req.user = user;
            return next(); 

        } catch (error) {
            lastError = error;
        }
    }

    if (req.potentialAdmin) {
        req.user = req.potentialAdmin;
        return next();
    }

    if (lastError && lastError.name === 'TokenExpiredError') {
        return next(new CustomError("Access token expired. Please refresh your token.", 401))
    } else {
        return next(new CustomError("Invalid access token", 401))
    }
});

const getOptionalAccess = asyncErrorWrapper(async (req, res, next) => {
    const tokenCandidates = getAccessToken(req);

    if (tokenCandidates.length === 0) {
        return next();
    }

    for (const token of tokenCandidates) {
        try {
            const decoded = jwt.verify(token, keyManager.getPublicKey(), {
                algorithms: ['RS256']
            });

            let user;
            if (decoded.isAdmin) {
                user = await Admin.findById(decoded.id);
            } else {
                user = await User.findById(decoded.id);
            }

            if (!user) {
                continue; 
            }

            const urlToCheck = req.originalUrl || req.url || '';
            const isAdminRoute = urlToCheck.includes("/admin") || urlToCheck.includes("/admin-auth") || urlToCheck.includes("/advertisements");
            
            if (decoded.isAdmin && !isAdminRoute && tokenCandidates.indexOf(token) < tokenCandidates.length - 1) {
                req.potentialAdmin = user;
                continue;
            }

            req.user = user;
            return next(); 

        } catch (error) {
        }
    }

    if (req.potentialAdmin) {
        req.user = req.potentialAdmin;
    }

    return next();
});

export { getAccessToRoute, getOptionalAccess };
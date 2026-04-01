import CustomError from "../../Helpers/error/CustomError.js";
import User from "../../Models/user.js";
import Admin from "../../Models/Admin.js";
import jwt from "jsonwebtoken";
import asyncErrorWrapper from "express-async-handler";
import { getAccessToken } from "../../Helpers/auth/cookieHelpers.js";
import keyManager from "../../Helpers/auth/keyManager.js";

const getAccessToRoute = asyncErrorWrapper(async (req, res, next) => {
    // Get array of potential token candidates
    const tokenCandidates = getAccessToken(req);

    if (tokenCandidates.length === 0) {
        return next(new CustomError("You are not authorized to access this route", 401))
    }

    let lastError = null;

    // Try each candidate token until one works
    for (const token of tokenCandidates) {
        try {
            // Verify token with RSA public key
            const decoded = jwt.verify(token, keyManager.getPublicKey(), {
                algorithms: ['RS256']
            });

            // Determine which collection to search
            let user;
            if (decoded.isAdmin) {
                user = await Admin.findById(decoded.id);
                // console.log(`[auth.js] Decoded Admin token: ${user ? user.username : 'Not found in Admin collection'}`);
            } else {
                user = await User.findById(decoded.id);
                // console.log(`[auth.js] Decoded User token: ${user ? user.username : 'Not found in User collection'}`);
            }

            if (!user) {
                // console.log("[auth.js] Token verified but user record not found. Trying next candidate...");
                continue; 
            }

            // --- CROSS-CHECK ---
            // If we found an Admin but it's not an admin-specific route, 
            // and we have other candidates left, we should preferentially 
            // continue if this is just an admin browsing as a user.
            const urlToCheck = req.originalUrl || req.url || '';
            const isAdminRoute = urlToCheck.includes("/admin") || urlToCheck.includes("/admin-auth");
            
            if (decoded.isAdmin && !isAdminRoute && tokenCandidates.indexOf(token) < tokenCandidates.length - 1) {
                // If it's an admin token on a user route, we keep it as a fallback but 
                // continue the loop to see if there's a more specific user token.
                // If the loop finishes without finding a user token, we'll use this one.
                req.potentialAdmin = user;
                continue;
            }

            req.user = user;
            return next(); 

        } catch (error) {
            // console.log(`[auth.js] Token candidate failed: ${error.name}`);
            lastError = error;
        }
    }

    // Fallback: If we found a potential admin but no user token was found
    if (req.potentialAdmin) {
        req.user = req.potentialAdmin;
        return next();
    }

    // If we reach here, all candidates failed
    // console.log("[auth.js] All token candidates failed verification.");
    
    if (lastError && lastError.name === 'TokenExpiredError') {
        return next(new CustomError("Access token expired. Please refresh your token.", 401))
    } else {
        return next(new CustomError("Invalid access token", 401))
    }
});

const getOptionalAccess = asyncErrorWrapper(async (req, res, next) => {
    // Get array of potential token candidates
    const tokenCandidates = getAccessToken(req);

    if (tokenCandidates.length === 0) {
        return next(); // Just continue as guest
    }

    // Try each candidate token until one works
    for (const token of tokenCandidates) {
        try {
            // Verify token with RSA public key
            const decoded = jwt.verify(token, keyManager.getPublicKey(), {
                algorithms: ['RS256']
            });

            // Determine which collection to search
            let user;
            if (decoded.isAdmin) {
                user = await Admin.findById(decoded.id);
            } else {
                user = await User.findById(decoded.id);
            }

            if (!user) {
                continue; 
            }

            // --- CROSS-CHECK ---
            const urlToCheck = req.originalUrl || req.url || '';
            const isAdminRoute = urlToCheck.includes("/admin") || urlToCheck.includes("/admin-auth");
            
            if (decoded.isAdmin && !isAdminRoute && tokenCandidates.indexOf(token) < tokenCandidates.length - 1) {
                req.potentialAdmin = user;
                continue;
            }

            req.user = user;
            return next(); 

        } catch (error) {
            // Ignore error and try next candidate
        }
    }

    // Fallback: If we found a potential admin but no user token was found
    if (req.potentialAdmin) {
        req.user = req.potentialAdmin;
    }

    return next();
});

export { getAccessToRoute, getOptionalAccess };
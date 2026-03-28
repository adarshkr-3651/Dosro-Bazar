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
        console.log("[auth.js] getAccessToRoute() - No candidate access tokens found.");
        return next(new CustomError("You are not authorized to access this route", 401))
    }

    let lastError = null;

    // Try each candidate token until one works
    for (const token of tokenCandidates) {
        try {
            console.log(`[auth.js] getAccessToRoute() - Attempting verification of candidate: ${token.substring(0, 10)}... (Candidate ${tokenCandidates.indexOf(token) + 1}/${tokenCandidates.length})`);
            
            // Verify token with RSA public key
            const decoded = jwt.verify(token, keyManager.getPublicKey(), {
                algorithms: ['RS256']
            });

            console.log("[auth.js] Token verified. ID:", decoded.id, "isAdmin:", decoded.isAdmin);

            // Determine which collection to search
            let user;
            if (decoded.isAdmin) {
                user = await Admin.findById(decoded.id);
            } else {
                user = await User.findById(decoded.id);
            }

            if (!user) {
                console.log("[auth.js] Token valid, but user not found in collection.");
                continue; // Try next token if user not found (unlikely but possible during migration)
            }

            req.user = user;
            return next(); // SUCCESS!

        } catch (error) {
            console.log(`[auth.js] Candidate verification failed: ${error.message}`);
            lastError = error;
            // Continue to next candidate
        }
    }

    // If we reach here, all candidates failed
    console.log("[auth.js] All token candidates failed verification.");
    
    if (lastError && lastError.name === 'TokenExpiredError') {
        return next(new CustomError("Access token expired. Please refresh your token.", 401))
    } else {
        return next(new CustomError("Invalid access token", 401))
    }
});

export { getAccessToRoute };
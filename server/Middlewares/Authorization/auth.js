import CustomError from "../../Helpers/error/CustomError.js";
import User from "../../Models/user.js";
import jwt from "jsonwebtoken";
import asyncErrorWrapper from "express-async-handler";
import { isTokenIncluded, getAccessTokenFromHeader } from "../../Helpers/auth/tokenHelpers.js";
import { getAccessToken } from "../../Helpers/auth/cookieHelpers.js";
import keyManager from "../../Helpers/auth/keyManager.js";


const getAccessToRoute = asyncErrorWrapper(async (req, res, next) => {

    // Try to get token from cookies first, then from header
    const accessToken = getAccessToken(req);

    console.log("[auth.js] getAccessToRoute() - Token to verify:", accessToken ? (accessToken.substring(0, 20) + "...") : "null");

    if (!accessToken) {
        return next(new CustomError("You are not authorized to access this route", 401))
    }

    console.log("getAccessToRoute function of Middlewares auth.js - Verifying access token")

    try {
        // Verify token with RSA public key
        const decoded = jwt.verify(accessToken, keyManager.getPublicKey(), {
            algorithms: ['RS256']
        });

        console.log("[auth.js] Token verified successfully for user:", decoded.email)

        // Get user from database
        const user = await User.findById(decoded.id)

        if (!user) {
            return next(new CustomError("You are not authorized to access this route", 401))
        }

        req.user = user;
        next()

    } catch (error) {
        console.log("[auth.js] Token verification failed:", error.message)

        if (error.name === 'TokenExpiredError') {
            return next(new CustomError("Access token expired. Please refresh your token.", 401))
        } else if (error.name === 'JsonWebTokenError') {
            return next(new CustomError("Invalid access token", 401))
        } else {
            return next(new CustomError("Token verification failed", 401))
        }
    }

})



export { getAccessToRoute };
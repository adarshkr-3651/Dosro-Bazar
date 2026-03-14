import CustomError from "../../Helpers/error/CustomError.js";

// Middleware to check if user has admin role
const getAdminAccess = (req, res, next) => {
    console.log("getAdminAccess middleware function");
    console.log("[adminAuth.js] getAdminAccess() - Checking admin access for user:", req.user?.email);

    // Check if user exists (should be set by getAccessToRoute middleware)
    if (!req.user) {
        console.log("[adminAuth.js] getAdminAccess() - No user found in request");
        return next(new CustomError("You are not authorized to access this route", 403));
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
        console.log("[adminAuth.js] getAdminAccess() - User is not an admin. Role:", req.user.role);
        return next(new CustomError("Access denied. Admin privileges required.", 403));
    }

    console.log("[adminAuth.js] getAdminAccess() - Admin access granted");
    next();
};

export { getAdminAccess };

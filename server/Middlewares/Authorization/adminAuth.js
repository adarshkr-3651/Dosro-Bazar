import CustomError from "../../Helpers/error/CustomError.js";

// Middleware to check if user has ANY admin role (admin, superadmin, moderator)
const getAdminAccess = (req, res, next) => {
    console.log("getAdminAccess middleware function");
    
    if (!req.user) {
        return next(new CustomError("You are not authorized to access this route", 403));
    }

    const adminRoles = ['admin', 'superadmin', 'moderator'];
    if (!adminRoles.includes(req.user.role)) {
        console.log("[adminAuth.js] getAdminAccess() - Access denied for role:", req.user.role);
        return next(new CustomError("Access denied. Administrative privileges required.", 403));
    }

    next();
};

// Middleware to check if user has superadmin role
const getSuperAdminAccess = (req, res, next) => {
    console.log("getSuperAdminAccess middleware function");

    if (!req.user || req.user.role !== 'superadmin') {
        console.log("[adminAuth.js] getSuperAdminAccess() - Access denied for role:", req.user?.role);
        return next(new CustomError("Access denied. SuperAdmin privileges required.", 403));
    }

    next();
};

export { getAdminAccess, getSuperAdminAccess };


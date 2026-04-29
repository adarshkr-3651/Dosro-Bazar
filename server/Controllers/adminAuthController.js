import Admin from "../Models/Admin.js";
import CustomError from "../Helpers/error/CustomError.js";
import asyncErrorWrapper from "express-async-handler";

/**
 * Admin login using the dedicated Admin collection.
 */
const login = asyncErrorWrapper(async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return next(new CustomError("Please provide both username/email and password", 400));
    }

    // 1. Find admin in the dedicated Admin collection
    const admin = await Admin.findOne({ 
        $or: [{ username }, { email: username }] 
    }).select("+password");

    if (!admin) {
        return next(new CustomError("Invalid credentials provided for administrative access", 401));
    }

    // 2. Compare passwords
    const isMatched = await admin.matchPassword(password);
    if (!isMatched) {
        return next(new CustomError("Invalid credentials provided for administrative access", 401));
    }

    // 3. Generate Access Token
    const accessToken = admin.generateAccessToken();

    // Update last login
    admin.lastLogin = Date.now();
    await admin.save();

    // Send response with token (as Cookie)
    res.status(200)
    .cookie("admin_access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        path: "/",
    })
    .json({
        success: true,
        message: "Administrative session established successfully",
        admin: {
            id: admin._id,
            username: admin.username,
            role: admin.role
        }
    });
});

const getProfile = asyncErrorWrapper(async (req, res, next) => {
    // req.user is set by the getAccessToRoute middleware
    const admin = await Admin.findById(req.user._id || req.user.id);
    
    if (!admin) {
        return next(new CustomError("Admin not found", 404));
    }

    res.status(200).json({
        success: true,
        admin
    });
});

const logout = asyncErrorWrapper(async (req, res, next) => {
    res.status(200)
    .clearCookie("admin_access_token", { path: "/" })
    .json({
        success: true,
        message: "Administrative session terminated"
    });
});

const createAdmin = asyncErrorWrapper(async (req, res, next) => {
    const { username, email, password, phone, role, secretKey } = req.body;

    // --- Secret Key Validation ---
    if (!secretKey) {
        return next(new CustomError("Platform secret key is required to create an admin account", 400));
    }

    const superAdmin = await Admin.findOne({ role: "superadmin" }).select("+password");
    if (!superAdmin) {
        return next(new CustomError("No superadmin found in the system — cannot authorize admin creation", 403));
    }

    const isKeyValid = await superAdmin.matchPassword(secretKey);
    if (!isKeyValid) {
        return next(new CustomError("Invalid platform secret key — access denied", 403));
    }

    if (!username || !password) {
        return next(new CustomError("Please provide both username and password", 400));
    }

    const existingAdmin = await Admin.findOne({ 
        $or: [{ username }, ...(email ? [{ email }] : [])] 
    });

    if (existingAdmin) {
        return next(new CustomError("An administrative account with this identification already exists", 400));
    }

    const newAdmin = await Admin.create({
        username,
        email,
        phone,
        password,
        role: role || "admin"
    });

    res.status(201).json({
        success: true,
        message: "New administrative account provisioned successfully",
        admin: {
            id: newAdmin._id,
            username: newAdmin.username,
            role: newAdmin.role
        }
    });
});

export { login, getProfile, logout, createAdmin };

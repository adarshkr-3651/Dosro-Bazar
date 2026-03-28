import Admin from "../Models/Admin.js";
import CustomError from "../Helpers/error/CustomError.js";
import asyncErrorWrapper from "express-async-handler";

const login = asyncErrorWrapper(async (req, res, next) => {
    const { username, password } = req.body;

    // Check if both username/email and password are provided
    if (!username || !password) {
        return next(new CustomError("Please provide both username/email and password", 400));
    }

    // Check if admin exists in the dedicated collection (search by username OR email)
    const admin = await Admin.findOne({ 
        $or: [{ username }, { email: username }] 
    }).select("+password");

    if (!admin) {
        return next(new CustomError("Invalid credentials provided for administrative access", 401));
    }

    // Compare passwords
    const isMatched = await admin.matchPassword(password);
    if (!isMatched) {
        return next(new CustomError("Invalid credentials provided for administrative access", 401));
    }

    // Generate Access Token
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
    // req.user should be set by admin middleware (we'll implement that if needed, 
    // or just use the profile info from the decoded JWT)
    const admin = await Admin.findById(req.user.id);
    
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
    // Find any superadmin in the database and verify the entered secretKey
    // against their hashed password. This means the superadmin's own password
    // acts as the platform secret key.
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

    // --- Block superadmin role assignment ---
    if (role === "superadmin") {
        return next(new CustomError("Cannot assign superadmin role through this route", 403));
    }

    // --- Basic validation ---
    if (!username || !password) {
        return next(new CustomError("Please provide both username and password for the new account", 400));
    }

    // Check if admin with same username or email already exists
    const existingAdmin = await Admin.findOne({ 
        $or: [{ username }, ...(email ? [{ email }] : [])] 
    });

    if (existingAdmin) {
        return next(new CustomError("An administrative account with this identification already exists", 400));
    }

    // Create new admin
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

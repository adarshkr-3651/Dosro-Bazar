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

export { login, getProfile, logout };

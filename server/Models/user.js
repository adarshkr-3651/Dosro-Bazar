// ========================================
// USER MODEL (MongoDB with Mongoose)
// Defines the User model and methods for authentication and password reset
// ========================================

// Import required modules
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import keyManager from "../Helpers/auth/keyManager.js";

// console.log("User model module loaded in Models user.js");

// ========================================
// USER SCHEMA DEFINITION
// ========================================
const UserSchema = new mongoose.Schema({
    // Basic user information
    username: {
        type: String,
        required: [true, "Please provide a username"]
    },

    // User profile photo
    photo: {
        type: String,
        default: "user.png"  // Default profile picture
    },

    // User phone number (primary identifier)
    phone: {
        type: String,
        default: "",
        validate: {
            validator: function (v) {
                // Allow empty string for OAuth users
                if (!v || v === "") return true;
                // Validate format if phone is provided
                return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/.test(v);
            },
            message: 'Please provide a valid phone number'
        }
    },

    // User email (optional)
    email: {
        type: String,
        unique: true,  // Ensure email uniqueness if provided
        sparse: true,  // Allows null/undefined values to not conflict
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please fill a valid email address"
        ]
    },

    // User address (optional)
    address: {
        type: String,
        default: ""
    },

    // User password (hashed) - Optional for OAuth users
    password: {
        type: String,
        minlength: [6, "Please provide a password with min length: 6"],
        select: false  // Don't include password in queries by default
    },

    // OAuth IDs
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows null/undefined values to not conflict
    },

    facebookId: {
        type: String,
        unique: true,
        sparse: true
    },

    // User role ('buyer', 'seller', 'admin', 'superadmin', 'moderator')
    role: {
        type: String,
        enum: ['buyer', 'seller', 'admin', 'superadmin', 'moderator'],
        default: 'buyer'
    },

    // Auth provider (e.g., 'email', 'google', 'apple')
    authProvider: {
        type: String,
        default: 'email'
    },

    // List of connected auth providers
    authProviders: {
        type: [String],
        default: []
    },

    // User's reading list (stored as array of IDs)
    readList: {
        type: [mongoose.Schema.ObjectId],
        ref: "Story",
        default: []
    },

    // Count of items in reading list
    readListLength: {
        type: Number,
        default: 0
    },

    // User's favorites list (stored as array of Item IDs)
    favorites: [{
        type: mongoose.Schema.ObjectId,
        ref: "Item"
    }],

    // Password reset token (for forgot password functionality)
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpire: {
        type: Date
    },
    resetPasswordOTP: {
        type: String
    },
    resetPasswordOTPExpire: {
        type: Date
    },
    resetPasswordOTPFails: {
        type: Number,
        default: 0
    },

    // Email verification status
    isVerified: {
        type: Boolean,
        default: false
    },

    // Verification code for signup/email change
    verificationCode: {
        type: String
    },

    // Verification code expiration time
    verificationCodeExpire: {
        type: Date
    },

    // User theme preference ('light', 'dark', 'system')
    theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system'
    },

    // User language preference
    language: {
        type: String,
        enum: ['English', 'Nepali', 'Hindi', 'Chinese', 'Spanish', 'Japanese', 'Russian', 'Korean', 'German', 'French'],
        default: 'English'
    },

    // Identification proof for becoming a seller
    idProof: {
        type: String,
        default: ""
    },

    // Type of identification proof
    idProofType: {
        type: String,
        enum: ['', 'Citizenship', 'PAN', 'NID', 'Driving License'],
        default: ""
    },

    // Verification status for sellers
    verificationStatus: {
        type: String,
        enum: ['unverified', 'pending', 'verified', 'rejected'],
        default: 'unverified'
    },

    // Feedback message for verification (e.g., why it was rejected)
    // Device tracking history
    devices: [{
        userAgent: String,
        ipAddress: String,
        lastActive: {
            type: Date,
            default: Date.now
        }
    }],
    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    },
    isOnlineVisible: {
        type: Boolean,
        default: true
    },
    loginOtpEnabled: {
        type: Boolean,
        default: false
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    loginOTPFails: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true  // Automatically add createdAt and updatedAt fields
});

// ========================================
// MIDDLEWARE (Hooks)
// ========================================

// Hash password before saving user
UserSchema.pre("save", async function (next) {
    // console.log("beforeSave hook function of Models user.js");
    // console.log("[user.js] beforeSave() - Hashing password for user:", this.email);

    // Only hash password if it has been modified and exists
    if (!this.isModified("password") || !this.password) {
        // console.log("[user.js] beforeSave() - Password not modified or empty, skipping hash.");
        return next();
    }

    // Generate salt for password hashing
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    // console.log("[user.js] beforeSave() - Password hashed successfully.");
    next();
});

// ========================================
// INSTANCE METHODS
// ========================================

// Generate Access Token (short-lived, RS256)
UserSchema.methods.generateAccessToken = function () {
    // console.log("generateAccessToken function of Models user.js");
    // console.log("[user.js] generateAccessToken() - Generating access token for user:", this.email);

    const { ACCESS_TOKEN_EXPIRE } = process.env;

    // Create JWT payload with user information
    const payload = {
        id: this._id,             // User ID
        username: this.username,  // Username
        email: this.email,        // Email
        role: this.role           // User role
    };

    // Sign the token with RSA private key
    const token = jwt.sign(payload, keyManager.getPrivateKey(), {
        algorithm: 'RS256',
        expiresIn: ACCESS_TOKEN_EXPIRE || '15m',
        keyid: keyManager.getKeyId()
    });

    // console.log("[user.js] generateAccessToken() - Access token generated.");
    return token;
};

// Generate Refresh Token (long-lived, RS256)
UserSchema.methods.generateRefreshToken = function () {
    // console.log("generateRefreshToken function of Models user.js");
    // console.log("[user.js] generateRefreshToken() - Generating refresh token for user:", this.email);

    const { REFRESH_TOKEN_EXPIRE } = process.env;

    // Create JWT payload (minimal data for refresh tokens)
    const payload = {
        id: this._id,
        type: 'refresh'
    };

    // Sign the token with RSA private key
    const token = jwt.sign(payload, keyManager.getPrivateKey(), {
        algorithm: 'RS256',
        expiresIn: REFRESH_TOKEN_EXPIRE || '7d',
        keyid: keyManager.getKeyId()
    });

    // console.log("[user.js] generateRefreshToken() - Refresh token generated.");
    return token;
};

// Legacy method for backward compatibility (uses access token)
UserSchema.methods.generateJwtFromUser = function () {
    // console.log("[user.js] generateJwtFromUser() - Using legacy method, generating access token");
    return this.generateAccessToken();
};


// Generate 6-digit OTP for password reset
UserSchema.methods.getResetPasswordOTPFromUser = function () {
    // console.log("getResetPasswordOTPFromUser function of Models user.js");
    // console.log("[user.js] getResetPasswordOTPFromUser() - Generating OTP for user:", this.email);

    // Get reset password expiration time from environment (or default 10m)
    const expiryMin = parseInt(process.env.RESET_PASSWORD_EXPIRE_MIN) || 10;

    // Generate 6-digit random numeric string
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store the raw OTP momentarily for return (will be hashed in save middleware if we want, but better to hash here)
    this.resetPasswordOTP = otp; // We can hash it if we want, but let's just use it plain and compare or hash for security
    this.resetPasswordOTPExpire = new Date(Date.now() + expiryMin * 60 * 1000);
    this.resetPasswordOTPFails = 0; // Reset fails on new OTP request

    // console.log("[user.js] getResetPasswordOTPFromUser() - OTP generated:", otp);
    return otp;
};

// Check if user has a temporary OAuth phone number
UserSchema.methods.hasTempPhone = function () {
    // console.log("[user.js] hasTempPhone() - Checking if phone is temporary:", this.phone);
    return this.phone && (this.phone.startsWith("+GOOGLE") || this.phone.startsWith("+FB"));
};

// Update user role based on profile completeness
UserSchema.methods.updateRoleBasedOnProfile = function () {
    // If user is admin, do not downgrade
    if (this.role === 'admin') return;

    // Check criteria:
    // 1. Photo must not be default 'user.png'
    // 2. Phone must be present and not empty
    // 3. Address must be present and not empty
    // 4. idProof must be present and not empty
    const hasPhoto = this.photo && this.photo !== 'user.png';
    const hasPhone = this.phone && this.phone.length > 0;
    const hasAddress = this.address && this.address.length > 0;
    const hasIdProof = this.idProof && this.idProof.length > 0;

    if (hasPhoto && hasPhone && hasAddress && hasIdProof) {
        this.role = 'seller';
        // console.log(`[user.js] Role updated to SELLER for ${this.email}`);
    } else {
        this.role = 'buyer';
        /*
        console.log(`[user.js] Role updated to BUYER for ${this.email} (Missing: ${!hasPhoto ? 'Photo ' : ''}${!hasPhone ? 'Phone ' : ''}${!hasAddress ? 'Address ' : ''}${!hasIdProof ? 'ID Proof' : ''})`);
        */
    }
};

// ========================================
// CREATE AND EXPORT USER MODEL
// ========================================
const User = mongoose.model("User", UserSchema);

export default User;
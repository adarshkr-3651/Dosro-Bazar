import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import keyManager from "../Helpers/auth/keyManager.js";

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
            "Please provide a valid email address"
        ]
    },
    phone: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
        select: false
    },
    role: {
        type: String,
        enum: ['superadmin', 'admin', 'moderator'],
        default: 'admin'
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true,
    collection: 'admins'
});

// Hash password before saving
AdminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password
AdminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate Access Token (using existing keyManager pattern)
AdminSchema.methods.generateAccessToken = function () {
    const { ACCESS_TOKEN_EXPIRE } = process.env;
    const payload = {
        id: this._id,
        username: this.username,
        email: this.email,
        role: this.role,
        isAdmin: true // Flag to distinguish from regular users
    };

    return jwt.sign(payload, keyManager.getPrivateKey(), {
        algorithm: 'RS256',
        expiresIn: ACCESS_TOKEN_EXPIRE || '1d',
        keyid: keyManager.getKeyId()
    });
};

const Admin = mongoose.model("Admin", AdminSchema);

export default Admin;

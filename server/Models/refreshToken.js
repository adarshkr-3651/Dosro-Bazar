// ========================================
// REFRESH TOKEN MODEL (MongoDB with Mongoose)
// Stores refresh tokens for secure token rotation
// ========================================

import mongoose from "mongoose";

// console.log("RefreshToken model module loaded");

// ========================================
// REFRESH TOKEN SCHEMA DEFINITION
// ========================================
const RefreshTokenSchema = new mongoose.Schema({
    // Reference to user
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    // The actual refresh token (hashed)
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    // Token family ID (for rotation detection)
    family: {
        type: String,
        required: true,
        index: true
    },

    // Expiration date
    expiresAt: {
        type: Date,
        required: true,
        index: true
    },

    // Whether token has been used (for rotation)
    used: {
        type: Boolean,
        default: false
    },

    // IP address of the client
    ipAddress: {
        type: String
    },

    // User agent of the client
    userAgent: {
        type: String
    },

    // Whether token has been revoked
    revoked: {
        type: Boolean,
        default: false
    },

    // Revocation reason
    revokedReason: {
        type: String
    },

    // When token was revoked
    revokedAt: {
        type: Date
    }
}, {
    timestamps: true  // Automatically add createdAt and updatedAt
});

// ========================================
// INDEXES
// ========================================
// Compound index for efficient queries
RefreshTokenSchema.index({ user: 1, expiresAt: 1 });
RefreshTokenSchema.index({ family: 1, used: 1 });

// TTL index to automatically delete expired tokens after 30 days
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 2592000 });

// ========================================
// INSTANCE METHODS
// ========================================

/**
 * Check if token is valid (not expired, used, or revoked)
 */
RefreshTokenSchema.methods.isValid = function () {
    return !this.used &&
        !this.revoked &&
        this.expiresAt > new Date();
};

/**
 * Mark token as used
 */
RefreshTokenSchema.methods.markAsUsed = async function () {
    this.used = true;
    await this.save();
};

/**
 * Revoke token
 */
RefreshTokenSchema.methods.revoke = async function (reason) {
    this.revoked = true;
    this.revokedReason = reason;
    this.revokedAt = new Date();
    await this.save();
};

// ========================================
// STATIC METHODS
// ========================================

/**
 * Find valid refresh token
 */
RefreshTokenSchema.statics.findValidToken = async function (token) {
    return await this.findOne({
        token,
        used: false,
        revoked: false,
        expiresAt: { $gt: new Date() }
    }).populate('user');
};

/**
 * Revoke all tokens for a user
 */
RefreshTokenSchema.statics.revokeAllForUser = async function (userId, reason = 'User logout') {
    await this.updateMany(
        { user: userId, revoked: false },
        {
            revoked: true,
            revokedReason: reason,
            revokedAt: new Date()
        }
    );
};

/**
 * Revoke all tokens in a family (token rotation attack detected)
 */
RefreshTokenSchema.statics.revokeFamily = async function (family, reason = 'Token reuse detected') {
    await this.updateMany(
        { family, revoked: false },
        {
            revoked: true,
            revokedReason: reason,
            revokedAt: new Date()
        }
    );
};

/**
 * Clean up expired tokens (manual cleanup if TTL index not working)
 */
RefreshTokenSchema.statics.cleanupExpired = async function () {
    const result = await this.deleteMany({
        expiresAt: { $lt: new Date() }
    });
    // console.log(`Cleaned up ${result.deletedCount} expired refresh tokens`);
    return result.deletedCount;
};

// ========================================
// CREATE AND EXPORT MODEL
// ========================================
const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

export default RefreshToken;

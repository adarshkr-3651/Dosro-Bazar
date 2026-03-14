import asyncErrorWrapper from "express-async-handler";
import User from "../Models/user.js";
import Item from "../Models/item.js";
import CustomError from "../Helpers/error/CustomError.js";

// ========================================
// USER MANAGEMENT
// ========================================

// Get all users with pagination and search
const getAllUsers = asyncErrorWrapper(async (req, res, next) => {
    console.log("getAllUsers function of Controllers admin.js");

    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = search ? {
        $or: [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } }
        ]
    } : {};

    const users = await User.find(searchQuery)
        .select('-password')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit));

    const total = await User.countDocuments(searchQuery);

    console.log(`[admin.js] getAllUsers() - Retrieved ${users.length} users out of ${total} total`);

    return res.status(200).json({
        success: true,
        data: users,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

// Get single user by ID
const getUserById = asyncErrorWrapper(async (req, res, next) => {
    console.log("getUserById function of Controllers admin.js");

    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
        return next(new CustomError("User not found", 404));
    }

    console.log(`[admin.js] getUserById() - Retrieved user: ${user.email}`);

    return res.status(200).json({
        success: true,
        data: user
    });
});

// Update user (including role changes)
const updateUser = asyncErrorWrapper(async (req, res, next) => {
    console.log("updateUser function of Controllers admin.js");

    const { id } = req.params;
    const { username, email, phone, role, address } = req.body;

    // Prepare update data
    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    // Validate role if provided
    if (role !== undefined) {
        if (!['buyer', 'admin'].includes(role)) {
            return next(new CustomError("Invalid role. Must be 'buyer' or 'admin'", 400));
        }
        updateData.role = role;
    }

    const user = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
        return next(new CustomError("User not found", 404));
    }

    console.log(`[admin.js] updateUser() - Updated user: ${user.email}`);

    return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user
    });
});

// Delete user
const deleteUser = asyncErrorWrapper(async (req, res, next) => {
    console.log("deleteUser function of Controllers admin.js");

    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === id) {
        return next(new CustomError("You cannot delete your own account", 400));
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
        return next(new CustomError("User not found", 404));
    }

    console.log(`[admin.js] deleteUser() - Deleted user: ${user.email}`);

    return res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});

// Get user statistics
const getUserStats = asyncErrorWrapper(async (req, res, next) => {
    console.log("getUserStats function of Controllers admin.js");

    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const buyerCount = await User.countDocuments({ role: 'buyer' });

    // Get users registered in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    console.log(`[admin.js] getUserStats() - Total users: ${totalUsers}`);

    return res.status(200).json({
        success: true,
        data: {
            total: totalUsers,
            admins: adminCount,
            buyers: buyerCount,
            recentUsers
        }
    });
});

// ========================================
// ITEM MANAGEMENT
// ========================================

// Get all items with pagination and search
const getAllItemsAdmin = asyncErrorWrapper(async (req, res, next) => {
    console.log("getAllItemsAdmin function of Controllers admin.js");

    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = search ? {
        $or: [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } }
        ]
    } : {};

    const items = await Item.find(searchQuery)
        .populate('author', 'username email')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit));

    const total = await Item.countDocuments(searchQuery);

    console.log(`[admin.js] getAllItemsAdmin() - Retrieved ${items.length} items out of ${total} total`);

    return res.status(200).json({
        success: true,
        data: items,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

// Delete item (admin can delete any item)
const deleteItemAdmin = asyncErrorWrapper(async (req, res, next) => {
    console.log("deleteItemAdmin function of Controllers admin.js");

    const { id } = req.params;

    const item = await Item.findByIdAndDelete(id);

    if (!item) {
        return next(new CustomError("Item not found", 404));
    }

    console.log(`[admin.js] deleteItemAdmin() - Deleted item: ${item.title}`);

    return res.status(200).json({
        success: true,
        message: "Item deleted successfully"
    });
});

// Get item statistics
const getItemStats = asyncErrorWrapper(async (req, res, next) => {
    console.log("getItemStats function of Controllers admin.js");

    const totalItems = await Item.countDocuments();

    // Get items created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentItems = await Item.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Get total likes and comments
    const items = await Item.find();
    const totalLikes = items.reduce((sum, item) => sum + item.likeCount, 0);
    const totalComments = items.reduce((sum, item) => sum + item.commentCount, 0);

    console.log(`[admin.js] getItemStats() - Total items: ${totalItems}`);

    return res.status(200).json({
        success: true,
        data: {
            total: totalItems,
            recentItems,
            totalLikes,
            totalComments
        }
    });
});

// ========================================
// DASHBOARD
// ========================================

// Get dashboard overview
const getDashboard = asyncErrorWrapper(async (req, res, next) => {
    console.log("getDashboard function of Controllers admin.js");

    // Get user stats
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const buyerCount = await User.countDocuments({ role: 'buyer' });

    // Get item stats
    const totalItems = await Item.countDocuments();

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
    const recentItems = await Item.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Get latest users and items
    const latestUsers = await User.find()
        .select('-password')
        .sort('-createdAt')
        .limit(5);

    const latestItems = await Item.find()
        .populate('author', 'username email')
        .sort('-createdAt')
        .limit(5);

    console.log(`[admin.js] getDashboard() - Dashboard data compiled`);

    return res.status(200).json({
        success: true,
        data: {
            users: {
                total: totalUsers,
                admins: adminCount,
                buyers: buyerCount,
                recent: recentUsers
            },
            items: {
                total: totalItems,
                recent: recentItems
            },
            latestUsers,
            latestItems
        }
    });
});

export {
    // User management
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserStats,

    // Item management
    getAllItemsAdmin,
    deleteItemAdmin,
    getItemStats,

    // Dashboard
    getDashboard
};


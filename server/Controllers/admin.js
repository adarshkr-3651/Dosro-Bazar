import asyncErrorWrapper from "express-async-handler";
import User from "../Models/user.js";
import Item from "../Models/item.js";
import CustomError from "../Helpers/error/CustomError.js";

// ========================================
// USER MANAGEMENT
// ========================================

// Get all users with pagination and search
const getAllUsers = asyncErrorWrapper(async (req, res, next) => {
    // console.log("getAllUsers function of Controllers admin.js");

    const { page = 1, limit = 10, search = '', role, verificationStatus, hasIdProof } = req.query;
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = {};

    if (search) {
        searchQuery.$or = [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } }
        ];
    }

    if (role) searchQuery.role = role;
    if (verificationStatus) searchQuery.verificationStatus = verificationStatus;
    // Filter users who have uploaded a non-empty ID proof (handles "", null, undefined)
    if (hasIdProof === 'true') {
        searchQuery.idProof = { $exists: true, $nin: ["", null] };
    }

    const users = await User.find(searchQuery)
        .select('-password')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit));

    const total = await User.countDocuments(searchQuery);

    // console.log(`[admin.js] getAllUsers() - Retrieved ${users.length} users out of ${total} total`);

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
    // console.log("getUserById function of Controllers admin.js");

    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
        return next(new CustomError("User not found", 404));
    }

    // console.log(`[admin.js] getUserById() - Retrieved user: ${user.email}`);

    return res.status(200).json({
        success: true,
        data: user
    });
});

// Update user (including role changes)
const updateUser = asyncErrorWrapper(async (req, res, next) => {
    // console.log("updateUser function of Controllers admin.js");

    const { id } = req.params;
    const { username, email, phone, role, address, verificationStatus } = req.body;

    // Prepare update data
    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    // Validate role if provided
    if (role !== undefined) {
        if (!['buyer', 'seller', 'admin'].includes(role)) {
            return next(new CustomError("Invalid role. Must be 'buyer', 'seller', or 'admin'", 400));
        }
        updateData.role = role;
    }

    // Allow admin to manually update verification status
    if (verificationStatus !== undefined) {
        const validStatuses = ['unverified', 'pending', 'verified', 'rejected'];
        if (!validStatuses.includes(verificationStatus)) {
            return next(new CustomError("Invalid verification status", 400));
        }
        updateData.verificationStatus = verificationStatus;
    }

    const user = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
        return next(new CustomError("User not found", 404));
    }

    // console.log(`[admin.js] updateUser() - Updated user: ${user.email}`);

    return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: user
    });
});

// Delete user
const deleteUser = asyncErrorWrapper(async (req, res, next) => {
    // console.log("deleteUser function of Controllers admin.js");

    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user._id.toString() === id) {
        return next(new CustomError("You cannot delete your own account", 400));
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
        return next(new CustomError("User not found", 404));
    }

    // console.log(`[admin.js] deleteUser() - Deleted user: ${user.email}`);

    return res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});

// Get user statistics
const getUserStats = asyncErrorWrapper(async (req, res, next) => {
    // console.log("getUserStats function of Controllers admin.js");

    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const buyerCount = await User.countDocuments({ role: 'buyer' });

    // Get users registered in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // console.log(`[admin.js] getUserStats() - Total users: ${totalUsers}`);

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
    // console.log("getAllItemsAdmin function of Controllers admin.js");

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

    // console.log(`[admin.js] getAllItemsAdmin() - Retrieved ${items.length} items out of ${total} total`);

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
    // console.log("deleteItemAdmin function of Controllers admin.js");

    const { id } = req.params;

    const item = await Item.findByIdAndDelete(id);

    if (!item) {
        return next(new CustomError("Item not found", 404));
    }

    // console.log(`[admin.js] deleteItemAdmin() - Deleted item: ${item.title}`);

    return res.status(200).json({
        success: true,
        message: "Item deleted successfully"
    });
});

// Get item statistics
const getItemStats = asyncErrorWrapper(async (req, res, next) => {
    // console.log("getItemStats function of Controllers admin.js");

    const totalItems = await Item.countDocuments();

    // Get items created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentItems = await Item.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Get total likes and comments
    const items = await Item.find();
    const totalLikes = items.reduce((sum, item) => sum + item.likeCount, 0);
    const totalComments = items.reduce((sum, item) => sum + item.commentCount, 0);

    // console.log(`[admin.js] getItemStats() - Total items: ${totalItems}`);

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

const getDashboard = asyncErrorWrapper(async (req, res, next) => {
    // console.log("getDashboard function of Controllers admin.js");

    const now = new Date();
    const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30);
    const sixtyDaysAgo  = new Date(now); sixtyDaysAgo.setDate(now.getDate() - 60);

    // ── Counts ──────────────────────────────────────────────────────────────
    const [
        totalUsers, totalItems,
        recentUsers, recentItems,
        prevUsers,  prevItems,
        verifiedSellers, pendingSellers,
        totalBiddable,
    ] = await Promise.all([
        User.countDocuments(),
        Item.countDocuments(),
        User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        Item.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        User.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
        Item.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } }),
        User.countDocuments({ verificationStatus: "verified" }),
        User.countDocuments({ verificationStatus: "pending" }),
        Item.countDocuments({ isBiddable: true }),
    ]);

    // Month-over-month % change helper
    const momChange = (current, previous) => {
        if (previous === 0) return current > 0 ? "+100%" : "0%";
        const pct = ((current - previous) / previous) * 100;
        return (pct >= 0 ? "+" : "") + pct.toFixed(1) + "%";
    };

    // ── Latest users and items ────────────────────────────────────────────
    const latestUsers = await User.find()
        .select("username email photo role verificationStatus createdAt")
        .sort("-createdAt")
        .limit(5);

    const latestItems = await Item.find()
        .populate("author", "username email")
        .sort("-createdAt")
        .limit(5);

    // ── Recent activity feed (merge users + items, sorted, top 8) ─────────
    const [activityUsers, activityItems] = await Promise.all([
        User.find({ createdAt: { $gte: thirtyDaysAgo } })
            .select("username email role verificationStatus createdAt")
            .sort("-createdAt").limit(8),
        Item.find({ createdAt: { $gte: thirtyDaysAgo } })
            .populate("author", "username")
            .sort("-createdAt").limit(8),
    ]);

    const activityFeed = [
        ...activityUsers.map(u => ({
            id: u._id,
            actor: u.username || u.email,
            action: "registered a new account",
            target: null,
            type: u.verificationStatus === "pending" ? "warning" : "completed",
            time: u.createdAt,
        })),
        ...activityItems.map(i => ({
            id: i._id,
            actor: i.author?.username || "unknown",
            action: "listed a new item",
            target: i.title,
            type: "completed",
            time: i.createdAt,
        })),
    ]
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 8);

    // console.log(`[admin.js] getDashboard() - Dashboard data compiled`);

    return res.status(200).json({
        success: true,
        data: {
            stats: {
                totalUsers,
                totalItems,
                verifiedSellers,
                pendingSellers,
                totalBiddable,
                recentUsers,
                recentItems,
                userChange: momChange(recentUsers, prevUsers),
                itemChange: momChange(recentItems, prevItems),
                userChangeUp: recentUsers >= prevUsers,
                itemChangeUp: recentItems >= prevItems,
            },
            latestUsers,
            latestItems,
            activityFeed,
        },
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


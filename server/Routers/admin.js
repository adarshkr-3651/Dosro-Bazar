import express from "express";
import { getAccessToRoute } from "../Middlewares/Authorization/auth.js";
import { getAdminAccess } from "../Middlewares/Authorization/adminAuth.js";

import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserStats,
    getAllItemsAdmin,
    deleteItemAdmin,
    getItemStats,
    getDashboard,
    getAllBoosts,
    deleteBoost,
    approveItemAdmin,
    getAllAdvanceBookings
} from "../Controllers/admin.js";
import { getSettings, updateSetting } from "../Controllers/settingController.js";
import {
    getFooterLinkById,
    createOrUpdateFooterLink,
    deleteFooterLink
} from "../Controllers/footerLinkController.js";

const router = express.Router();

// All admin routes require authentication AND admin role
// Apply both middlewares to all routes
router.use((req, res, next) => {
    console.log(`[AdminRouter] Request: ${req.method} ${req.url}`);
    next();
});
router.use([getAccessToRoute, getAdminAccess]);

// Dashboard
router.get("/dashboard", getDashboard);

// Boost management routes
router.get("/boosts", getAllBoosts);
router.delete("/boosts/:id", deleteBoost);

// Advance Booking management
router.get("/advance-bookings", getAllAdvanceBookings);

// User management routes
router.get("/users", getAllUsers);
router.get("/users/stats", getUserStats);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Item management routes
router.get("/items", getAllItemsAdmin);
router.get("/items/stats", getItemStats);
router.delete("/items/:id", deleteItemAdmin);
router.put("/items/:id/approve", approveItemAdmin);

// Settings routes
router.get("/settings", getSettings);
router.put("/settings", updateSetting);

// Footer link management routes
router.get("/footer-links/:id", getFooterLinkById);
router.post("/footer-links", createOrUpdateFooterLink);
router.put("/footer-links/:id", createOrUpdateFooterLink);
router.delete("/footer-links/:id", deleteFooterLink);

export default router;

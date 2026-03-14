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
    getDashboard
} from "../Controllers/admin.js";

const router = express.Router();

// All admin routes require authentication AND admin role
// Apply both middlewares to all routes
router.use([getAccessToRoute, getAdminAccess]);

// Dashboard
router.get("/dashboard", getDashboard);

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

export default router;

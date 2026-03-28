import express from "express";
import { login, getProfile, logout, createAdmin } from "../Controllers/adminAuthController.js";
import { getAccessToRoute } from "../Middlewares/Authorization/auth.js";
import { getSuperAdminAccess } from "../Middlewares/Authorization/adminAuth.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getAccessToRoute, getProfile);

// SuperAdmin only route
router.post("/create-admin", getAccessToRoute, getSuperAdminAccess, createAdmin);

export default router;

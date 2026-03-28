import express from "express";
import { login, getProfile, logout } from "../Controllers/adminAuthController.js";
import { getAccessToRoute } from "../Middlewares/Authorization/auth.js";
// We might need a specific middleware for the new Admin model if we want to protect the profile route
// For now, let's just implement the auth routes.

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", getAccessToRoute, getProfile);

export default router;

import express from "express";
const router = express.Router();
import { getAccessToRoute } from "../Middlewares/Authorization/auth.js";
import { getNotifications, markAsRead } from "../Controllers/notification.js";

router.get("/all", getAccessToRoute, (req, res, next) => {
    console.log("[notification router] GET /notification/all - Route hit");
    next();
}, getNotifications);
router.post("/read-all", getAccessToRoute, markAsRead);

export default router;

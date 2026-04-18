import express from "express";
const router = express.Router();
import { getAccessToRoute } from "../Middlewares/Authorization/auth.js";
import { getNotifications, markAsRead, markSingleAsRead } from "../Controllers/notification.js";

router.get("/all", getAccessToRoute, getNotifications);
router.post("/read-all", getAccessToRoute, markAsRead);
router.put("/:id/read", getAccessToRoute, markSingleAsRead);

export default router;

import express from "express";

const router = express.Router();

import authRoute from "./auth.js";
import itemRoute from "./item.js";
import userRoute from "./user.js";
import commentRoute from "./comment.js";
import jwksRoute from "./jwks.js";
import adminRoute from "./admin.js";
import chatRoute from "./chat.js";
import descriptionRoute from "./description.js";
import chatSystemRoute from "./chatSystem.js";
import adminAuthRoute from "./adminAuth.js";
import bidRoute from "./bid.js";
import notificationRoute from "./notification.js";
import advertisementRoute from "./ad.js";
import invoiceRoute from "./invoice.js";

// Mount JWKS route first (public endpoint)
router.use("/", jwksRoute)

router.use("/auth", authRoute)
router.use("/admin-auth", adminAuthRoute) // New admin auth endpoint
router.use("/item", itemRoute)
router.use("/user", userRoute)
router.use("/comment", commentRoute)
router.use("/admin", adminRoute)
router.use("/chat", chatRoute)
router.use("/describe", descriptionRoute)
router.use("/chat-system", chatSystemRoute)
router.use("/bid", bidRoute)
router.use("/notification", notificationRoute)
router.use("/advertisements", advertisementRoute)
router.use("/invoice", invoiceRoute)

export default router;
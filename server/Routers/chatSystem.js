import express from "express";
import { getAccessToRoute } from "../Middlewares/Authorization/auth.js";
import { getConversations, getMessages, sendMessage, uploadChatImage, deleteMessage } from "../Controllers/chatSystem.js";
import { cloudinaryUpload } from "../Helpers/Libraries/imageUpload.js";

const router = express.Router();

router.use(getAccessToRoute); // All endpoints require authentication

router.get("/conversations", getConversations);
router.get("/:conversationId/messages", getMessages);
router.post("/message", sendMessage);
router.delete("/message/:messageId", deleteMessage);
router.post("/uploadImage", cloudinaryUpload("chat").single("image"), uploadChatImage);

export default router;

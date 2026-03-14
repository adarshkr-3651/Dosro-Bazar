import express from "express";
import { getChatResponse } from "../Controllers/chat.js";

const router = express.Router();

router.post("/", getChatResponse);

export default router;

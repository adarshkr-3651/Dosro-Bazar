import express from "express";
import { generateDescription } from "../Controllers/description.js";

const router = express.Router();

router.post("/", generateDescription);

export default router;

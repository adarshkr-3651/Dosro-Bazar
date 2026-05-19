import express from "express";
import { getFooterLinks } from "../Controllers/footerLinkController.js";

const router = express.Router();

router.get("/", getFooterLinks);

export default router;

import express from "express";
import { createAd, getAds, updateAdStatus, deleteAd, submitEnquiry, editAd } from "../Controllers/adController.js";
import { getAccessToRoute } from "../Middlewares/Authorization/auth.js";
import { getAdminAccess } from "../Middlewares/Authorization/adminAuth.js";
import { cloudinaryUpload } from "../Helpers/Libraries/imageUpload.js";

const router = express.Router();

// Public route for frontend
router.get("/", getAds);
router.post("/:id/enquire", submitEnquiry);

// Administrative routes
router.post("/create", [getAccessToRoute, getAdminAccess, cloudinaryUpload("ad").single("image")], createAd);
router.put("/:id/status", [getAccessToRoute, getAdminAccess], updateAdStatus);
router.put("/:id", [getAccessToRoute, getAdminAccess, cloudinaryUpload("ad").single("image")], editAd);
router.delete("/:id", [getAccessToRoute, getAdminAccess], deleteAd);

export default router;

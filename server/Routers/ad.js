import express from "express";
import {
    createAd, getAds, updateAdStatus, deleteAd, submitEnquiry, editAd,
    submitAdminEnquiry, getAdInquiries, updateInquiryStatus, deleteInquiry,
    initiateAdBooking, verifyEsewaPayment, verifyKhaltiPayment, getAdBookings
} from "../Controllers/adController.js";
import { getAccessToRoute } from "../Middlewares/Authorization/auth.js";
import { getAdminAccess } from "../Middlewares/Authorization/adminAuth.js";
import { cloudinaryUpload } from "../Helpers/Libraries/imageUpload.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Specific rate limit for public enquiry (3 emails per 15 minutes per IP)
const enquiryLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: { error: "Too many enquiries. Please try again later." }
});

// Public route for frontend
router.get("/", getAds);
router.post("/inquiry/admin", enquiryLimiter, submitAdminEnquiry); // General ad inquiry for guest/member
router.post("/:id/enquire", enquiryLimiter, submitEnquiry); // Specific ad inquiry

// Booking & Payment
router.post("/book", [cloudinaryUpload("ad").single("image")], initiateAdBooking);
router.get("/payment/verify", verifyEsewaPayment); // Generic (for backward compatibility if any)
router.get("/payment/verify/esewa", verifyEsewaPayment); // Dedicated clean endpoint
router.post("/payment/khalti/verify", verifyKhaltiPayment);

// Administrative routes
router.get("/inquiries/all", [getAccessToRoute, getAdminAccess], getAdInquiries);
router.get("/bookings/all", [getAccessToRoute, getAdminAccess], getAdBookings);
router.put("/inquiries/:id/status", [getAccessToRoute, getAdminAccess], updateInquiryStatus);
router.delete("/inquiries/:id", [getAccessToRoute, getAdminAccess], deleteInquiry);

router.post("/create", [getAccessToRoute, getAdminAccess, cloudinaryUpload("ad").single("image")], createAd);
router.put("/:id/status", [getAccessToRoute, getAdminAccess], updateAdStatus);
router.put("/:id", [getAccessToRoute, getAdminAccess, cloudinaryUpload("ad").single("image")], editAd);
router.delete("/:id", [getAccessToRoute, getAdminAccess], deleteAd);

export default router;

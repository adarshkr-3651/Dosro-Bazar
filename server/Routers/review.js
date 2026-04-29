import express from "express";
import { addReview, getSellerReviews } from "../Controllers/review.js";
import { getAccessToRoute } from "../Middlewares/Authorization/auth.js";

const router = express.Router();

router.post("/add", getAccessToRoute, addReview);
router.get("/seller/:sellerId", getSellerReviews);

export default router;

import express from "express";
const router = express.Router();
import { getAccessToRoute } from "../Middlewares/Authorization/auth.js";
import { placeBid, updateBidStatus, getSellerStats, getItemBids, respondToBidAction } from "../Controllers/bid.js";

router.post("/place", getAccessToRoute, placeBid);
router.post("/status", getAccessToRoute, updateBidStatus);
router.post("/respond", getAccessToRoute, respondToBidAction);
router.get("/stats", getAccessToRoute, getSellerStats);
router.get("/item/:itemId", getItemBids);

export default router;

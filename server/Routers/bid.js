import express from "express";
const router = express.Router();
import { getAccessToRoute } from "../Middlewares/Authorization/auth.js";
import { placeBid, updateBidStatus, getSellerStats, getItemBids, respondToBidAction, getMyBids, updateBid, cancelBid } from "../Controllers/bid.js";

router.post("/place", getAccessToRoute, placeBid);
router.post("/status", getAccessToRoute, updateBidStatus);
router.post("/respond", getAccessToRoute, respondToBidAction);
router.get("/stats", getAccessToRoute, getSellerStats);
router.get("/my", getAccessToRoute, getMyBids);
router.get("/item/:itemId", getItemBids);
router.put("/:bidId/update", getAccessToRoute, updateBid);
router.delete("/:bidId/cancel", getAccessToRoute, cancelBid);

export default router;

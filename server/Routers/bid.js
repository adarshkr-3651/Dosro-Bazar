import express from "express";
const router = express.Router();
import { getAccessToRoute } from "../Middlewares/Authorization/auth.js";
import { placeBid, updateBidStatus } from "../controllers/bid.js";

router.post("/place", getAccessToRoute, placeBid);
router.post("/status", getAccessToRoute, updateBidStatus);

export default router;

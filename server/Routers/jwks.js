import express from "express";
import { getJWKS } from "../Controllers/jwks.js";

const router = express.Router();

// JWKS endpoint (public)
router.get("/.well-known/jwks.json", getJWKS);

export default router;

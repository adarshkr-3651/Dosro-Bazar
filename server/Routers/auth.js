import express from "express";

import { register, login, adminLogin, forgotpassword, resetpassword, getPrivateData, refreshAccessToken, logout, googleLogin, facebookLogin, completeOAuthRegistration, verifyEmail, resendVerificationCode } from "../Controllers/auth.js";

import { getAccessToRoute } from "../Middlewares/Authorization/auth.js";

const router = express.Router();


router.post("/register", register)

router.post("/login", login)

router.post("/admin-login", adminLogin)

router.post("/refresh", refreshAccessToken)

router.post("/google", googleLogin)
router.post("/facebook", facebookLogin)
router.post("/complete-oauth", completeOAuthRegistration)
router.post("/verify-email", verifyEmail)
router.post("/resend-verification", resendVerificationCode)

router.post("/logout", getAccessToRoute, logout)

router.post("/forgotpassword", forgotpassword)

router.put("/resetpassword", resetpassword)

router.get("/private", getAccessToRoute, getPrivateData)


export default router;
import express from "express";
import { getAccessToRoute } from "../Middlewares/Authorization/auth.js";
import { getMyInvoices, getInvoiceDetail } from "../Controllers/invoice.js";

const router = express.Router();

router.get("/my-invoices", getAccessToRoute, getMyInvoices);
router.get("/:id", getAccessToRoute, getInvoiceDetail);

export default router;

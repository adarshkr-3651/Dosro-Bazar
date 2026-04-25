import Invoice from "../Models/Invoice.js";
import asyncErrorWrapper from "express-async-handler";

export const getMyInvoices = asyncErrorWrapper(async (req, res, next) => {
    const userId = req.user._id;

    // Get invoices where user is either buyer or seller
    const invoices = await Invoice.find({
        $or: [{ buyer: userId }, { seller: userId }]
    })
    .populate("buyer", "username photo")
    .populate("seller", "username photo")
    .populate("item", "title images price slug")
    .sort("-createdAt");

    res.status(200).json({
        success: true,
        data: invoices
    });
});

export const getInvoiceDetail = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;

    const invoice = await Invoice.findById(id)
    .populate("buyer", "username photo email phone")
    .populate("seller", "username photo email phone")
    .populate("item", "title content images price location category slug");

    if (!invoice) return next(new Error("Invoice not found"));

    // Authorization check
    if (invoice.buyer._id.toString() !== userId.toString() && 
        invoice.seller._id.toString() !== userId.toString()) {
        return next(new Error("Unauthorized access to invoice"));
    }

    res.status(200).json({
        success: true,
        data: invoice
    });
});

import Review from "../Models/Review.js";
import User from "../Models/user.js";
import Invoice from "../Models/Invoice.js";
import asyncErrorWrapper from "express-async-handler";
import mongoose from "mongoose";

export const addReview = asyncErrorWrapper(async (req, res, next) => {
    const { itemId, sellerId, rating, comment, invoiceId } = req.body;
    const buyerId = req.user._id;

    if (!itemId || !sellerId || !rating || !invoiceId) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // 1. Verify invoice exists and belongs to the buyer
    // Check both by _id (standard) and invoiceId (human-readable string from metadata)
    const query = {
        $or: [
            { invoiceId: invoiceId }
        ]
    };
    
    if (mongoose.isValidObjectId(invoiceId)) {
        query.$or.push({ _id: invoiceId });
    }

    const invoice = await Invoice.findOne(query);
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    if (invoice.buyer.toString() !== buyerId.toString()) {
        return res.status(403).json({ success: false, message: "Only the buyer can rate this transaction" });
    }

    if (invoice.isRated) {
        return res.status(400).json({ success: false, message: "You have already rated this transaction" });
    }

    // 2. Create the review
    const review = await Review.create({
        item: itemId,
        buyer: buyerId,
        seller: sellerId,
        rating,
        comment,
        invoice: invoice._id // Use the found ObjectId, not the string invoiceId
    });

    // 3. Mark invoice as rated
    invoice.isRated = true;
    await invoice.save();

    // 4. Update seller's average rating
    const seller = await User.findById(sellerId);
    if (seller) {
        const currentTotal = (seller.averageRating || 0) * (seller.numReviews || 0);
        const newNumReviews = (seller.numReviews || 0) + 1;
        const newAverage = (currentTotal + rating) / newNumReviews;
        
        seller.numReviews = newNumReviews;
        seller.averageRating = Number(newAverage.toFixed(1)); // Mathematical average rounded to 1 decimal
        await seller.save();
    }

    res.status(201).json({
        success: true,
        message: "Review added successfully",
        data: review
    });
});

export const getSellerReviews = asyncErrorWrapper(async (req, res, next) => {
    const { sellerId } = req.params;

    const reviews = await Review.find({ seller: sellerId })
        .populate("buyer", "username photo")
        .populate("item", "title")
        .sort("-createdAt");

    res.status(200).json({
        success: true,
        data: reviews
    });
});

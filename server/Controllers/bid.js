import asyncErrorWrapper from "express-async-handler";
import Bid from "../models/Bid.js";
import Item from "../models/item.js";
import Notification from "../models/Notification.js";
import CustomError from "../Helpers/error/CustomError.js";

export const placeBid = asyncErrorWrapper(async (req, res, next) => {
    const { amount, itemId } = req.body;
    const buyerId = req.user.id;

    const item = await Item.findById(itemId);
    if (!item) {
        return next(new CustomError("Item not found", 404));
    }

    if (item.author.toString() === buyerId) {
        return next(new CustomError("You cannot bid on your own item", 400));
    }

    // Validation: amount must be >= item min bid or regular price
    const minPrice = item.bidPrice || item.price;
    if (amount < minPrice) {
        return next(new CustomError(`Bid amount must be at least Rs. ${minPrice}`, 400));
    }

    // New Validation: amount must not be double the price
    if (amount > item.price * 2) {
        return next(new CustomError(`Bid amount cannot exceed double the listed price (Rs. ${(item.price * 2).toLocaleString()})`, 400));
    }

    const bid = await Bid.create({
        buyer: buyerId,
        seller: item.author,
        item: itemId,
        amount
    });

    // Create notification for seller
    await Notification.create({
        recipient: item.author,
        sender: buyerId,
        type: "bid_placed",
        message: `You received a new bid of Rs. ${amount} for "${item.title}"`,
        relatedBid: bid._id,
        relatedItem: itemId
    });

    res.status(200).json({
        success: true,
        data: bid
    });
});

export const updateBidStatus = asyncErrorWrapper(async (req, res, next) => {
    const { bidId, status } = req.body; // status: accepted or rejected
    const sellerId = req.user.id;

    if (!["accepted", "rejected"].includes(status)) {
        return next(new CustomError("Invalid status update", 400));
    }

    const bid = await Bid.findById(bidId).populate("item");
    if (!bid) {
        return next(new CustomError("Bid not found", 404));
    }

    if (bid.seller.toString() !== sellerId) {
        return next(new CustomError("You are not authorized to update this bid", 403));
    }

    bid.status = status;
    await bid.save();

    // Create notification for buyer
    const type = status === "accepted" ? "bid_accepted" : "bid_rejected";
    const message = status === "accepted" 
        ? `Your bid of Rs. ${bid.amount} for "${bid.item.title}" was accepted!`
        : `Your bid of Rs. ${bid.amount} for "${bid.item.title}" was rejected.`;

    await Notification.create({
        recipient: bid.buyer,
        sender: sellerId,
        type,
        message,
        relatedBid: bid._id,
        relatedItem: bid.item._id
    });

    res.status(200).json({
        success: true,
        message: `Bid ${status}`
    });
});

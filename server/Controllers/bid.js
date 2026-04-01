import asyncErrorWrapper from "express-async-handler";
import Bid from "../Models/Bid.js";
import Item from "../Models/item.js";
import Notification from "../Models/Notification.js";
import CustomError from "../Helpers/error/CustomError.js";

export const placeBid = asyncErrorWrapper(async (req, res, next) => {
    const { amount, itemId } = req.body;
    const buyerId = req.user.id;
    const buyerUsername = req.user.username;

    if (!itemId || typeof itemId !== 'string') {
        return next(new CustomError("Invalid item ID format", 400));
    }

    const item = await Item.findById(itemId);
    if (!item) {
        return next(new CustomError("Item not found", 404));
    }

    if (item.author.toString() === buyerId) {
        return next(new CustomError("You cannot bid on your own item", 400));
    }

    // Restriction: User can only have one active (pending or accepted) bid per item
    const existingActiveBid = await Bid.findOne({
        buyer: buyerId,
        item: itemId,
        status: { $in: ["pending", "accepted"] }
    });

    if (existingActiveBid) {
        const statusMsg = existingActiveBid.status === "accepted" 
            ? "Your current bid for this item has already been accepted." 
            : "You already have a pending bid for this item. Please wait for a response.";
        return next(new CustomError(statusMsg, 400));
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
        message: `${buyerUsername} placed a new bid of Rs. ${amount} for your item "${item.title}"`,
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

    if (!bidId || typeof bidId !== 'string') {
        return next(new CustomError("Invalid bid ID format", 400));
    }

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

    // Mark the original notification for the seller as read
    await Notification.updateMany(
        { recipient: sellerId, relatedBid: bid._id, type: "bid_placed" },
        { $set: { isRead: true } }
    );

    // Create notification for buyer
    const type = status === "accepted" ? "bid_accepted" : "bid_rejected";
    const message = status === "accepted" 
        ? `${req.user.username} accepted your bid of Rs. ${bid.amount} for "${bid.item.title}"! ✅`
        : `${req.user.username} rejected your bid of Rs. ${bid.amount} for "${bid.item.title}". ❌`;

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

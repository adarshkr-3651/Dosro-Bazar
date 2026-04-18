import asyncErrorWrapper from "express-async-handler";
import Notification from "../Models/Notification.js";

export const getNotifications = asyncErrorWrapper(async (req, res, next) => {
    // Determine the mode: buyer or seller (defaults to showing all if mode is not provided or invalid)
    const { mode } = req.query;

    let query = { recipient: req.user.id };

    // Filter based on mode if provided
    if (mode === 'buyer') {
        // Buyers see when their bids are accepted or rejected
        query.type = { $in: ["bid_accepted", "bid_rejected"] };
    } else if (mode === 'seller') {
        // Sellers see when someone places a bid on their items
        query.type = "bid_placed";
    }

    const notifications = await Notification.find(query)
        .populate("sender", "username photo")
        .populate("relatedItem", "title images slug")
        .populate("relatedBid", "amount status")
        .sort("-createdAt");

    res.status(200).json({
        success: true,
        data: notifications
    });
});

export const markAsRead = asyncErrorWrapper(async (req, res, next) => {
    await Notification.updateMany(
        { recipient: req.user.id, isRead: false },
        { isRead: true }
    );

    res.status(200).json({
        success: true,
        message: "All notifications marked as read"
    });
});

export const markSingleAsRead = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    
    await Notification.findOneAndUpdate(
        { _id: id, recipient: req.user.id },
        { isRead: true }
    );

    res.status(200).json({
        success: true,
        message: "Notification marked as read"
    });
});

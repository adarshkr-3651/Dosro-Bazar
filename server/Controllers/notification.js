import asyncErrorWrapper from "express-async-handler";
import Notification from "../Models/Notification.js";

export const getNotifications = asyncErrorWrapper(async (req, res, next) => {
    // Determine the mode: buyer or seller (defaults to showing all if mode is not provided or invalid)
    const { mode } = req.query;

    let query = { recipient: req.user.id };

    // Filter based on mode if provided
    if (mode === 'buyer') {
        query.$or = [
            { recipientRole: 'buyer' },
            { type: { $in: ["bid_accepted", "bid_rejected"] } } // fallback for old notifications
        ];
    } else if (mode === 'seller') {
        query.$or = [
            { recipientRole: 'seller' },
            { type: "bid_placed" } // fallback for old notifications
        ];
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
export const deleteNotification = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    
    await Notification.findOneAndDelete({ _id: id, recipient: req.user.id });

    res.status(200).json({
        success: true,
        message: "Notification deleted"
    });
});

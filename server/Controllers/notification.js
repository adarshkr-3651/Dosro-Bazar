import asyncErrorWrapper from "express-async-handler";
import Notification from "../Models/Notification.js";

export const getNotifications = asyncErrorWrapper(async (req, res, next) => {
    console.log("[notification controller] getNotifications() - Fetching notifications for user:", req.user.id);
    
    const notifications = await Notification.find({ recipient: req.user.id })
        .populate("sender", "username photo")
        .populate("relatedItem", "title images slug")
        .populate("relatedBid", "amount status")
        .sort("-createdAt");

    console.log("[notification controller] getNotifications() - Found notifications count:", notifications.length);

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

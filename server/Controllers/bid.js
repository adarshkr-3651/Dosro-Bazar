import asyncErrorWrapper from "express-async-handler";
import Bid from "../Models/Bid.js";
import Item from "../Models/item.js";
import Notification from "../Models/Notification.js";
import User from "../Models/user.js";
import Conversation from "../Models/conversation.js";
import Message from "../Models/message.js";
import CustomError from "../Helpers/error/CustomError.js";
import mongoose from "mongoose";

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
        recipientRole: "seller",
        sender: buyerId,
        type: "bid_placed",
        message: `${buyerUsername} placed a new bid of Rs. ${amount} for your item "${item.title}"`,
        relatedBid: bid._id,
        relatedItem: itemId
    });

    // Create notification for buyer (Confirmation)
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });
    
    await Notification.create({
        recipient: buyerId,
        recipientRole: "buyer",
        sender: item.author,
        type: "bid_placed_buyer_copy",
        message: `u placed a bid of rs ${amount} for ${item.title} at ${timeStr} at ${dateStr}`,
        relatedBid: bid._id,
        relatedItem: itemId
    });

    res.status(200).json({
        success: true,
        data: bid
    });
});

export const updateBidStatus = asyncErrorWrapper(async (req, res, next) => {
    const { bidId, status, followUp, metadata } = req.body; // status: accepted or rejected, followUp: share_details, open_chat, wait
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
    let type = status === "accepted" ? "bid_accepted" : "bid_rejected";
    let message = status === "accepted" 
        ? `${req.user.username} accepted your bid of Rs. ${bid.amount} for "${bid.item.title}"! ✅`
        : `${req.user.username} rejected your bid of Rs. ${bid.amount} for "${bid.item.title}". ❌`;

    const notificationData = {
        recipient: bid.buyer,
        recipientRole: "buyer",
        sender: sellerId,
        type,
        message,
        relatedBid: bid._id,
        relatedItem: bid.item._id,
        metadata: metadata || {}
    };

    if (status === "accepted" && followUp) {
        if (followUp === "share_details") {
            notificationData.type = "bid_accepted_share_details";
            notificationData.message = `${req.user.username} accepted your bid of Rs. ${bid.amount} and shared their contact details! 📞`;
            // Metadata should already contain name, phone, email from frontend or we can fetch here
            const seller = await User.findById(sellerId);
            notificationData.metadata = {
                name: seller.username,
                phone: seller.phone,
                email: seller.email,
                ...metadata
            };
        } else if (followUp === "open_chat") {
            notificationData.type = "bid_accepted_open_chat";
            notificationData.message = `${req.user.username} accepted your bid of Rs. ${bid.amount} and started a chat! 💬`;
            
            // Send automatic message
            let conversation = await Conversation.findOne({
                participants: { $all: [sellerId, bid.buyer] },
                item: bid.item._id
            });

            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [sellerId, bid.buyer],
                    item: bid.item._id,
                    unreadCount: {
                        [sellerId.toString()]: 0,
                        [bid.buyer.toString()]: 0
                    }
                });
            }

            const autoMessageText = `Seller has requested a chat with you and also has accepted your bid request of Rs. ${bid.amount}. Please proceed further chat here.`;
            const newMessage = await Message.create({
                conversationId: conversation._id,
                sender: sellerId,
                text: autoMessageText
            });

            conversation.lastMessage = newMessage._id;
            const currentUnread = conversation.unreadCount.get(bid.buyer.toString()) || 0;
            conversation.unreadCount.set(bid.buyer.toString(), currentUnread + 1);
            await conversation.save();

            // Emit socket event if possible (req.io)
            if (req.io) {
                req.io.to(bid.buyer.toString()).emit("newMessage", {
                    message: newMessage,
                    conversationId: conversation._id,
                    itemId: bid.item._id
                });
            }
        } else if (followUp === "wait") {
            notificationData.type = "bid_accepted_wait";
            notificationData.message = `${req.user.username} accepted your bid of Rs. ${bid.amount} and is waiting for your response! ⏳`;
        }
    }

    await Notification.create(notificationData);

    res.status(200).json({
        success: true,
        message: `Bid ${status}`,
        followUp
    });
});

export const respondToBidAction = asyncErrorWrapper(async (req, res, next) => {
    const { bidId, action, metadata } = req.body; // action: share_details, open_chat, close_deal
    const buyerId = req.user.id;

    const bid = await Bid.findById(bidId).populate("item");
    if (!bid) return next(new CustomError("Bid not found", 404));

    if (bid.buyer.toString() !== buyerId) {
        return next(new CustomError("You are not authorized for this action", 403));
    }

    let type, message;
    const buyer = await User.findById(buyerId);

    if (action === "share_details") {
        type = "buyer_responded_contact_shared";
        message = `${req.user.username} shared their contact details for "${bid.item.title}". 📞`;
    } else if (action === "open_chat") {
        type = "buyer_responded_open_chat";
        message = `${req.user.username} opened a chat for "${bid.item.title}". 💬`;
        
        // Ensure conversation exists
        let conversation = await Conversation.findOne({
            participants: { $all: [buyerId, bid.seller] },
            item: bid.item._id
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [buyerId, bid.seller],
                item: bid.item._id,
                unreadCount: {
                    [buyerId.toString()]: 0,
                    [bid.seller.toString()]: 0
                }
            });
        }
    } else if (action === "close_deal") {
        type = "deal_closed";
        message = `${req.user.username} wants to close the deal for "${bid.item.title}"! 🎉`;
    }

    await Notification.create({
        recipient: bid.seller,
        recipientRole: "seller",
        sender: buyerId,
        type,
        message,
        relatedBid: bid._id,
        relatedItem: bid.item._id,
        metadata: {
            name: buyer.username,
            phone: buyer.phone,
            email: buyer.email,
            ...metadata
        }
    });

    res.status(200).json({
        success: true,
        message: `Response sent: ${action}`
    });
});

export const getSellerStats = asyncErrorWrapper(async (req, res, next) => {
    const sellerId = req.user.id;

    // 1. Count pending bids for the seller's items
    const pendingBidsCount = await Bid.countDocuments({
        seller: sellerId,
        status: "pending"
    });

    // 2. Sum up total sales (accepted bids)
    const salesData = await Bid.aggregate([
        {
            $match: {
                seller: new mongoose.Types.ObjectId(sellerId),
                status: "accepted"
            }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount" }
            }
        }
    ]);

    const totalSales = salesData.length > 0 ? salesData[0].totalAmount : 0;

    res.status(200).json({
        success: true,
        data: {
            pendingBidsCount,
            totalSales
        }
    });
});

export const getItemBids = asyncErrorWrapper(async (req, res, next) => {
    const { itemId } = req.params;

    if (!itemId) {
        return next(new CustomError("Item ID is required", 400));
    }

    const bids = await Bid.find({ 
        item: itemId,
        status: { $in: ["pending", "accepted"] }
    }).select("amount status");

    res.status(200).json({
        success: true,
        data: bids
    });
});

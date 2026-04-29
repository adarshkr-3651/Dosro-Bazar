import asyncErrorWrapper from "express-async-handler";
import Bid from "../Models/Bid.js";
import Item from "../Models/item.js";
import Notification from "../Models/Notification.js";
import User from "../Models/user.js";
import Conversation from "../Models/conversation.js";
import Message from "../Models/message.js";
import CustomError from "../Helpers/error/CustomError.js";
import mongoose from "mongoose";
import sendEmail from "../Helpers/Libraries/sendEmail.js";
import { bidAcceptedTemplate } from "../Helpers/Libraries/emailTemplates.js";

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
            ? "Your current bid for this item has already been accepted. To see details: Profile -> My Bids."
            : "You already have a pending bid for this item. Please wait for a response. To manage your offers: Profile -> My Bids.";
        return next(new CustomError(statusMsg, 400));
    }

    // Validation: if seller hasn't fixed any minimum bid, floor is listingPrice - 25%. Cap is listingPrice * 2.
    const listingPrice = item.price;
    const sellerMinBid = item.bidPrice;
    
    const minAllowedBid = (sellerMinBid && sellerMinBid > 0) 
        ? sellerMinBid 
        : Math.round(listingPrice * 0.75);
    
    const maxAllowedBid = listingPrice * 2;

    if (amount < minAllowedBid) {
        return next(new CustomError(`Bid amount must be at least Rs. ${minAllowedBid.toLocaleString()} ${!sellerMinBid ? "(75% of listing price)" : ""}`, 400));
    }

    if (amount > maxAllowedBid) {
        return next(new CustomError(`Bid amount cannot exceed Rs. ${maxAllowedBid.toLocaleString()} (2x listing price)`, 400));
    }

    const bid = await Bid.create({
        buyer: buyerId,
        seller: item.author,
        item: itemId,
        amount
    });

    // Create notification for seller
    const sellerNotif = await Notification.create({
        recipient: item.author,
        recipientRole: "seller",
        sender: buyerId,
        type: "bid_placed",
        message: `${buyerUsername} placed a new bid of Rs. ${amount} for your item "${item.title}"`,
        relatedBid: bid._id,
        relatedItem: itemId
    });

    // Emit real-time event to seller
    if (req.io) {
        req.io.to(item.author.toString()).emit("newNotification", sellerNotif);
    }

    // Create notification for buyer (Confirmation)
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });

    const buyerNotif = await Notification.create({
        recipient: buyerId,
        recipientRole: "buyer",
        sender: item.author,
        type: "bid_placed_buyer_copy",
        message: `Success! Your bid of Rs. ${amount.toLocaleString()} for "${item.title}" was placed on ${dateStr} at ${timeStr}.`,
        relatedBid: bid._id,
        relatedItem: itemId
    });

    // Emit real-time event to buyer
    if (req.io) {
        req.io.to(buyerId.toString()).emit("newNotification", buyerNotif);
    }

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
    
    if (!bid.item) {
        return next(new CustomError("The item associated with this bid no longer exists", 404));
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
            const seller = await User.findById(sellerId);
            notificationData.metadata = {
                name: seller.username,
                phone: seller.phone,
                email: seller.email,
                ...metadata
            };

            // 1. Also Send via Chat automatically
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

            const contactMsg = `Hello! I have accepted your bid of Rs. ${bid.amount} for "${bid.item.title}". Here are my contact details:\n\n` +
                               `👤 Name: ${seller.username}\n` +
                               `📞 Phone: ${seller.phone || 'Not provided'}\n` +
                               `📧 Email: ${seller.email || 'Not provided'}\n\n` +
                               `Please contact me to finalize the deal.`;

            const newMessage = await Message.create({
                conversationId: conversation._id,
                sender: sellerId,
                text: contactMsg
            });

            conversation.lastMessage = newMessage._id;
            const currentUnread = conversation.unreadCount.get(bid.buyer.toString()) || 0;
            conversation.unreadCount.set(bid.buyer.toString(), currentUnread + 1);
            await conversation.save();

            if (req.io) {
                req.io.to(bid.buyer.toString()).emit("newMessage", {
                    message: newMessage,
                    conversationId: conversation._id,
                    itemId: bid.item._id
                });
            }

            // 2. Also Send via Email automatically
            const buyer = await User.findById(bid.buyer);
            if (buyer && buyer.email) {
                sendEmail({
                    to: buyer.email,
                    subject: `✅ Bid Accepted: "${bid.item.title}"`,
                    html: bidAcceptedTemplate(
                        buyer.username,
                        seller.username,
                        bid.item.title,
                        bid.amount,
                        seller.phone,
                        seller.email
                    )
                }).catch(err => console.error("Bid acceptance email failed:", err.message));
            }
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
    if (!bid.item) return next(new CustomError("Associated item not found", 404));

    if (bid.buyer.toString() !== buyerId) {
        return next(new CustomError("You are not authorized for this action", 403));
    }

    let type, message;
    const buyer = await User.findById(buyerId);
    if (!buyer) {
        return next(new CustomError("Buyer account not found", 404));
    }

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

    // 2. Sum up total sales from items marked as "sold"
    const salesData = await Item.aggregate([
        {
            $match: {
                author: new mongoose.Types.ObjectId(sellerId),
                status: "sold"
            }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$soldPrice" },
                count: { $sum: 1 }
            }
        }
    ]);

    const totalSales = salesData.length > 0 ? salesData[0].totalAmount : 0;
    const soldItemsCount = salesData.length > 0 ? salesData[0].count : 0;

    res.status(200).json({
        success: true,
        data: {
            pendingBidsCount,
            totalSales,
            soldItemsCount
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
    })
    .populate("buyer", "username")
    .select("amount status createdAt buyer");

    res.status(200).json({
        success: true,
        data: bids
    });
});
export const getMyBids = asyncErrorWrapper(async (req, res, next) => {
    const buyerId = req.user.id;

    const bids = await Bid.find({ buyer: buyerId })
        .populate("item", "title price images slug")
        .populate("seller", "username phone email")
        .sort("-createdAt");

    res.status(200).json({
        success: true,
        data: bids
    });
});

export const updateBid = asyncErrorWrapper(async (req, res, next) => {
    const { bidId } = req.params;
    const { amount } = req.body;
    const buyerId = req.user.id;

    const bid = await Bid.findById(bidId).populate("item");
    if (!bid) return next(new CustomError("Bid not found", 404));
    if (!bid.item) return next(new CustomError("Associated item not found", 404));

    if (bid.buyer.toString() !== buyerId) {
        return next(new CustomError("You are not authorized to edit this bid", 403));
    }

    if (bid.status !== "pending" && bid.status !== "rejected") {
        return next(new CustomError(`You cannot edit a bid that is already ${bid.status}`, 400));
    }

    if (bid.status === "rejected") {
        // Enforce that new amount must be greater than previous rejected amount
        if (amount <= bid.amount) {
            return next(new CustomError(`Reapplied bid must be greater than your previous rejected bid of Rs. ${bid.amount.toLocaleString()}`, 400));
        }
        bid.status = "pending";
    }

    // Validation: if seller hasn't fixed any minimum bid, floor is listingPrice - 25%. Cap is listingPrice * 2.
    const listingPrice = bid.item.price;
    const sellerMinBid = bid.item.bidPrice;
    
    const minAllowedBid = (sellerMinBid && sellerMinBid > 0) 
        ? sellerMinBid 
        : Math.round(listingPrice * 0.75);
    
    const maxAllowedBid = listingPrice * 2;

    if (amount < minAllowedBid) {
        return next(new CustomError(`Bid amount must be at least Rs. ${minAllowedBid.toLocaleString()} ${!sellerMinBid ? "(75% of listing price)" : ""}`, 400));
    }

    if (amount > maxAllowedBid) {
        return next(new CustomError(`Bid amount cannot exceed Rs. ${maxAllowedBid.toLocaleString()} (2x listing price)`, 400));
    }

    const oldAmount = bid.amount;
    bid.amount = amount;
    await bid.save();

    // Delete previous notifications for this specific bid to avoid clutter
    await Notification.deleteMany({
        relatedBid: bidId,
        $or: [
            { recipient: bid.seller, type: { $in: ["bid_placed", "bid_updated"] } },
            { recipient: buyerId, type: { $in: ["bid_placed_buyer_copy", "bid_updated_buyer_copy"] } }
        ]
    });

    // Notify seller
    const sellerUpdateNotif = await Notification.create({
        recipient: bid.seller,
        recipientRole: "seller",
        sender: buyerId,
        type: "bid_updated",
        message: `${req.user.username} updated their bid for "${bid.item.title}" from Rs. ${oldAmount.toLocaleString()} to Rs. ${amount.toLocaleString()}`,
        relatedBid: bid._id,
        relatedItem: bid.item._id
    });

    // Emit real-time event to seller
    if (req.io) {
        req.io.to(bid.seller.toString()).emit("newNotification", sellerUpdateNotif);
    }

    // Notify buyer (Confirmation)
    const buyerUpdateNotif = await Notification.create({
        recipient: buyerId,
        recipientRole: "buyer",
        sender: bid.seller,
        type: "bid_updated_buyer_copy",
        message: `Success! You have updated your bid for "${bid.item.title}" to Rs. ${amount.toLocaleString()}.`,
        relatedBid: bid._id,
        relatedItem: bid.item._id
    });

    // Emit real-time event to buyer
    if (req.io) {
        req.io.to(buyerId.toString()).emit("newNotification", buyerUpdateNotif);
    }

    res.status(200).json({
        success: true,
        message: "Bid updated successfully",
        data: bid
    });
});

export const cancelBid = asyncErrorWrapper(async (req, res, next) => {
    const { bidId } = req.params;
    const buyerId = req.user.id;

    const bid = await Bid.findById(bidId).populate("item");
    if (!bid) return next(new CustomError("Bid not found", 404));
    if (!bid.item) return next(new CustomError("Associated item not found", 404));

    if (bid.buyer.toString() !== buyerId) {
        return next(new CustomError("You are not authorized to cancel this bid", 403));
    }

    if (bid.status === "accepted") {
        return next(new CustomError("You cannot cancel a bid that has already been accepted", 400));
    }

    bid.status = "canceled";
    await bid.save();

    // Notify seller
    const sellerCancelNotif = await Notification.create({
        recipient: bid.seller,
        recipientRole: "seller",
        sender: buyerId,
        type: "bid_canceled",
        message: `${req.user.username} canceled their bid of Rs. ${bid.amount} for "${bid.item.title}"`,
        relatedBid: bid._id,
        relatedItem: bid.item._id
    });

    // Emit real-time event to seller
    if (req.io) {
        req.io.to(bid.seller.toString()).emit("newNotification", sellerCancelNotif);
    }

    // Notify buyer (Confirmation)
    const buyerCancelNotif = await Notification.create({
        recipient: buyerId,
        recipientRole: "buyer",
        sender: bid.seller,
        type: "bid_canceled_buyer_copy",
        message: `You canceled your bid for "${bid.item.title}"`,
        relatedBid: bid._id,
        relatedItem: bid.item._id
    });

    // Emit real-time event to buyer
    if (req.io) {
        req.io.to(buyerId.toString()).emit("newNotification", buyerCancelNotif);
    }

    res.status(200).json({
        success: true,
        message: "Bid canceled successfully"
    });
});

import Conversation from "../Models/conversation.js";
import Message from "../Models/message.js";
import asyncErrorWrapper from "express-async-handler";
import CustomError from "../Helpers/error/CustomError.js";

export const getConversations = asyncErrorWrapper(async (req, res, next) => {
    const userId = req.user._id;

    const conversations = await Conversation.find({ participants: userId })
        .populate("participants", "username photo isOnlineVisible")
        .populate("item", "title images price slug")
        .populate({
            path: 'lastMessage',
            select: 'text createdAt sender'
        })
        .sort({ updatedAt: -1 });

    const processedConversations = conversations.map(conv => {
        const convObj = conv.toObject();
        convObj.participants = convObj.participants.map(p => {
            // Respect incognito users
            if (p.isOnlineVisible === false) {
                return { ...p, isOnline: false };
            }
            // See if they have an active socket room
            const room = req.io.sockets.adapter.rooms.get(p._id.toString());
            return { ...p, isOnline: room ? room.size > 0 : false };
        });
        return convObj;
    });

    return res.status(200).json({
        success: true,
        data: processedConversations
    });
});

export const getMessages = asyncErrorWrapper(async (req, res, next) => {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        return next(new CustomError("Conversation not found", 404));
    }

    if (!conversation.participants.includes(userId)) {
        return next(new CustomError("You are not part of this conversation", 403));
    }

    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

    // Clear unread count for current user
    if (conversation.unreadCount.get(userId.toString()) > 0) {
        conversation.unreadCount.set(userId.toString(), 0);
        await conversation.save();
    }

    return res.status(200).json({
        success: true,
        data: messages
    });
});

export const sendMessage = asyncErrorWrapper(async (req, res, next) => {
    const { receiverId, itemId, text, image, location } = req.body;
    const senderId = req.user._id;

    if (!text && !image && !location) {
        return next(new CustomError("You must provide text, an image, or a location", 400));
    }

    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
        item: itemId
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [senderId, receiverId],
            item: itemId,
            unreadCount: {
                [senderId.toString()]: 0,
                [receiverId.toString()]: 0
            }
        });
    }

    const newMessage = await Message.create({
        conversationId: conversation._id,
        sender: senderId,
        text,
        image,
        location
    });

    conversation.lastMessage = newMessage._id;
    // Increment unread count for receiver
    const currentUnread = conversation.unreadCount.get(receiverId.toString()) || 0;
    conversation.unreadCount.set(receiverId.toString(), currentUnread + 1);
    await conversation.save();

    // If socket.io is attached to the request, emit real-time event
    if (req.io) {
        // We emit to the receiver's dedicated room
        req.io.to(receiverId.toString()).emit("newMessage", {
            message: newMessage,
            conversationId: conversation._id,
            itemId: itemId
        });
        
        // Also emit to conversation room if using specific rooms
        req.io.to(conversation._id.toString()).emit("conversationMessage", newMessage);
    }

    return res.status(201).json({
        success: true,
        data: newMessage
    });
});

export const deleteMessage = asyncErrorWrapper(async (req, res, next) => {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
        return next(new CustomError("Message not found", 404));
    }

    // Check if the requester is the sender
    if (message.sender.toString() !== userId.toString()) {
        return next(new CustomError("You can only delete your own messages", 403));
    }

    const conversationId = message.conversationId;
    await message.deleteOne();

    // Check if it was the last message of the conversation
    const conversation = await Conversation.findById(conversationId);
    if (conversation && conversation.lastMessage && conversation.lastMessage.toString() === messageId) {
        // Find the new last message
        const newLastMessage = await Message.findOne({ conversationId }).sort({ createdAt: -1 });
        conversation.lastMessage = newLastMessage ? newLastMessage._id : null;
        await conversation.save();
    }

    // Emit event to both participants
    if (req.io) {
        req.io.to(conversationId.toString()).emit("messageDeleted", { messageId, conversationId });
    }

    return res.status(200).json({
        success: true,
        message: "Message deleted successfully"
    });
});

export const deleteConversation = asyncErrorWrapper(async (req, res, next) => {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
        return next(new CustomError("Conversation not found", 404));
    }

    // Check if the requester is a participant
    if (!conversation.participants.includes(userId)) {
        return next(new CustomError("You are not part of this conversation", 403));
    }

    // Delete all messages in this conversation
    await Message.deleteMany({ conversationId });

    // Delete the conversation itself
    await conversation.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Conversation deleted successfully"
    });
});

export const uploadChatImage = asyncErrorWrapper(async (req, res, next) => {
    if (!req.file) {
        return next(new CustomError("Please provide an image", 400));
    }

    // Cloudinary returns the full secure URL in req.file.path
    const imageUrl = req.file.path;

    return res.status(200).json({
        success: true,
        data: imageUrl
    });
});

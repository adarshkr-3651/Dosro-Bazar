import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }],
    item: {
        type: mongoose.Schema.ObjectId,
        ref: "Item",
        required: true
    },
    lastMessage: {
        type: mongoose.Schema.ObjectId,
        ref: "Message"
    },
    unreadCount: {
        type: Map,
        of: Number,
        default: {}
    }
}, { timestamps: true });

export default mongoose.model("Conversation", ConversationSchema);

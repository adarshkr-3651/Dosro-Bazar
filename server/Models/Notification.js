import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    recipientRole: {
        type: String,
        enum: ["buyer", "seller"],
        required: true
    },
    type: {
        type: String,
        enum: [
            "bid_placed", 
            "bid_placed_buyer_copy",
            "bid_accepted", 
            "bid_rejected", 
            "bid_accepted_share_details", 
            "bid_accepted_open_chat", 
            "bid_accepted_wait",
            "buyer_responded_contact_shared",
            "buyer_responded_open_chat",
            "deal_closed",
            "item_deleted"
        ],
        required: true
    },
    metadata: {
        type: Map,
        of: String
    },
    message: {
        type: String,
        required: true
    },
    relatedBid: {
        type: mongoose.Schema.ObjectId,
        ref: "Bid"
    },
    relatedItem: {
        type: mongoose.Schema.ObjectId,
        ref: "Item"
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);

export default Notification;

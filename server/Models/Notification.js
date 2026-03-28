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
    type: {
        type: String,
        enum: ["bid_placed", "bid_accepted", "bid_rejected"],
        required: true
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

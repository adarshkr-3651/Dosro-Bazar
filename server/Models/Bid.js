import mongoose from "mongoose";

const BidSchema = new mongoose.Schema({
    buyer: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    seller: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    item: {
        type: mongoose.Schema.ObjectId,
        ref: "Item",
        required: true
    },
    amount: {
        type: Number,
        required: [true, "Please provide a bid amount"],
        min: [0, "Bid amount cannot be negative"]
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    }
}, { timestamps: true });

const Bid = mongoose.models.Bid || mongoose.model("Bid", BidSchema);

export default Bid;

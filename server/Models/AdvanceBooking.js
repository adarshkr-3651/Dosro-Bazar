import mongoose from "mongoose";

const AdvanceBookingSchema = new mongoose.Schema({
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
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    paymentMethod: {
        type: String,
        enum: ["esewa", "khalti"],
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "failed"],
        default: "pending"
    }
}, { timestamps: true });

const AdvanceBooking = mongoose.models.AdvanceBooking || mongoose.model("AdvanceBooking", AdvanceBookingSchema);

export default AdvanceBooking;

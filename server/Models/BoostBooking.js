import mongoose from "mongoose";

const BoostBookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    item: {
        type: mongoose.Schema.ObjectId,
        ref: "Item",
        required: true
    },
    plan: {
        type: String,
        enum: ['59', '99', '199'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    taxAmount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['esewa', 'khalti'],
        required: true
    },
    transactionUuid: {
        type: String,
        unique: true,
        required: true
    },
    gatewayRef: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'boost_bookings'
});

const BoostBooking = mongoose.model("BoostBooking", BoostBookingSchema);

export default BoostBooking;

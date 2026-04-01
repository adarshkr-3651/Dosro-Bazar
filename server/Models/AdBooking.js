import mongoose from "mongoose";

const AdBookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    companyName: {
        type: String,
        required: [true, "Please provide a company name"]
    },
    companyEmail: {
        type: String,
        required: [true, "Please provide a company email"]
    },
    phone: {
        type: String,
        required: [true, "Please provide a contact phone"]
    },
    imageUrl: {
        type: String,
        required: [true, "Please provide an advertisement image"]
    },
    plan: {
        type: String,
        enum: ['Basic', 'Standard', 'Premium'],
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    placement: {
        type: String,
        enum: ['main_banner', 'sidebar', 'footer'],
        default: 'main_banner'
    },
    amount: {
        type: Number,
        required: true
    },
    taxAmount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'initiated', 'completed', 'failed'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['esewa', 'khalti'],
        required: true
    },
    transactionUuid: {
        type: String,
        unique: true
    },
    gatewayRef: {
        type: String
    }
}, {
    timestamps: true,
    collection: 'ad_bookings'
});

const AdBooking = mongoose.model("AdBooking", AdBookingSchema);

export default AdBooking;

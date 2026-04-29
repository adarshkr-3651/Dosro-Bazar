import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.ObjectId,
        ref: "Item",
        required: true
    },
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
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true
    },
    invoice: {
        type: mongoose.Schema.ObjectId,
        ref: "Invoice",
        required: true
    }
}, { timestamps: true });

// Prevent duplicate reviews for the same invoice
ReviewSchema.index({ invoice: 1 }, { unique: true });

const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default Review;

import mongoose from "mongoose";

const AdvertisementSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: [true, "Please provide a company name"],
        trim: true
    },
    companyEmail: {
        type: String,
        required: [true, "Please provide a company email address for inquiries"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email"
        ]
    },
    imageUrl: {
        type: String,
        required: [true, "Please provide an advertisement image"]
    },
    plan: {
        type: String,
        enum: ['Basic', 'Standard', 'Premium', 'Elite'],
        default: 'Basic'
    },
    expiryDate: {
        type: Date,
        required: [true, "Please provide an expiry date"]
    },
    status: {
        type: String,
        enum: ['running', 'stopped', 'expired', 'flagged'],
        default: 'running'
    },
    isFlagged: {
        type: Boolean,
        default: false
    },
    moderationReason: {
        type: String,
        default: ""
    },
    placement: {
        type: String,
        enum: ['main_banner', 'sidebar', 'footer'],
        default: 'main_banner'
    },
    clickCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    collection: 'advertisements'
});

// Middleware to check for expiry before returning documents
AdvertisementSchema.pre('find', function() {
    // This is useful for manual checks but we'll mostly handle it in the controller
});

const Advertisement = mongoose.model("Advertisement", AdvertisementSchema);

export default Advertisement;

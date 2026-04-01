import mongoose from "mongoose";

const AdInquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please provide an email address"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email"
        ]
    },
    phone: {
        type: String,
        required: [true, "Please provide a contact number"]
    },
    message: {
        type: String,
        required: [true, "Please provide an inquiry message"]
    },
    adId: {
        type: mongoose.Schema.ObjectId,
        ref: "Advertisement",
        required: false
    },
    type: {
        type: String,
        enum: ['general', 'specific'],
        default: 'general'
    },
    status: {
        type: String,
        enum: ['pending', 'contacted', 'closed'],
        default: 'pending'
    }
}, {
    timestamps: true,
    collection: 'ad_inquiries'
});

const AdInquiry = mongoose.model("AdInquiry", AdInquirySchema);

export default AdInquiry;

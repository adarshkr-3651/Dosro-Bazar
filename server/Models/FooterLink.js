import mongoose from "mongoose";

const FooterLinkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String, // e.g. "About Us", "Help Center", "Terms of Service"
        required: true
    },
    content: {
        type: String, // Markdown or HTML content
        required: true
    },
    order: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const FooterLink = mongoose.models.FooterLink || mongoose.model("FooterLink", FooterLinkSchema, "footerlinks");

export default FooterLink;

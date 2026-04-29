import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.ObjectId,
        ref: "Conversation",
        required: true
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: function() {
            // Text is required only if there is no image or location
            return !this.image && !this.location;
        }
    },
    image: {
        type: String
    },
    location: {
        lat: Number,
        lng: Number,
        name: String
    },
    isRead: {
        type: Boolean,
        default: false
    },
    attachment: {
        url: String,
        name: String,
        fileType: String // e.g., 'pdf'
    }
}, { timestamps: true });

export default mongoose.model("Message", MessageSchema);

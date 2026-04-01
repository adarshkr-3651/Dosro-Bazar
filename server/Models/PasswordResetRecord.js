import mongoose from "mongoose";

const PasswordResetRecordSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: '31d' } // Automatically cleanup old records after 31 days
    }
}, {
    timestamps: false
});

const PasswordResetRecord = mongoose.model("PasswordResetRecord", PasswordResetRecordSchema);

export default PasswordResetRecord;

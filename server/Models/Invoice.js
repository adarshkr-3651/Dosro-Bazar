import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
    invoiceId: {
        type: String,
        unique: true,
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
    item: {
        type: mongoose.Schema.ObjectId,
        ref: "Item",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["paid", "pending", "cancelled"],
        default: "paid"
    }
}, { timestamps: true });

const Invoice = mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);

export default Invoice;

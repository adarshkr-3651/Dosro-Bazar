import mongoose from "mongoose";
import Comment from "./comment.js";
import slugify from "slugify";

const ItemSchema = new mongoose.Schema({

    author: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    title: {
        type: String,
        required: [true, "Please provide a title"],
        minlength: [4, "Please provide a title least 4 characters "],
    },
    content: {
        type: String,
        required: [true, "Please a provide a content "],
        minlength: [10, "Please provide a content least 10 characters "],
    },
    images: {
        type: [String],
        default: ["default.jpg"]
    },
    readtime: {
        type: Number,
        default: 3
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    likeCount: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.ObjectId,
        ref: "Comment"
    }],
    commentCount: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0,
        min: [0, "Price cannot be negative"]
    },
    location: {
        type: String,
        default: ""
    },
    category: {
        type: String,
        default: "Other"
    },
    condition: {
        type: String,
        enum: ["New", "Like New", "Good", "Fair", "Poor"],
        default: "Good"
    },
    isBiddable: {
        type: Boolean,
        default: false
    },
    bidPrice: {
        type: Number,
        default: 0,
        min: [0, "Bid price cannot be negative"]
    },
    offerPrice: {
        type: Number,
        default: 0
    },
    offerDuration: {
        type: String,
        default: ""
    },
    offerUnit: {
        type: String,
        default: "h"
    },
    offerExpiresAt: {
        type: Date
    },
    expiry: {
        type: String,
        default: ""
    },
    expiryDuration: {
        type: String,
        default: ""
    },
    expiryUnit: {
        type: String,
        default: "d"
    },
    deliveryAvailable: {
        type: Boolean,
        default: false
    },
    shippingPartners: {
        type: [String],
        default: []
    },
    deliveryChargeType: {
        type: String,
        enum: ["manual", "buyer_pays"],
        default: "buyer_pays"
    },
    deliveryChargeAmount: {
        type: Number,
        default: 0
    },
    paymentMethods: {
        type: [String],
        default: []
    },
    embeddings: {
        type: [Number],
        default: []
    },
    status: {
        type: String,
        enum: ["active", "sold"],
        default: "active"
    },
    soldTo: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    soldPrice: {
        type: Number
    },
    soldAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date
    }


}, { timestamps: true })

ItemSchema.pre("save", function (next) {

    if (!this.isModified("title")) {
        next();
    }


    this.slug = this.makeSlug()

    next()

})

ItemSchema.pre("remove", async function (next) {

    const item = await Item.findById(this._id)

    await Comment.deleteMany({
        story: item
    })

})

ItemSchema.methods.makeSlug = function () {
    const baseSlug = slugify(this.title, {
        replacement: '-',
        remove: /[*+~.()'"!:@/?]/g,
        lower: true,
        strict: false,
        locale: 'tr',
        trim: true
    })

    // Append last 6 characters of _id to ensure uniqueness
    const suffix = this._id.toString().substring(18);
    return `${baseSlug}-${suffix}`;

}

const Item = mongoose.models.Item || mongoose.model("Item", ItemSchema);

export default Item;
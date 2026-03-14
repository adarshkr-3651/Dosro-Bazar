import mongoose from "mongoose";
import Comment from "./comment.js";
import slugify from "slugify";

const ItemSchema = new mongoose.Schema({

    author: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    slug: String,
    title: {
        type: String,
        required: [true, "Please provide a title"],
        unique: true,
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
    paymentMethods: {
        type: [String],
        default: []
    },
    embeddings: {
        type: [Number],
        default: []
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
    return slugify(this.title, {
        replacement: '-',
        remove: /[*+~.()'"!:@/?]/g,
        lower: true,
        strict: false,
        locale: 'tr',
        trim: true
    })

}

const Item = mongoose.model("Item", ItemSchema)

export default Item;
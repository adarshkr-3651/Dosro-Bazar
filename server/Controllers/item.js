import asyncErrorWrapper from "express-async-handler";
import Item from "../Models/item.js";
import deleteImageFile from "../Helpers/Libraries/deleteImageFile.js";
import { searchHelper, paginateHelper } from "../Helpers/query/queryHelpers.js";
import getEmbeddings from "../Helpers/Libraries/embeddings.js";
import Bid from "../Models/Bid.js";
import Notification from "../Models/Notification.js";
import Conversation from "../Models/conversation.js";
import Message from "../Models/message.js";
import User from "../Models/user.js";
import Invoice from "../Models/Invoice.js";
import AdvanceBooking from "../Models/AdvanceBooking.js";
import crypto from "crypto";
import axios from "axios";
import sendEmail from "../Helpers/Libraries/sendEmail.js";
import { advanceBookingTemplate } from "../Helpers/Libraries/emailTemplates.js";
import BoostBooking from "../Models/BoostBooking.js";
import boostInvoiceTemplate from "../Helpers/Libraries/boostInvoiceTemplate.js";
import { moderateImage } from "../Helpers/Libraries/imageModeration.js";
import itemInvoiceTemplate from "../Helpers/Libraries/itemInvoiceTemplate.js";
import { generatePDF } from "../Helpers/Libraries/pdfGenerator.js";
import { uploadPDF } from "../Helpers/Libraries/cloudinaryUploader.js";
import SystemSetting from "../Models/SystemSetting.js";

const maskExpiredOffer = (item) => {
    // If it's a Mongoose document, convert to object first to safely modify without saving
    const itemObj = (typeof item.toObject === 'function') ? item.toObject() : item;
    
    if (itemObj.offerExpiresAt && new Date(itemObj.offerExpiresAt) < new Date()) {
        itemObj.offerPrice = 0;
        itemObj.offerExpiresAt = null;
        itemObj.offerDuration = "";
        itemObj.offerUnit = "";
    }
    return itemObj;
};

const addItem = asyncErrorWrapper(async (req, res, next) => {
    // console.log("addItem function of Controllers item.js")
    // console.log("[item.js] addItem() - User:", req.user ? req.user.email : "No user")

    const { title, price, location, category, condition, expiry, expiryDuration, expiryUnit, offerPrice, offerDuration, offerUnit, deliveryAvailable, shippingPartners, deliveryChargeType, deliveryChargeAmount, paymentMethods } = req.body;
    let { content } = req.body;

    // Safety check for content
    if (!content) {
        content = "No description provided.";
    }

    const listedPrice = parseFloat(price) || 0;
    const bidPrice = parseFloat(req.body.bidPrice || req.body.minBid) || 0;

    if (listedPrice < 0 || bidPrice < 0) {
        return next(new Error("Price or Bid Price cannot be negative"));
    }

    // console.log("[item.js] addItem() - Item data:", { title, contentLength: content.length, price: listedPrice });

    const wordCount = content.trim().split(/\s+/).length;
    const readtime = Math.max(1, Math.floor(wordCount / 200));

    try {
        // console.log("[item.js] addItem() - Generating embeddings...");
        const embeddings = await getEmbeddings(`${title} ${content.substring(0, 500)}`);

        let offerExpiresAt = null;
        if (parseFloat(offerPrice) > 0 && offerDuration) {
            const duration = parseFloat(offerDuration);
            offerExpiresAt = new Date();
            if (offerUnit === "h") {
                offerExpiresAt.setHours(offerExpiresAt.getHours() + duration);
            } else if (offerUnit === "d") {
                offerExpiresAt.setDate(offerExpiresAt.getDate() + duration);
            }
        }

        // AI Image Moderation Check
        let isFlagged = false;
        let moderationReason = "";
        
        const moderationSetting = await SystemSetting.findOne({ key: "ai_moderation_enabled" });
        const isModerationEnabled = moderationSetting ? moderationSetting.value === true : true; // Default to true if not set

        if (isModerationEnabled && req.files && req.files.length > 0) {
            try {
                const moderationResults = await Promise.all(
                    req.files.map(file => moderateImage(file.path))
                );
                
                const dangerousResults = moderationResults.filter(r => !r.isSafe);
                if (dangerousResults.length > 0) {
                    isFlagged = true;
                    moderationReason = dangerousResults.map(r => r.reason).join(" | ");
                }
            } catch (error) {
                console.error("[ItemController] Image moderation failed:", error.message);
            }
        }

        // console.log("[item.js] addItem() - Creating item in database...");
        const newItem = await Item.create({
            title,
            content,
            author: req.user._id,
            images: (req.files && req.files.length > 0) ? req.files.map(file => file.path) : ["default.jpg"],
            readtime,
            price: listedPrice,
            location,
            category: category || "Other",
            condition: condition || "Good",
            isBiddable: req.body.isBiddable === 'true' || req.body.allowBidding === 'true',
            bidPrice: bidPrice,
            offerPrice: parseFloat(offerPrice) || 0,
            offerDuration: offerDuration || "",
            offerUnit: offerUnit || "h",
            offerExpiresAt: offerExpiresAt,
            expiry: expiry || "",
            expiryDuration: expiryDuration || "",
            expiryUnit: expiryUnit || "d",
            deliveryAvailable: deliveryAvailable === 'true',
            shippingPartners: shippingPartners ? (typeof shippingPartners === 'string' ? JSON.parse(shippingPartners) : shippingPartners) : [],
            deliveryChargeType: deliveryChargeType || "buyer_pays",
            deliveryChargeAmount: parseFloat(deliveryChargeAmount) || 0,
            paymentMethods: paymentMethods ? (typeof paymentMethods === 'string' ? JSON.parse(paymentMethods) : paymentMethods) : [],
            embeddings: embeddings,
            isFlagged: isFlagged,
            moderationReason: moderationReason,
            status: isFlagged ? "flagged" : "active"
        });

        /*
        console.log("[item.js] addItem() - Item created successfully with embeddings:", {
            title: newItem.title,
            embeddingCount: newItem.embeddings?.length || 0
        })
        */
        return res.status(200).json({
            success: true,
            message: "add item successfully ",
            data: newItem
        })
    }

    catch (error) {
        // console.log("[item.js] addItem() - Item creation failed:", error.message)
        deleteImageFile(req)
        return next(error)
    }

})

const getAllItems = asyncErrorWrapper(async (req, res, next) => {
    // console.log("getAllItems function of Controllers item.js")
    // console.log("[item.js] getAllItems() - Query params:", req.query)

    let filter = { isDeleted: { $ne: true }, status: "active" };
    
    if (req.query.author) {
        filter.author = req.query.author;
        delete filter.status; // Show all (active, sold, flagged) for the profile view
    } else if (req.user) {
        // Exclude user's own items from general listing if they are logged in and no specific author is requested
        filter.author = { $ne: req.user._id };
    }

    let query = Item.find(filter);
    // console.log("[item.js] getAllItems() - Initial query created")

    query = searchHelper("title", query, req)
    // console.log("[item.js] getAllItems() - Search helper applied")

    const paginationResult = await paginateHelper(Item, query, req)
    // console.log("[item.js] getAllItems() - Pagination result:", paginationResult)

    query = paginationResult.query;

    query = query.sort("-isBoosted -boostPlan -likeCount -createdAt")
    // console.log("[item.js] getAllItems() - Query sorted by popularity")

    const items = await query
    // console.log("[item.js] getAllItems() - Items retrieved:", items.length, "items")

    // Mask expired offers before sending to client
    const cleanedItems = items.map(item => maskExpiredOffer(item));

    return res.status(200).json(
        {
            success: true,
            count: cleanedItems.length,
            data: cleanedItems,
            page: paginationResult.page,
            pages: paginationResult.pages
        })

})

const detailItem = asyncErrorWrapper(async (req, res, next) => {

    const { slug } = req.params;

    // Note: GET requests typically don't have bodies. 
    // Also, this route is public so req.user might be undefined.

    const item = await Item.findOne({
        slug: slug
    }).populate("author likes")

    if (!item) {
        return next(new CustomError("Item not found", 404));
    }

    let likeStatus = false;

    // Check if user is authenticated (if middleware attached req.user)
    if (req.user) {
        const itemLikeUserIds = item.likes.map(json => json._id.toString())
        likeStatus = itemLikeUserIds.includes(req.user._id.toString())
    }

    if (typeof slug !== 'string') {
        return next(new CustomError("Invalid slug format", 400));
    }

    return res.status(200).
        json({
            success: true,
            data: maskExpiredOffer(item),
            likeStatus: likeStatus
        })

})

const likeItem = asyncErrorWrapper(async (req, res, next) => {

    const { slug } = req.params;

    if (typeof slug !== 'string') {
        return next(new CustomError("Invalid slug format", 400));
    }

    const item = await Item.findOne({ slug }).populate("author likes");

    if (!item) {
        return next(new CustomError("Item not found", 404));
    }

    const activeUser = req.user;
    const itemLikeUserIds = item.likes.map(json => json._id.toString());

    if (!itemLikeUserIds.includes(activeUser._id.toString())) {
        item.likes.push(activeUser._id);
        item.likeCount = item.likes.length;
        await item.save();
    } else {
        const index = itemLikeUserIds.indexOf(activeUser._id.toString());
        item.likes.splice(index, 1);
        item.likeCount = item.likes.length;
        await item.save();
    }

    return res.status(200).
        json({
            success: true,
            data: item
        })

})

const editItemPage = asyncErrorWrapper(async (req, res, next) => {
    const { slug } = req.params;

    const item = await Item.findOne({
        slug: slug
    }).populate("author likes")

    return res.status(200).
        json({
            success: true,
            data: item
        })

})


const editItem = asyncErrorWrapper(async (req, res, next) => {
    const { slug } = req.params;
    const { title, content, price, bidPrice, isBiddable, offerPrice, offerDuration, offerUnit, expiry, expiryDuration, expiryUnit, deliveryAvailable, shippingPartners, deliveryChargeType, deliveryChargeAmount, paymentMethods } = req.body;

    let parsedPrice = parseFloat(price);
    let parsedBidPrice = parseFloat(bidPrice);

    if (isNaN(parsedPrice) || parsedPrice < 0 || (!isNaN(parsedBidPrice) && parsedBidPrice < 0)) {
        return next(new Error("Invalid price or bid price values"));
    }

    const item = await Item.findOne({ slug: slug });

    if (!item) {
        return next(new Error("Item not found"));
    }

    // Ownership check: only the author can edit their own product
    if (item.author.toString() !== req.user._id.toString()) {
        return next(new Error("You are not authorized to edit this product"));
    }

    if (item.title !== title || item.content !== content) {
        // console.log("[item.js] editItem() - Title or context changed. Regenerating embeddings...");
        // console.log("[item.js] editItem() - New embeddings generated:", item.embeddings?.length || 0);
    }

    item.title = title;
    item.content = content;

    // Handle Images
    if (req.files && req.files.length > 0) {
        // Delete old images from Cloudinary to prevent storage leak
        if (item.images && item.images.length > 0) {
            for (const imageUrl of item.images) {
                try {
                    await deleteImageFile(req, imageUrl);
                } catch (err) {
                    console.error(`[item.js] editItem() - Failed to delete old image: ${imageUrl}`, err.message);
                }
            }
        }
        item.images = req.files.map(file => file.path);
    }

    // Update other fields
    item.price = parseFloat(price) || item.price;
    item.bidPrice = parseFloat(bidPrice) || item.bidPrice;
    item.isBiddable = isBiddable === 'true' || isBiddable === true;
    
    // Handle Offers
    const updateOfferPrice = parseFloat(offerPrice);
    if (!isNaN(updateOfferPrice)) {
        // If duration or unit changed, or if it's a new offer
        if (item.offerPrice !== updateOfferPrice || item.offerDuration !== offerDuration || item.offerUnit !== offerUnit) {
            item.offerPrice = updateOfferPrice;
            item.offerDuration = offerDuration;
            item.offerUnit = offerUnit;
            
            if (updateOfferPrice > 0 && offerDuration) {
                const duration = parseFloat(offerDuration);
                let expiresAt = new Date();
                if (offerUnit === "h") {
                    expiresAt.setHours(expiresAt.getHours() + duration);
                } else if (offerUnit === "d") {
                    expiresAt.setDate(expiresAt.getDate() + duration);
                }
                item.offerExpiresAt = expiresAt;
            } else {
                item.offerExpiresAt = null;
            }
        }
    }

    item.expiry = expiry || item.expiry;
    item.expiryDuration = expiryDuration || item.expiryDuration;
    item.expiryUnit = expiryUnit || item.expiryUnit;
    item.deliveryAvailable = deliveryAvailable === 'true' || deliveryAvailable === true;
    item.deliveryChargeType = deliveryChargeType || item.deliveryChargeType;
    item.deliveryChargeAmount = !isNaN(parseFloat(deliveryChargeAmount)) ? parseFloat(deliveryChargeAmount) : item.deliveryChargeAmount;

    if (shippingPartners) {
        try {
            item.shippingPartners = typeof shippingPartners === 'string' ? JSON.parse(shippingPartners) : shippingPartners;
            if (!Array.isArray(item.shippingPartners)) {
                item.shippingPartners = [];
            }
        } catch (e) {
            item.shippingPartners = [];
        }
    }
    
    if (paymentMethods) {
        try {
            item.paymentMethods = typeof paymentMethods === 'string' ? JSON.parse(paymentMethods) : paymentMethods;
            if (!Array.isArray(item.paymentMethods)) {
                item.paymentMethods = [];
            }
        } catch (e) {
            item.paymentMethods = [];
        }
    }

    await item.save();
    // console.log("[item.js] editItem() - Item saved successfully to database.");

    return res.status(200).
        json({
            success: true,
            data: item
        })

})

const deleteItem = asyncErrorWrapper(async (req, res, next) => {

    const { slug } = req.params;

    if (typeof slug !== 'string') {
        return next(new CustomError("Invalid slug format", 400));
    }

    const item = await Item.findOne({ slug });
    if (!item) {
        return next(new CustomError("Item not found", 404));
    }
    
    // Delete all images from Cloudinary
    if (item.images && item.images.length > 0) {
        for (const imageUrl of item.images) {
            try {
                await deleteImageFile(req, imageUrl);
            } catch (err) {
                console.error(`[item.js] deleteItem() - Failed to delete image: ${imageUrl}`, err.message);
            }
        }
    }

    await item.deleteOne();

    return res.status(200).
        json({
            success: true,
            message: "Item delete succesfully "
        })

})

const getMyItems = asyncErrorWrapper(async (req, res, next) => {
    const items = await Item.find({ author: req.user._id, isDeleted: { $ne: true } }).sort("-createdAt");

    return res.status(200).json({
        success: true,
        count: items.length,
        data: items
    })
})


const searchSemantic = asyncErrorWrapper(async (req, res, next) => {
    const { query } = req.query;

    if (!query) {
        return next(new Error("Please provide a search query"));
    }

    // console.log(`[Search] Performing semantic search for query: "${query}"`);
    const embeddings = await getEmbeddings(query);

    if (embeddings.length === 0) {
        console.warn("[Search] Embedding generation failed, falling back to regular search.");
        // Fallback to regular search if embeddings fail
        req.query.search = query;
        return getAllItems(req, res, next);
    }

    // console.log(`[Search] Vector search index: "vector_index", Path: "embeddings", QueryVector length: ${embeddings.length}`);

    const items = await Item.aggregate([
        {
            $vectorSearch: {
                index: "vector_index",
                path: "embeddings",
                queryVector: embeddings,
                numCandidates: 100,
                limit: 10
            }
        },
        {
            $project: {
                embeddings: 0,
                score: { $meta: "vectorSearchScore" }
            }
        }
    ]);

    return res.status(200).json({
        success: true,
        count: items.length,
        data: items.map(item => maskExpiredOffer(item))
    });
});

const getSimilarItems = asyncErrorWrapper(async (req, res, next) => {
    const { slug } = req.params;
    if (typeof slug !== 'string') {
        return next(new CustomError("Invalid slug format", 400));
    }
    const item = await Item.findOne({ slug });

    if (!item || !item.embeddings || item.embeddings.length === 0) {
        return res.status(200).json({ success: true, data: [] });
    }

    const items = await Item.aggregate([
        {
            $vectorSearch: {
                index: "vector_index",
                path: "embeddings",
                queryVector: item.embeddings,
                numCandidates: 100,
                limit: 6
            }
        },
        {
            $match: {
                _id: { $ne: item._id }
            }
        },
        {
            $project: {
                embeddings: 0,
                score: { $meta: "vectorSearchScore" }
            }
        }
    ]);

    return res.status(200).json({
        success: true,
        data: items.map(item => maskExpiredOffer(item))
    });
});

const getRecommendedItems = asyncErrorWrapper(async (req, res, next) => {
    // Basic recommendation: Random top liked items or similar to user's favorites
    // For now, let's simplify: Get items with highest like count that the user hasn't liked yet

    let query = {};
    if (req.user) {
        // Exclude items already liked by user and user's own items
        query = { 
            likes: { $ne: req.user._id },
            author: { $ne: req.user._id },
            status: 'active'
        };
    } else {
        query = { status: 'active' };
    }

    const items = await Item.find(query)
        .sort("-likeCount -createdAt")
        .limit(10);

    return res.status(200).json({
        success: true,
        data: items.map(item => maskExpiredOffer(item))
    });
});

const getAcceptedBidders = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    // Find bids that are 'accepted' for this item
    const bids = await Bid.find({ item: id, status: "accepted" }).populate("buyer", "username photo email phone");

    res.status(200).json({
        success: true,
        data: bids.map(b => b.buyer)
    });
});

const markSold = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { buyerId, soldPrice } = req.body;

    const item = await Item.findById(id);
    if (!item) return next(new Error("Item not found"));

    if (item.author.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
    }

    const buyer = await User.findById(buyerId);
    if (!buyer) return next(new Error("Buyer not found"));

    // Update item status
    item.status = "sold";
    item.soldTo = buyerId;
    item.soldPrice = soldPrice || item.price;
    item.soldAt = new Date();
    await item.save();

    const invoiceId = `INV-${Date.now().toString().slice(-6)}`;
    
    // Create formal Invoice record
    await Invoice.create({
        invoiceId,
        buyer: buyerId,
        seller: req.user._id,
        item: id,
        amount: item.soldPrice
    });

    // --- PDF Generation & Cloudinary Upload ---
    let invoicePdfUrl = "";
    try {
        const htmlContent = itemInvoiceTemplate({
            invoiceId,
            buyerName: buyer.username,
            buyerEmail: buyer.email,
            sellerName: req.user.username,
            sellerEmail: req.user.email,
            itemTitle: item.title,
            amount: item.soldPrice,
            date: item.soldAt
        });
        
        const pdfBuffer = await generatePDF(htmlContent);
        const uploadResult = await uploadPDF(pdfBuffer, 'invoices', invoiceId);
        invoicePdfUrl = uploadResult.secure_url;
        
        // Also send email with PDF attachment
        await sendEmail({
            to: buyer.email,
            subject: `📄 Your Official Invoice: ${item.title}`,
            html: `<p>Hi ${buyer.username}, your deal for <b>${item.title}</b> is closed! Attached is your official PDF invoice.</p>`,
            attachments: [{
                filename: `Invoice-${invoiceId}.pdf`,
                content: pdfBuffer
            }]
        });
    } catch (pdfError) {
        console.error("[markSold] PDF/Email error:", pdfError.message);
        // Continue regardless to not break the deal closing flow
    }

    const invoiceText = `📄 INVOICE: ${invoiceId}\n` +
        `--------------------------\n` +
        `Product: ${item.title}\n` +
        `Price: Rs. ${item.soldPrice.toLocaleString()}\n` +
        (invoicePdfUrl ? `Official PDF: ${invoicePdfUrl}\n` : "") +
        `--------------------------\n` +
        `Thank you for using Dosro Bazar!`;

    // 2. Send Invoice via Chat to the winning buyer
    let conversation = await Conversation.findOne({
        item: id,
        participants: { $all: [req.user._id, buyerId] }
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [req.user._id, buyerId],
            item: id
        });
    }

    const message = await Message.create({
        conversationId: conversation._id,
        sender: req.user._id,
        text: `🤝 Deal Closed! The product "${item.title}" has been sold to ${buyer.username}.\n\nOfficial invoice is attached below.`,
        attachment: invoicePdfUrl ? {
            url: invoicePdfUrl,
            name: `Invoice-${invoiceId}.pdf`,
            fileType: 'pdf'
        } : undefined
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    // Socket emission for winning buyer
    if (req.io) {
        req.io.to(buyerId.toString()).emit("newMessage", {
            message,
            conversationId: conversation._id,
            itemId: id
        });
    }

    // 3. Notify the winning buyer
    await Notification.create({
        recipient: buyerId,
        sender: req.user._id,
        recipientRole: 'buyer',
        type: 'deal_closed',
        message: `Congratulations! Your deal for "${item.title}" is closed. Check your chat for the invoice.`,
        relatedItem: id,
        metadata: { invoiceId, soldPrice: item.soldPrice.toString() }
    });

    // 4. Notify other bidders
    const otherBidders = await Bid.find({ item: id, buyer: { $ne: buyerId } }).distinct("buyer");
    if (otherBidders.length > 0) {
        const notifications = otherBidders.map(bidderId => ({
            recipient: bidderId,
            sender: req.user._id,
            recipientRole: 'buyer',
            type: 'bid_rejected', // Reuse or use a specific type
            message: `The product "${item.title}" has been sold to another buyer.`,
            relatedItem: id
        }));
        await Notification.insertMany(notifications);
    }

    // 5. Send message to all open chats for this item
    const otherConversations = await Conversation.find({
        item: id,
        _id: { $ne: conversation._id }
    });

    for (const conv of otherConversations) {
        const soldMsg = await Message.create({
            conversationId: conv._id,
            sender: req.user._id,
            text: `Notice: This item "${item.title}" has been sold. This conversation is now closed.`
        });
        conv.lastMessage = soldMsg._id;
        await conv.save();

        // Socket emission for other buyers
        if (req.io) {
            const otherParticipant = conv.participants.find(p => p.toString() !== req.user._id.toString());
            if (otherParticipant) {
                req.io.to(otherParticipant.toString()).emit("newMessage", {
                    message: soldMsg,
                    conversationId: conv._id,
                    itemId: id
                });
            }
        }
    }

    res.status(200).json({
        success: true,
        message: "Product marked as sold and notifications sent",
        data: item
    });
});

const moveToRecycleBin = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const item = await Item.findById(id);
    if (!item) return next(new Error("Item not found"));

    if (item.author.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
    }

    item.isDeleted = true;
    item.deletedAt = new Date();
    await item.save();

    // 1. Notify all bidders
    const bidders = await Bid.find({ item: id }).distinct("buyer");
    if (bidders.length > 0) {
        const bidderNotifications = bidders.map(buyerId => ({
            recipient: buyerId,
            sender: req.user._id,
            recipientRole: 'buyer',
            type: 'bid_rejected',
            message: `The product "${item.title}" has been removed from the listing by the seller.`,
            relatedItem: id
        }));
        await Notification.insertMany(bidderNotifications);
    }

    // 2. Remove bid notifications from the seller's view for this product
    await Notification.deleteMany({
        recipient: req.user._id,
        relatedItem: id,
        type: "bid_placed"
    });

    // 3. Notify seller
    await Notification.create({
        recipient: req.user._id,
        sender: req.user._id,
        recipientRole: 'seller',
        type: 'item_deleted',
        message: `You removed "${item.title}" from the listings. It is stored in your Recycle Bin for 30 days.`,
        relatedItem: id
    });

    res.status(200).json({
        success: true,
        message: "Item moved to recycle bin"
    });
});

const getRecycleBin = asyncErrorWrapper(async (req, res, next) => {
    const items = await Item.find({ 
        author: req.user._id, 
        isDeleted: true,
        deletedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
    }).sort("-deletedAt");

    res.status(200).json({
        success: true,
        data: items
    });
});

const restoreFromRecycleBin = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const item = await Item.findOne({ _id: id, author: req.user._id });
    
    if (!item) return next(new Error("Item not found"));

    item.isDeleted = false;
    item.deletedAt = null;
    await item.save();

    res.status(200).json({
        success: true,
        message: "Item restored successfully"
    });
});

const permanentDelete = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const item = await Item.findOne({ _id: id, author: req.user._id });

    if (!item) return next(new Error("Item not found"));

    // Use existing deleteItem logic if possible, or just copy it
    if (item.images && item.images.length > 0) {
        for (const imageUrl of item.images) {
            try {
                await deleteImageFile(req, imageUrl);
            } catch (err) {
                console.error(`[item.js] permanentDelete() - Failed to delete image: ${imageUrl}`, err.message);
            }
        }
    }
    await item.deleteOne();

    res.status(200).json({
        success: true,
        message: "Item permanently deleted"
    });
});

const advanceBook = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { paymentMethod, amount: requestedAmount } = req.body;

    const item = await Item.findById(id);
    if (!item) return next(new Error("Item not found"));
    
    if (item.isBooked) {
        return res.status(400).json({ success: false, error: "This item is already booked" });
    }

    const itemObj = maskExpiredOffer(item);
    const effectivePrice = (itemObj.offerPrice > 0) ? itemObj.offerPrice : itemObj.price;
    const minAdvance = Math.round(effectivePrice * 0.02); // 2% minimum
    const amount = parseInt(requestedAmount) || minAdvance;
    if (amount < minAdvance) {
        return res.status(400).json({ success: false, error: `Minimum advance is Rs. ${minAdvance} (2%)` });
    }
    const transactionUuid = `DB-ADV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Save pending booking record
    await AdvanceBooking.create({
        buyer: req.user._id,
        seller: item.author,
        item: id,
        amount,
        transactionId: transactionUuid,
        paymentMethod,
        status: 'pending'
    });
    
    let paymentParameters = {};
    let payment_url = null;

    if (paymentMethod === 'esewa') {
        const secretKey = (process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q").replace(/"/g, '');
        const productCode = (process.env.ESEWA_PRODUCT_CODE || "EPAYTEST").replace(/"/g, '');
        
        const totalAmountStr = amount.toString();
        const signatureString = `total_amount=${totalAmountStr},transaction_uuid=${transactionUuid},product_code=${productCode}`;
        
        const hash = crypto.createHmac('sha256', secretKey)
            .update(signatureString)
            .digest('base64');
            
        paymentParameters = {
            amount: totalAmountStr,
            tax_amount: "0", 
            total_amount: totalAmountStr,
            transaction_uuid: transactionUuid,
            product_code: productCode,
            product_service_charge: "0",
            product_delivery_charge: "0",
            success_url: `${process.env.SERVER_URL || 'http://localhost:5000'}/item/payment/verify/advance-esewa`,
            failure_url: `${process.env.URI}/payment-failed`,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature: hash
        };
    } else if (paymentMethod === 'khalti') {
        const khaltiSecretKey = (process.env.KHALTI_SECRET_KEY || "key 123456789").replace(/"/g, '').trim(); 
        try {
            const khaltiInit = await axios.post('https://a.khalti.com/api/v2/epayment/initiate/', {
                return_url: `${process.env.SERVER_URL || 'http://localhost:5000'}/item/payment/verify/advance-khalti`,
                website_url: process.env.URI || 'http://localhost:3000',
                amount: Math.round(amount * 100), // Khalti uses Paisa
                purchase_order_id: transactionUuid,
                purchase_order_name: `Advance Book - ${item.title.substring(0, 50)}`,
                customer_info: {
                    name: req.user.username,
                    email: req.user.email,
                    phone: req.user.phone || "9800000000"
                }
            }, {
                headers: { 'Authorization': `Key ${khaltiSecretKey}` }
            });
            payment_url = khaltiInit.data.payment_url;
        } catch (error) {
            console.error("Khalti Init Error:", error.response?.data || error.message);
            return next(new Error("Failed to initialize Khalti payment"));
        }
    }

    res.status(200).json({
        success: true,
        amount,
        paymentMethod,
        parameters: paymentParameters,
        payment_url
    });
});



// --- Post-payment processing helper ---
const processAdvanceBookingSuccess = async (booking, io) => {
    const item = await Item.findById(booking.item).populate('author');
    const buyer = await User.findById(booking.buyer);
    const seller = item.author;
    if (!item || !buyer || !seller) return;

    // Safety: If already booked by someone else, don't re-process
    if (item.isBooked && item.bookedBy?.toString() !== buyer._id.toString()) {
        console.warn(`Attempted to book already booked item: ${item._id}`);
        return;
    }

    // 1. Mark item as booked
    item.isBooked = true;
    item.bookedBy = buyer._id;
    item.bookedAt = new Date();
    item.bookingAmount = booking.amount;
    await item.save();

    // 2. Update booking status
    booking.status = 'confirmed';
    await booking.save();

    // 3. Buyer notification
    await Notification.create({
        recipient: buyer._id,
        sender: seller._id,
        recipientRole: 'buyer',
        type: 'advance_booked_buyer',
        message: `You have successfully booked "${item.title}" with an advance payment of Rs. ${booking.amount.toLocaleString()}. The seller will contact you soon.`,
        relatedItem: item._id
    });

    // 4. Seller notification
    await Notification.create({
        recipient: seller._id,
        sender: buyer._id,
        recipientRole: 'seller',
        type: 'advance_booked_seller',
        message: `${buyer.username} has booked your product "${item.title}" with an advance of Rs. ${booking.amount.toLocaleString()} paid to Dosro Bazar.`,
        relatedItem: item._id,
        metadata: {
            buyerName: buyer.username,
            buyerPhone: buyer.phone || '',
            buyerEmail: buyer.email || '',
            amount: booking.amount.toString()
        }
    });

    // 5. PDF Generation for Advance Booking
    let pdfBuffer = null;
    let invoicePdfUrl = "";
    try {
        const htmlInvoice = advanceBookingTemplate(
            seller.username,
            buyer.username,
            item.title,
            booking.amount,
            buyer.phone,
            buyer.email
        );
        pdfBuffer = await generatePDF(htmlInvoice);
        
        // Upload to Cloudinary for chat accessibility
        const uploadResult = await uploadPDF(pdfBuffer, 'invoices', `ADV-${booking.transactionId}`);
        invoicePdfUrl = uploadResult.secure_url;
    } catch (pdfError) {
        console.error("[processAdvanceBooking] PDF error:", pdfError.message);
    }

    const emailData = {
        from: process.env.EMAIL_USERNAME,
        subject: `🎉 Booking Confirmation: "${item.title}"`,
        html: advanceBookingTemplate(
            seller.username,
            buyer.username,
            item.title,
            booking.amount,
            buyer.phone,
            buyer.email
        ),
        attachments: pdfBuffer ? [{
            filename: `Booking-Invoice-${booking.transactionId}.pdf`,
            content: pdfBuffer
        }] : []
    };

    // To Seller
    if (seller.email) {
        sendEmail({ ...emailData, to: seller.email }).catch(err => console.error('Seller email failed:', err.message));
    }

    // To Buyer
    if (buyer.email) {
        sendEmail({ ...emailData, to: buyer.email }).catch(err => console.error('Buyer email failed:', err.message));
    }

    // To Admin
    sendEmail({ ...emailData, to: process.env.EMAIL_USERNAME, subject: `🏦 [ADMIN] New Advance Payment: ${item.title}` }).catch(err => console.error('Admin email failed:', err.message));

    // 6. Auto chat message from buyer to seller
    let conversation = await Conversation.findOne({
        participants: { $all: [buyer._id, seller._id] },
        item: item._id
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [buyer._id, seller._id],
            item: item._id,
            unreadCount: {
                [buyer._id.toString()]: 0,
                [seller._id.toString()]: 0
            }
        });
    }

    const chatText = `🎉 CONGRATULATIONS! Your product "${item.title}" has been successfully booked by ${buyer.username}.\n\n` +
                     `💰 Advance Paid: Rs. ${booking.amount.toLocaleString()}\n` +
                     `📞 Phone: ${buyer.phone || 'Not provided'}\n` +
                     `📧 Email: ${buyer.email || 'Not provided'}\n\n` +
                     `Official payment receipt is attached below.`;

    const newMessage = await Message.create({
        conversationId: conversation._id,
        sender: buyer._id,
        text: chatText,
        attachment: invoicePdfUrl ? {
            url: invoicePdfUrl,
            name: `Booking-Invoice-${booking.transactionId}.pdf`,
            fileType: 'pdf'
        } : undefined
    });

    conversation.lastMessage = newMessage._id;
    const currentUnread = conversation.unreadCount.get(seller._id.toString()) || 0;
    conversation.unreadCount.set(seller._id.toString(), currentUnread + 1);
    await conversation.save();

    if (io) {
        // Notify Seller
        io.to(seller._id.toString()).emit('newMessage', {
            message: newMessage,
            conversationId: conversation._id,
            itemId: item._id
        });

        // Notify Buyer (to sync their own UI)
        io.to(buyer._id.toString()).emit('newMessage', {
            message: newMessage,
            conversationId: conversation._id,
            itemId: item._id
        });
    }
};

// --- Payment verification endpoints ---
const verifyAdvanceEsewa = asyncErrorWrapper(async (req, res) => {
    const encodedData = req.query.data;
    if (!encodedData) {
        return res.redirect(`${process.env.URI}/payment-failed?reason=missing_data`);
    }

    try {
        const decoded = JSON.parse(Buffer.from(encodedData, 'base64').toString('utf-8'));
        const { transaction_uuid, status } = decoded;

        if (status !== 'COMPLETE') {
            return res.redirect(`${process.env.URI}/?payment_failed=true&reason=incomplete`);
        }

        const booking = await AdvanceBooking.findOne({ transactionId: transaction_uuid }).populate('item');
        if (!booking) {
            return res.redirect(`${process.env.URI}/payment-failed?error=booking_not_found`);
        }

        // Check if already processed (Idempotency)
        if (booking.status === 'confirmed') {
            return res.redirect(`${process.env.URI}/products/${booking.item.slug}/?payment_success=true&type=advance&item=${booking.item._id}&amount=${booking.amount}`);
        }

        await processAdvanceBookingSuccess(booking, req.io);
        return res.redirect(`${process.env.URI}/products/${booking.item.slug}/?payment_success=true&type=advance&item=${booking.item._id}&amount=${booking.amount}`);
    } catch (err) {
        console.error('eSewa verification error:', err);
        return res.redirect(`${process.env.URI}/?payment_failed=true`);
    }
});

const verifyAdvanceKhalti = asyncErrorWrapper(async (req, res) => {
    const { pidx, purchase_order_id } = req.query;

    if (!pidx) {
        return res.redirect(`${process.env.URI}/payment-failed?reason=missing_pidx`);
    }

    try {
        const khaltiSecretKey = (process.env.KHALTI_SECRET_KEY || 'key 123456789').replace(/"/g, '').trim();
        const lookupRes = await axios.post('https://a.khalti.com/api/v2/epayment/lookup/', { pidx }, {
            headers: { 'Authorization': `Key ${khaltiSecretKey}` }
        });

        if (lookupRes.data.status !== 'Completed') {
            return res.redirect(`${process.env.URI}/payment-failed?reason=not_completed`);
        }

        const booking = await AdvanceBooking.findOne({ transactionId: purchase_order_id }).populate('item');
        if (!booking) {
            return res.redirect(`${process.env.URI}/payment-failed?reason=booking_not_found`);
        }

        // Check if already processed
        if (booking.status === 'confirmed') {
            return res.redirect(`${process.env.URI}/products/${booking.item.slug}/?payment_success=true&type=advance&item=${booking.item._id}&amount=${booking.amount}`);
        }

        if (booking.status !== 'pending') {
            return res.redirect(`${process.env.URI}/payment-failed?reason=invalid_status`);
        }

        await processAdvanceBookingSuccess(booking, req.io);
        return res.redirect(`${process.env.URI}/products/${booking.item.slug}/?payment_success=true&type=advance&item=${booking.item._id}&amount=${booking.amount}`);
    } catch (err) {
        console.error('Khalti verification error:', err);
        return res.redirect(`${process.env.URI}/?payment_failed=true`);
    }
});

const getMyBookings = asyncErrorWrapper(async (req, res) => {
    const sellerId = req.user._id;
    const bookings = await AdvanceBooking.find({ seller: sellerId, status: 'confirmed' })
        .populate('buyer', 'username phone email photo')
        .populate('item', 'title images price slug')
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
});


const initiateBoostBooking = asyncErrorWrapper(async (req, res, next) => {
    const { itemId, plan, paymentMethod } = req.body;
    const { id } = req.params;
    
    const item = await Item.findById(itemId || id);
    if (!item) return next(new Error("Item not found"));

    const dailyRates = {
        '59': 59,
        '99': 99,
        '199': 199
    };

    const amount = dailyRates[plan] || 59;
    const taxAmount = 0; // Keeping it simple for now, or use 13% if required
    const totalAmount = amount + taxAmount;
    
    const transactionUuid = `DB-BST-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const booking = await BoostBooking.create({
        user: req.user._id,
        item: item._id,
        plan,
        amount,
        taxAmount,
        totalAmount,
        paymentStatus: 'pending',
        paymentMethod: paymentMethod || 'esewa',
        transactionUuid
    });

    let paymentParameters = {};
    let payment_url = null;

    if (booking.paymentMethod === 'esewa') {
        const secretKey = (process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q").replace(/"/g, '');
        const productCode = (process.env.ESEWA_PRODUCT_CODE || "EPAYTEST").replace(/"/g, '');
        
        const totalAmountStr = totalAmount.toString();
        const signatureString = `total_amount=${totalAmountStr},transaction_uuid=${transactionUuid},product_code=${productCode}`;
        
        const hash = crypto.createHmac('sha256', secretKey)
            .update(signatureString)
            .digest('base64');
            
        paymentParameters = {
            amount: totalAmountStr,
            tax_amount: "0", 
            total_amount: totalAmountStr,
            transaction_uuid: transactionUuid,
            product_code: productCode,
            product_service_charge: "0",
            product_delivery_charge: "0",
            success_url: `${process.env.SERVER_URL || 'http://localhost:5000'}/item/payment/verify/boost-esewa`,
            failure_url: `${process.env.URI}/payment-failed`,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature: hash
        };
    } else if (booking.paymentMethod === 'khalti') {
        const khaltiSecretKey = (process.env.KHALTI_SECRET_KEY || "key 123456789").replace(/"/g, '').trim(); 
        try {
            const khaltiInit = await axios.post('https://a.khalti.com/api/v2/epayment/initiate/', {
                return_url: `${process.env.URI}/payment-verify/boost-khalti`,
                website_url: process.env.URI || 'http://localhost:3000',
                amount: Math.round(totalAmount * 100),
                purchase_order_id: transactionUuid,
                purchase_order_name: `Product Boost - ${item.title}`,
                customer_info: {
                    name: req.user.username,
                    email: req.user.email,
                    phone: req.user.phone || "9800000000"
                }
            }, {
                headers: { 'Authorization': `Key ${khaltiSecretKey}` }
            });
            payment_url = khaltiInit.data.payment_url;
        } catch (error) {
            console.error("Khalti Init Error:", error.response?.data || error.message);
            return next(new Error("Failed to initiate Khalti payment"));
        }
    }

    res.status(200).json({
        success: true,
        bookingId: booking._id,
        totalAmount,
        paymentMethod: booking.paymentMethod,
        parameters: paymentParameters,
        payment_url
    });
});

const verifyBoostEsewa = asyncErrorWrapper(async (req, res) => {
    const { data } = req.query;
    if (!data) return res.redirect(`${process.env.URI}/payment-failed?reason=no_data`);

    const decodedRaw = Buffer.from(data, 'base64').toString();
    const decoded = JSON.parse(decodedRaw);
    
    if (decoded.status !== "COMPLETE") {
        return res.redirect(`${process.env.URI}/payment-failed?reason=not_complete`);
    }

    const booking = await BoostBooking.findOne({ transactionUuid: decoded.transaction_uuid }).populate({
        path: 'item',
        select: 'slug title'
    }).populate('user');
    
    if (!booking) return res.redirect(`${process.env.URI}/?payment_failed=true&reason=booking_not_found`);

    // Check if already processed
    if (booking.paymentStatus === 'completed') {
        return res.redirect(`${process.env.URI}/products/${booking.item.slug}/?payment_success=true&type=boost&item=${booking.item._id}&plan=${booking.plan}&amount=${booking.totalAmount}`);
    }

    booking.paymentStatus = 'completed';
    booking.gatewayRef = decoded.transaction_code;
    await booking.save();

    // Activate Boost on Item
    const item = await Item.findById(booking.item);
    if (item) {
        item.isBoosted = true;
        item.boostPlan = Number(booking.plan);
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 1); // 1 day boost
        item.boostExpiresAt = expiry;
        await item.save();

        const expiryStr = expiry.toISOString().split('T')[0]; // YYYY-MM-DD
        const redirectUrl = `${process.env.URI}/products/${item.slug}/?payment_success=true&type=boost&item=${booking.item._id}&plan=${booking.plan}&amount=${booking.totalAmount}&expiry=${expiryStr}`;
        return res.redirect(redirectUrl);

        // Generate Invoice PDF
        let pdfBuffer = null;
        try {
            const htmlInvoice = boostInvoiceTemplate(booking, item);
            pdfBuffer = await generatePDF(htmlInvoice);
        } catch (pdfError) {
            console.error("[verifyBoostEsewa] PDF error:", pdfError.message);
        }

        const htmlInvoice = boostInvoiceTemplate(booking, item);
        sendEmail({
            to: booking.user.email,
            subject: `[Invoice #BST-${booking.transactionUuid.split('-')[2]}] Product Boost Success`,
            html: htmlInvoice,
            attachments: pdfBuffer ? [{
                filename: `Boost-Invoice-${booking.transactionUuid.split('-')[2]}.pdf`,
                content: pdfBuffer
            }] : []
        }).catch(e => console.warn("Invoice email failed:", e.message));

        // Also notify admin (simplified: using company email from env or same as user for now)
        sendEmail({
            to: process.env.EMAIL_USERNAME, // Admin email
            subject: `[ADMIN] New Product Boost: ${item.title}`,
            html: `<p>User ${booking.user.username} boosted item "${item.title}" for Rs. ${booking.totalAmount}.</p>`
        }).catch(e => console.warn("Admin notification failed:", e.message));
    }
    
    // Fallback redirect if item not found or other issues
    res.redirect(`${process.env.URI}/?payment_success=true&type=boost&status=activated`);
});

const verifyBoostKhalti = asyncErrorWrapper(async (req, res) => {
    const { pidx, amount, purchase_order_id } = req.body;
    const khaltiSecretKey = (process.env.KHALTI_SECRET_KEY || "key 123456789").replace(/"/g, '').trim(); 
    
    try {
        const khaltiResponse = await axios.post('https://a.khalti.com/api/v2/epayment/lookup/', 
            { pidx }, 
            { headers: { 'Authorization': `Key ${khaltiSecretKey}` } }
        );

        if (khaltiResponse.data.status !== 'Completed') {
            return res.status(400).json({ success: false, error: "Payment not completed" });
        }

        const booking = await BoostBooking.findOne({ transactionUuid: purchase_order_id }).populate('user');
        if (!booking) return res.status(404).json({ success: false, error: "Booking not found" });

        // Check if already processed
        if (booking.paymentStatus === 'completed') {
            return res.status(200).json({ success: true, message: "Boost already activated", itemId: booking.item, amount: booking.totalAmount });
        }

        booking.paymentStatus = 'completed';
        booking.gatewayRef = pidx;
        await booking.save();

        const item = await Item.findById(booking.item);
        if (item) {
            item.isBoosted = true;
            item.boostPlan = Number(booking.plan);
            const expiry = new Date();
            expiry.setDate(expiry.getDate() + 1);
            item.boostExpiresAt = expiry;
            await item.save();

            // Generate Invoice PDF
            let pdfBuffer = null;
            try {
                const htmlInvoice = boostInvoiceTemplate(booking, item);
                pdfBuffer = await generatePDF(htmlInvoice);
            } catch (pdfError) {
                console.error("[verifyBoostKhalti] PDF error:", pdfError.message);
            }

            const htmlInvoice = boostInvoiceTemplate(booking, item);
            sendEmail({
                to: booking.user.email,
                subject: `[Invoice #BST-${booking.transactionUuid.split('-')[2]}] Product Boost Success`,
                html: htmlInvoice,
                attachments: pdfBuffer ? [{
                    filename: `Boost-Invoice-${booking.transactionUuid.split('-')[2]}.pdf`,
                    content: pdfBuffer
                }] : []
            }).catch(e => console.warn("Invoice email failed:", e.message));

            sendEmail({
                to: process.env.EMAIL_USERNAME,
                subject: `[ADMIN] New Product Boost: ${item.title}`,
                html: `<p>User ${booking.user.username} boosted item "${item.title}" for Rs. ${booking.totalAmount}.</p>`
            }).catch(e => console.warn("Admin notification failed:", e.message));
        }

        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 1);
        const expiryStr = expiry.toISOString().split('T')[0];

        res.status(200).json({ 
            success: true, 
            message: "Boost activated", 
            itemId: booking.item, 
            amount: booking.totalAmount,
            expiry: expiryStr,
            plan: booking.plan
        });
    } catch (err) {
        console.error('Khalti verification error:', err);
        res.status(500).json({ success: false, error: "Verification failed" });
    }
});

export {
    addItem,
    getAllItems,
    detailItem,
    likeItem,
    editItemPage,
    editItem,
    deleteItem,
    getMyItems,
    searchSemantic,
    getSimilarItems,
    getRecommendedItems,
    getAcceptedBidders,
    markSold,
    moveToRecycleBin,
    getRecycleBin,
    restoreFromRecycleBin,
    permanentDelete,
    advanceBook,
    verifyAdvanceEsewa,
    verifyAdvanceKhalti,
    getMyBookings,
    initiateBoostBooking,
    verifyBoostEsewa,
    verifyBoostKhalti
};
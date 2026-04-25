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
            embeddings: embeddings
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

    let filter = { isDeleted: { $ne: true } };
    
    if (req.query.author) {
        filter.author = req.query.author;
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

    query = query.sort("-likeCount -commentCount -createdAt")
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

    const item = await Item.findOne({ slug: slug })

    // Delete all images from Cloudinary
    if (item.images && item.images.length > 0) {
        for (const imageUrl of item.images) {
            await deleteImageFile(req, imageUrl);
        }
    }

    await item.remove()

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
            author: { $ne: req.user._id }
        };
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

    const invoiceText = `📄 INVOICE: ${invoiceId}\n` +
        `--------------------------\n` +
        `Product: ${item.title}\n` +
        `Seller: ${req.user.username}\n` +
        `Buyer: ${buyer.username}\n` +
        `Price: Rs. ${item.soldPrice.toLocaleString()}\n` +
        `Date: ${item.soldAt.toLocaleString()}\n` +
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
        text: invoiceText
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
            await deleteImageFile(req, imageUrl);
        }
    }
    await item.remove();

    res.status(200).json({
        success: true,
        message: "Item permanently deleted"
    });
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
    permanentDelete
};
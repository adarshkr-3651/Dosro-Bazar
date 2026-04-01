import asyncErrorWrapper from "express-async-handler";
import Item from "../Models/item.js";
import deleteImageFile from "../Helpers/Libraries/deleteImageFile.js";
import { searchHelper, paginateHelper } from "../Helpers/query/queryHelpers.js";
import getEmbeddings from "../Helpers/Libraries/embeddings.js";

const addItem = asyncErrorWrapper(async (req, res, next) => {
    // console.log("addItem function of Controllers item.js")
    // console.log("[item.js] addItem() - User:", req.user ? req.user.email : "No user")

    const { title, price, location, category, condition, expiry, expiryDuration, expiryUnit, offerPrice, offerDuration, offerUnit, deliveryAvailable, paymentMethods } = req.body;
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

    let filter = {};
    if (req.user) {
        // Exclude user's own items from general listing if they are logged in
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

    return res.status(200).json(
        {
            success: true,
            count: items.length,
            data: items,
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
            data: item,
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
    if (typeof slug !== 'string') {
        return next(new CustomError("Invalid slug format", 400));
    }

    let parsedPrice = parseFloat(price);
    let parsedBidPrice = parseFloat(bidPrice);

    if (isNaN(parsedPrice) || parsedPrice < 0 || (!isNaN(parsedBidPrice) && parsedBidPrice < 0)) {
        return next(new CustomError("Invalid price or bid price values", 400));
    }

    const item = await Item.findOne({ slug: slug });

    if (!item) {
        return next(new CustomError("Item not found", 404));
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
    const items = await Item.find({ author: req.user._id }).sort("-createdAt");

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
        data: items
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
        data: items
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
        data: items
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
    getRecommendedItems
};
import FooterLink from "../Models/FooterLink.js";
import asyncErrorWrapper from "express-async-handler";
import CustomError from "../Helpers/error/CustomError.js";

// @desc    Get all footer links
// @route   GET /api/footer-links
// @access  Public
const getFooterLinks = asyncErrorWrapper(async (req, res, next) => {
    console.log("[FooterLinkController] Fetching all footer links...");
    const links = await FooterLink.find().sort({ category: 1, order: 1 });
    res.status(200).json({
        success: true,
        data: links
    });
});

// @desc    Get single footer link by ID
// @route   GET /api/admin/footer-links/:id
// @access  Private/Admin
const getFooterLinkById = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const link = await FooterLink.findById(id);
    if (!link) {
        return next(new CustomError("Footer link not found", 404));
    }
    res.status(200).json({
        success: true,
        data: link
    });
});

// @desc    Create or update footer link
// @route   POST /api/admin/footer-links
// @route   PUT /api/admin/footer-links/:id
// @access  Private/Admin
const createOrUpdateFooterLink = asyncErrorWrapper(async (req, res, next) => {
    const { title, category, content, order } = req.body;
    const { id } = req.params;

    let link;
    if (id) {
        console.log(`[FooterLinkController] Updating link by ID: ${id}`);
        link = await FooterLink.findByIdAndUpdate(
            id,
            { title, category, content, order },
            { new: true, runValidators: true }
        );
        if (!link) {
            return next(new CustomError("Footer link not found", 404));
        }
    } else {
        console.log(`[FooterLinkController] Creating or updating link by title: ${title}`);
        link = await FooterLink.findOne({ title });
        if (link) {
            link.category = category || link.category;
            link.content = content || link.content;
            link.order = order !== undefined ? order : link.order;
            await link.save();
        } else {
            link = await FooterLink.create({ title, category, content, order });
        }
    }

    res.status(200).json({
        success: true,
        message: "Footer link saved successfully",
        data: link
    });
});

// @desc    Delete footer link
// @route   DELETE /api/admin/footer-links/:id
// @access  Private/Admin
const deleteFooterLink = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    console.log(`[FooterLinkController] Deleting link by ID: ${id}`);
    const link = await FooterLink.findById(id);
    if (!link) {
        return next(new CustomError("Footer link not found", 404));
    }
    await FooterLink.findByIdAndDelete(id);
    res.status(200).json({
        success: true,
        message: "Footer link deleted successfully"
    });
});

export {
    getFooterLinks,
    getFooterLinkById,
    createOrUpdateFooterLink,
    deleteFooterLink
};

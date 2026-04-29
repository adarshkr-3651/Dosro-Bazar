import asyncErrorWrapper from "express-async-handler";
import User from "../Models/user.js";
import Item from "../Models/item.js";
import CustomError from "../Helpers/error/CustomError.js";
import { comparePassword, validateUserInput } from "../Helpers/input/inputHelpers.js";
import sendEmail from "../Helpers/Libraries/sendEmail.js";
import { passwordChangeTemplate } from "../Helpers/Libraries/emailTemplates.js";
import verifyIdProof from "../Helpers/Libraries/idVerification.js";

const profile = asyncErrorWrapper(async (req, res, next) => {


    return res.status(200).json({
        success: true,
        data: req.user
    })

})


const editProfile = asyncErrorWrapper(async (req, res, next) => {



    const { email, username, theme, phone, address, idProofType, loginOtpEnabled } = req.body
    
    // Prepare update data
    const user = await User.findById(req.user.id);

    if (email !== undefined) user.email = email;
    if (username !== undefined) user.username = username;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (idProofType !== undefined) user.idProofType = idProofType;
    if (theme && ['light', 'dark', 'system'].includes(theme)) user.theme = theme;
    
    if (loginOtpEnabled !== undefined) {
        const isOtpEnabled = loginOtpEnabled === true || loginOtpEnabled === 'true';
        if (isOtpEnabled && (!user.email || !user.isVerified)) {
            return next(new CustomError("You must have a verified email to enable Login OTP", 400));
        }
        user.loginOtpEnabled = isOtpEnabled;
    }

    if (req.files) {
        if (req.files.photo && req.files.photo[0]) user.photo = req.files.photo[0].path;
        if (req.files.idProof && req.files.idProof[0]) {
            user.idProof = req.files.idProof[0].path;

            // Start verification process if idProof is uploaded


            // Set pending status initially
            user.verificationStatus = 'pending';
            user.verificationFeedback = "ℹ️ Verification in progress...";

            // Run OCR verification
            try {
                const verificationResult = await verifyIdProof(user.idProof, user.idProofType);

                user.verificationStatus = verificationResult.status;
                user.verificationFeedback = verificationResult.feedback;


            } catch (vError) {
                console.error(`[editProfile] Verification failed for user ${user.id}:`, vError);
                user.verificationStatus = 'pending';
                user.verificationFeedback = "ℹ️ OCR service encountered an error. Admin will verify manually.";
            }
        }
    }

    // Recalculate role based on new profile data
    user.updateRoleBasedOnProfile();

    await user.save();

    let responseMessage = "Profile updated successfully!";
    if (req.files && req.files.idProof) {

        if (user.verificationStatus === 'verified') {
            responseMessage = "Profile updated and identity verified successfully! ✅";
        } else if (user.verificationStatus === 'rejected') {
            responseMessage = `Profile updated, but identity verification failed: ${user.verificationFeedback} ⚠️`;
        } else if (user.verificationStatus === 'pending') {
            responseMessage = "Profile updated. Identity verification is pending manual review. ℹ️";
        }
    }



    return res.status(200).json({
        success: true,
        message: responseMessage,
        data: user
    })

})


const changePassword = asyncErrorWrapper(async (req, res, next) => {



    const { newPassword, oldPassword } = req.body

    if (!validateUserInput(newPassword, oldPassword)) {

        return next(new CustomError("Please check your inputs ", 400))

    }

    const user = await User.findById(req.user.id).select("+password")

    if (!comparePassword(oldPassword, user.password)) {
        return next(new CustomError('Old password is incorrect ', 400))
    }

    // Save the new password
    user.password = newPassword;
    await user.save();

    // Send password change notification email (non-blocking)
    const changeTime = new Date().toLocaleString('en-US', {
        dateStyle: 'full',
        timeStyle: 'long'
    });

    // Only send email if user has an email address
    if (user.email) {
        sendEmail({
            from: process.env.EMAIL_USERNAME,
            to: user.email,
            subject: '🔒 Password Changed Successfully',
            html: passwordChangeTemplate(user.username, user.email, changeTime)
        }).catch(error => {
            console.error('[user.js] changePassword() - Failed to send password change notification:', error.message);
            // Don't throw error - email failure shouldn't prevent password change
        });
    }

    return res.status(200).json({
        success: true,
        message: "Password changed successfully"
    });

})


const addItemToReadList = asyncErrorWrapper(async (req, res, next) => {

    const { slug } = req.params;

    if (typeof slug !== 'string') {
        return next(new CustomError("Invalid slug format", 400));
    }

    const item = await Item.findOne({ slug });

    if (!item) {
        return next(new CustomError("Item not found", 404));
    }

    const user = await User.findById(req.user.id);

    if (!user.readList.includes(item._id)) {
        user.readList.push(item._id);
        user.readListLength = user.readList.length;
        await user.save();
    } else {
        const index = user.readList.indexOf(item._id);
        user.readList.splice(index, 1);
        user.readListLength = user.readList.length;
        await user.save();
    }

    const status = user.readList.includes(item._id);

    return res.status(200).json({
        success: true,
        story: item,
        user: user,
        status: status
    })

})

const readListPage = asyncErrorWrapper(async (req, res, next) => {



    const user = await User.findById(req.user.id)
    const readList = []

    for (let index = 0; index < user.readList.length; index++) {

        var item = await Item.findById(user.readList[index]).populate("author")

        readList.push(item)

    }

    return res.status(200).json({
        success: true,
        data: readList
    })

})


const toggleFavorite = asyncErrorWrapper(async (req, res, next) => {
    const { slug } = req.params;

    // Find the item
    if (typeof slug !== 'string') {
        return next(new CustomError("Invalid slug format", 400));
    }
    const item = await Item.findOne({ slug });
    if (!item) {
        return next(new CustomError("Item not found", 404));
    }

    // Find the user
    // We use req.user.id from the auth middleware
    const user = await User.findById(req.user.id);

    if (user.favorites.includes(item._id)) {
        // Remove from favorites
        const index = user.favorites.indexOf(item._id);
        user.favorites.splice(index, 1);
        await user.save();

        return res.status(200).json({
            success: true,
            status: false,
            message: "Removed from favorites"
        });
    } else {
        // Add to favorites
        user.favorites.push(item._id);
        await user.save();

        return res.status(200).json({
            success: true,
            status: true,
            message: "Added to favorites"
        });
    }
});

const getFavorites = asyncErrorWrapper(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate({
        path: "favorites",
        populate: { path: "author", select: "username photo" } // Populate author details just in case
    });

    if (!user) {
        return next(new CustomError("No user found with this ID", 404));
    }

    return res.status(200).json({
        success: true,
        count: user.favorites ? user.favorites.length : 0,
        data: user.favorites || []
    });
});

const toggleOnlineStatus = asyncErrorWrapper(async (req, res, next) => {
    const { isOnlineVisible } = req.body;
    
    const user = await User.findById(req.user.id);
    user.isOnlineVisible = isOnlineVisible;
    await user.save();
    
    return res.status(200).json({
        success: true,
        data: user,
        message: `Online status is now ${isOnlineVisible ? 'Visible' : 'Hidden'}`
    });
});

export {
    profile,
    editProfile,
    changePassword,
    addItemToReadList,
    readListPage,
    toggleFavorite,
    getFavorites,
    toggleOnlineStatus
};


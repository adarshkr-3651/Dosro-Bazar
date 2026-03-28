import Advertisement from "../Models/Advertisement.js";
import CustomError from "../Helpers/error/CustomError.js";
import asyncErrorWrapper from "express-async-handler";
import cloudinary from "../Helpers/Libraries/cloudinaryConfig.js";
import sendEmail from "../Helpers/Libraries/sendEmail.js";

const createAd = asyncErrorWrapper(async (req, res, next) => {
    const { companyName, companyEmail, plan, expiryDate, placement } = req.body;

    if (!req.file) {
        return next(new CustomError("Please provide an advertisement image", 400));
    }

    if (!companyEmail) {
        return next(new CustomError("Please provide a company email for inquiries", 400));
    }

    const newAd = await Advertisement.create({
        companyName,
        companyEmail,
        imageUrl: req.file.path, // Scaled by CloudinaryStorage configuration
        plan: plan || 'Basic',
        expiryDate: new Date(expiryDate),
        placement: placement || 'main_banner',
        status: 'running'
    });

    res.status(201).json({
        success: true,
        message: "Advertisement provisioned successfully",
        ad: newAd
    });
});

const getAds = asyncErrorWrapper(async (req, res, next) => {
    const { status, placement } = req.query;
    const queryObject = {};

    if (status) queryObject.status = status;
    if (placement) queryObject.placement = placement;

    // Automatic Expiry Check
    const now = new Date();
    
    // Find ads that are 'running' but should be 'expired'
    const expiredAds = await Advertisement.find({
        status: 'running',
        expiryDate: { $lt: now }
    });

    if (expiredAds.length > 0) {
        console.log(`[AdController] Automatically stopping ${expiredAds.length} expired ads.`);
        await Advertisement.updateMany(
            { _id: { $in: expiredAds.map(ad => ad._id) } },
            { $set: { status: 'expired' } }
        );
    }

    const ads = await Advertisement.find(queryObject).sort("-createdAt");

    res.status(200).json({
        success: true,
        count: ads.length,
        ads
    });
});

const updateAdStatus = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const ad = await Advertisement.findById(id);

    if (!ad) {
        return next(new CustomError("Advertisement not found", 404));
    }

    ad.status = status;
    await ad.save();

    res.status(200).json({
        success: true,
        message: `Advertisement status updated to ${status}`,
        ad
    });
});

const deleteAd = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const ad = await Advertisement.findById(id);

    if (!ad) {
        return next(new CustomError("Advertisement not found", 404));
    }

    // Optionally delete from Cloudinary
    // await cloudinary.uploader.destroy(public_id);

    await ad.remove();

    res.status(200).json({
        success: true,
        message: "Advertisement removed from system"
    });
});

const editAd = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { companyName, companyEmail, plan, placement, expiryDate } = req.body;

    let ad = await Advertisement.findById(id);

    if (!ad) {
        return next(new CustomError("Advertisement not found", 404));
    }

    ad.companyName = companyName || ad.companyName;
    ad.companyEmail = companyEmail || ad.companyEmail;
    ad.plan = plan || ad.plan;
    ad.placement = placement || ad.placement;
    if (expiryDate) {
        ad.expiryDate = new Date(expiryDate);
    }

    // Check if new image was provided
    if (req.file) {
        ad.imageUrl = req.file.path;
    }

    await ad.save();

    res.status(200).json({
        success: true,
        message: "Advertisement successfully revised",
        ad
    });
});

const submitEnquiry = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { name, email, phone, message } = req.body;

    const ad = await Advertisement.findById(id);

    if (!ad) {
        return next(new CustomError("Advertisement not found", 404));
    }

    if (!ad.companyEmail) {
        return next(new CustomError("This advertisement does not accept direct inquiries.", 400));
    }

    // Build the email HTML to send to the company
    const mailOptionsToCompany = {
        from: process.env.EMAIL_USERNAME,
        to: ad.companyEmail,
        subject: `[Dosro Bazar] New Inquiry for your Advertisement`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #10b981;">New Product Inquiry</h2>
                <p>Hello <b>${ad.companyName}</b>,</p>
                <p>A user on Dosro Bazar has expressed interest in your recently deployed advertisement!</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #333;">Lead Details:</h3>
                    <p><strong>Name:</strong> ${name || 'N/A'}</p>
                    <p><strong>Contact/Phone:</strong> ${phone || 'N/A'}</p>
                    <p><strong>Email:</strong> ${email || 'Not provided'}</p>
                    <p><strong>Message:</strong> ${message || 'I am interested in this product and would like more information.'}</p>
                </div>
                
                <p>Please reach out to them directly using the contact information provided.</p>
                <hr style="border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #888;">This is an automated message from your Dosro Bazar Advertisement Node.</p>
            </div>
        `
    };

    try {
        await sendEmail(mailOptionsToCompany);

        // Send a confirmation receipt back to the user ONLY if they provided an email address
        if (email) {
            const mailOptionsToUser = {
                from: process.env.EMAIL_USERNAME,
                to: email,
                subject: `[Dosro Bazar] Inquiry Confirmation: ${ad.companyName}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #10b981; border-radius: 10px;">
                        <h2 style="color: #10b981;">Your Inquiry has been Dispatched</h2>
                        <p>Hi ${name || 'there'},</p>
                        <p>Thank you for your interest! We have successfully forwarded your inquiry directly to <b>${ad.companyName}</b>.</p>
                        <p>They should be reaching out to you shortly regarding the advertisement you interacted with.</p>
                        <p>Regards,<br><b>Dosro Bazar Support Team</b></p>
                    </div>
                `
            };
            // Do not block or throw on failure to send user confirmation
            sendEmail(mailOptionsToUser).catch(e => console.warn("Failed to dispatch user confirmation mail:", e.message));
        }

    } catch (error) {
        return next(new CustomError("Failed to dispatch email. " + error.message, 500));
    }

    res.status(200).json({
        success: true,
        message: "Enquiry successfully dispatched to the vendor"
    });
});

export { createAd, getAds, updateAdStatus, deleteAd, editAd, submitEnquiry };

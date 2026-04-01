import Advertisement from "../Models/Advertisement.js";
import AdInquiry from "../Models/AdInquiry.js";
import AdBooking from "../Models/AdBooking.js";
import CustomError from "../Helpers/error/CustomError.js";
import asyncErrorWrapper from "express-async-handler";
import cloudinary from "../Helpers/Libraries/cloudinaryConfig.js";
import invoiceTemplate from "../Helpers/Libraries/invoiceTemplate.js";
import sendEmail from "../Helpers/Libraries/sendEmail.js";
import crypto from "crypto";
import axios from "axios";

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
        // console.log(`[AdController] Automatically stopping ${expiredAds.length} expired ads.`);
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

    // Delete from Cloudinary
    if (ad.imageUrl) {
        await deleteImageFile(req, ad.imageUrl);
    }

    await ad.remove();

    res.status(200).json({
        success: true,
        message: "Advertisement removed from system"
    });
});

const editAd = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { companyName, companyEmail, plan, placement, expiryDate, status } = req.body;

    let ad = await Advertisement.findById(id);

    if (!ad) {
        return next(new CustomError("Advertisement not found", 404));
    }

    ad.companyName = companyName || ad.companyName;
    ad.companyEmail = companyEmail || ad.companyEmail;
    ad.plan = plan || ad.plan;
    ad.placement = placement || ad.placement;
    ad.status = status || ad.status; // New: allow status update
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

    // New: Save to Database
    await AdInquiry.create({
        name,
        email,
        phone,
        message,
        adId: id,
        type: 'specific',
        status: 'pending'
    });

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

const submitAdminEnquiry = asyncErrorWrapper(async (req, res, next) => {
    const { name, email, phone, message } = req.body;

    // Save to Database
    const inquiry = await AdInquiry.create({
        name,
        email,
        phone,
        message,
        type: 'general', // People wanting to post ads
        status: 'pending'
    });

    // Notify Admin via Email
    const mailOptionsToAdmin = {
        from: process.env.EMAIL_USERNAME,
        to: process.env.EMAIL_USERNAME, // Send to site admin
        subject: `[Dosro Bazar] New Ad Placement Inquiry`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #3b82f6; border-radius: 10px;">
                <h2 style="color: #3b82f6;">Advertising Inquiry</h2>
                <p>Hello Admin,</p>
                <p>A new potential advertiser has reached out regarding ad space on the platform.</p>
                
                <div style="background-color: #f0f7ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #1e40af;">Contact Details:</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong> ${message}</p>
                </div>
                
                <p>Review this inquiry in the <a href="${process.env.URI}/admin/dashboard/ad-inquiry">Admin Dashboard</a>.</p>
            </div>
        `
    };

    try {
        await sendEmail(mailOptionsToAdmin);
    } catch (error) {
        console.error("Failed to notify admin via email:", error.message);
    }

    res.status(201).json({
        success: true,
        message: "Your inquiry has been submitted. We will contact you shortly.",
        data: inquiry
    });
});

const getAdInquiries = asyncErrorWrapper(async (req, res, next) => {
    const inquiries = await AdInquiry.find()
        .populate("adId", "companyName")
        .sort("-createdAt");

    res.status(200).json({
        success: true,
        count: inquiries.length,
        data: inquiries
    });
});

const updateInquiryStatus = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const inquiry = await AdInquiry.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });

    if (!inquiry) {
        return next(new CustomError("Inquiry not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Inquiry status updated",
        data: inquiry
    });
});

const deleteInquiry = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const inquiry = await AdInquiry.findByIdAndDelete(id);

    if (!inquiry) {
        return next(new CustomError("Inquiry not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Inquiry removed"
    });
});

const initiateAdBooking = asyncErrorWrapper(async (req, res, next) => {
    const { companyName, companyEmail, phone, plan, expiryDate, placement } = req.body;
    
    if (!req.file) {
        return next(new CustomError("Please provide an advertisement image.", 400));
    }

    const dailyRates = {
        'Basic': 99,
        'Standard': 199,
        'Premium': 399
    };

    const rate = dailyRates[plan] || 99;
    const today = new Date();
    const expiry = new Date(expiryDate);
    
    // Minimum 1 day calculation
    const timeDiff = expiry.getTime() - today.getTime();
    const days = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));
    
    const amount = rate * days;
    const taxAmount = Math.round(amount * 0.13 * 100) / 100; // 13% VAT
    const totalAmount = amount + taxAmount;
    
    const transactionUuid = `DB-AD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const booking = await AdBooking.create({
        user: req.user?._id,
        companyName,
        companyEmail,
        phone,
        imageUrl: req.file.path,
        plan,
        expiryDate: expiry,
        placement: placement || 'main_banner',
        amount,
        taxAmount,
        totalAmount,
        paymentStatus: 'pending',
        paymentMethod: req.body.paymentMethod || 'esewa',
        transactionUuid
    });

    // Handle eSewa specific parameters (Signature generation)
    let paymentParameters = {};
    if (booking.paymentMethod === 'esewa') {
        const secretKey = (process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q").replace(/"/g, ''); // Ensure no extra quotes
        const productCode = (process.env.ESEWA_PRODUCT_CODE || "EPAYTEST").replace(/"/g, '');
        
        // Exact string representation of the total amount
        const totalAmountStr = totalAmount.toString();
        const transactionUuid = booking.transactionUuid;
        
        // eSewa v2 signature string requirement: 
        // Format: total_amount=VALUE,transaction_uuid=VALUE,product_code=VALUE
        const signatureString = `total_amount=${totalAmountStr},transaction_uuid=${transactionUuid},product_code=${productCode}`;
        
        // Generate HMAC-SHA256 signature
        const hash = crypto.createHmac('sha256', secretKey)
            .update(signatureString)
            .digest('base64');
            
        paymentParameters = {
            amount: totalAmountStr, // amount = total_amount - tax (if tax_amount is "0")
            tax_amount: "0", 
            total_amount: totalAmountStr,
            transaction_uuid: transactionUuid,
            product_code: productCode,
            product_service_charge: "0",
            product_delivery_charge: "0",
            success_url: `${process.env.SERVER_URL || 'http://localhost:5000'}/advertisements/payment/verify/esewa`,
            failure_url: `${process.env.URI}/payment-failed`,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature: hash
        };
    }

    res.status(200).json({
        success: true,
        bookingId: booking._id,
        totalAmount,
        paymentMethod: booking.paymentMethod,
        parameters: paymentParameters
    });
});

const verifyEsewaPayment = asyncErrorWrapper(async (req, res, next) => {
    // eSewa sends 'data' as a base64 encoded string in the success URL query
    const { data } = req.query;
    
    if (!data) {
        return res.redirect(`${process.env.URI}/payment-failed?error=no_data`);
    }

    // Decode the data
    const decodedRaw = Buffer.from(data, 'base64').toString();
    const decoded = JSON.parse(decodedRaw);
    
    // Check if status is COMPLETE (from eSewa docs)
    if (decoded.status !== "COMPLETE") {
        return res.redirect(`${process.env.URI}/payment-failed?error=not_complete`);
    }

    const booking = await AdBooking.findOne({ transactionUuid: decoded.transaction_uuid });
    if (!booking) {
        return res.redirect(`${process.env.URI}/payment-failed?error=booking_not_found`);
    }

    // Mark booking as completed
    booking.paymentStatus = 'completed';
    booking.gatewayRef = decoded.transaction_code;
    await booking.save();

    // Move to live advertisements collection
    const activeAd = await Advertisement.create({
        companyName: booking.companyName,
        companyEmail: booking.companyEmail,
        imageUrl: booking.imageUrl,
        plan: booking.plan,
        expiryDate: booking.expiryDate,
        placement: booking.placement,
        status: 'running'
    });

    // Generate Invoice HTML
    const htmlInvoice = invoiceTemplate(booking);

    // Notify user with Invoice
    sendEmail({
        to: booking.companyEmail,
        subject: `[Invoice #AD-${booking.transactionUuid.split('-')[2]}] Advertisement Booking Success`,
        html: htmlInvoice
    }).catch(e => console.warn("Invoice email failed:", e.message));

    // Redirect to home with a success message including expiry date
    const expiryDateStr = new Date(booking.expiryDate).toLocaleDateString();
    res.redirect(`${process.env.URI}/?payment_success=true&expiry=${expiryDateStr}&plan=${booking.plan}`);
});

const verifyKhaltiPayment = asyncErrorWrapper(async (req, res, next) => {
    const { pidx, amount, purchase_order_id } = req.body;

    // Khalti server-side verification request
    const khaltiSecretKey = process.env.KHALTI_SECRET_KEY || "key 123456789"; 
    
    try {
        const khaltiResponse = await axios.post('https://khalti.com/api/v2/epayment/lookup/', 
            { pidx }, 
            { headers: { 'Authorization': `Key ${khaltiSecretKey}` } }
        );

        if (khaltiResponse.data.status === 'Completed' || khaltiResponse.data.status === 'Paid') {
            const booking = await AdBooking.findOne({ transactionUuid: purchase_order_id });
            
            if (booking && booking.paymentStatus !== 'completed') {
                booking.paymentStatus = 'completed';
                booking.gatewayRef = pidx;
                await booking.save();

                await Advertisement.create({
                    companyName: booking.companyName,
                    companyEmail: booking.companyEmail,
                    imageUrl: booking.imageUrl,
                    plan: booking.plan,
                    expiryDate: booking.expiryDate,
                    placement: booking.placement,
                    status: 'running'
                });

                // Generate & Send Invoice
                const htmlInvoice = invoiceTemplate(booking);
                sendEmail({
                    to: booking.companyEmail,
                    subject: `[Invoice #AD-${booking.transactionUuid.split('-')[2]}] Advertisement Booking Success`,
                    html: htmlInvoice
                }).catch(e => console.warn("Invoice email failed:", e.message));

                return res.status(200).json({ 
                    success: true, 
                    message: "Payment verified and Ad activated",
                    expiry: new Date(booking.expiryDate).toLocaleDateString()
                });
            }
        }
    } catch (error) {
        console.error("Khalti Verification Error:", error.response?.data || error.message);
    }
    
    res.status(400).json({ success: false, message: "Payment verification failed" });
});

/**
 * Get All Ad Booked Invoices (Admin)
 */
const getAdBookings = asyncErrorWrapper(async (req, res, next) => {
    const bookings = await AdBooking.find({ paymentStatus: 'completed' })
        .sort('-createdAt')
        .populate('user', 'username email');

    res.status(200).json({
        success: true,
        count: bookings.length,
        bookings
    });
});

export { 
    createAd, getAds, updateAdStatus, deleteAd, editAd, 
    submitEnquiry, submitAdminEnquiry, getAdInquiries, updateInquiryStatus, deleteInquiry,
    initiateAdBooking, verifyEsewaPayment, verifyKhaltiPayment, getAdBookings
};

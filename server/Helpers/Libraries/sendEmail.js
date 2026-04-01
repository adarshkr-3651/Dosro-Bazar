import nodemailer from "nodemailer";

const sendEmail = async (mailOptions) => {
    // console.log("sendEmail function of Helpers/Libraries/sendEmail.js");

    // Check if email configuration exists
    const { SMTP_HOST, SMTP_PORT, EMAIL_USERNAME, EMAIL_PASSWORD } = process.env;

    if (!SMTP_HOST || !EMAIL_USERNAME || !EMAIL_PASSWORD) {
        console.warn("[sendEmail] Email configuration not found in environment variables");
        console.warn("[sendEmail] Email functionality is disabled. Please configure SMTP settings in .env");
        // Return success to prevent blocking, but log the issue
        return {
            success: false,
            message: "Email configuration not set up"
        };
    }

    try {
        // Create transporter
        let transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: EMAIL_USERNAME,
                pass: EMAIL_PASSWORD
            }
        });

        // Send email
        let info = await transporter.sendMail(mailOptions);

        // console.log("[sendEmail] Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("[sendEmail] Error sending email:", error.message);
        throw new Error(`Email could not be sent: ${error.message}`);
    }
};

export default sendEmail;

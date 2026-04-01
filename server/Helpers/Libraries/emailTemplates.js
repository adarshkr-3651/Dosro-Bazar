/**
 * Email Templates
 * HTML templates for various email notifications
 */

/**
 * Password Reset OTP Email Template
 * @param {string} otp - The 6-digit reset OTP
 * @param {string} username - The user's username
 * @returns {string} HTML email template
 */
const passwordResetTemplate = (otp, username) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Password Reset Request</h1>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                    Hi <strong>${username}</strong>,
                                </p>
                                <p style="margin: 0 0 20px; color: #666666; font-size: 15px; line-height: 1.6;">
                                    We received a request to reset your password. Please use the following 6-digit code to complete the process:
                                </p>
                                
                                <!-- OTP Box -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center">
                                            <div style="display: inline-block; padding: 20px 40px; background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 700; color: #667eea; letter-spacing: 12px; text-shadow: 1px 1px 1px rgba(0,0,0,0.05);">
                                                ${otp}
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Warning Box -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                                    <tr>
                                        <td style="padding: 15px;">
                                            <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.5;">
                                                ⚠️ <strong>Important:</strong> This code will expire in 10 minutes for security reasons.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="margin: 20px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                    If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                                <p style="margin: 0 0 10px; color: #6c757d; font-size: 13px;">
                                    This is an automated message, please do not reply.
                                </p>
                                <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                                    © ${new Date().getFullYear()} Dosro Bazar. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

/**
 * Login Notification Email Template
 * @param {string} username - The user's username
 * @param {string} email - The user's email
 * @param {string} loginTime - The login timestamp
 * @param {string} ipAddress - The IP address (optional)
 * @returns {string} HTML email template
 */
const loginNotificationTemplate = (username, email, loginTime, ipAddress = 'Unknown', location = 'Unknown Location') => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Login Alert</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 40px 30px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">🔐 New Login Detected</h1>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                    Hi <strong>${username}</strong>,
                                </p>
                                <p style="margin: 0 0 30px; color: #666666; font-size: 15px; line-height: 1.6;">
                                    We detected a new login to your DosroBazar account. Here are the details:
                                </p>
                                
                                <!-- Login Details Box -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <table width="100%" cellpadding="8" cellspacing="0">
                                                <tr>
                                                    <td style="color: #6c757d; font-size: 14px; font-weight: 600; width: 120px;">📧 Email:</td>
                                                    <td style="color: #333333; font-size: 14px;">${email}</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #6c757d; font-size: 14px; font-weight: 600;">🕐 Time:</td>
                                                    <td style="color: #333333; font-size: 14px;">${loginTime}</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #6c757d; font-size: 14px; font-weight: 600;">🌐 IP Address:</td>
                                                    <td style="color: #333333; font-size: 14px;">${ipAddress}</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #6c757d; font-size: 14px; font-weight: 600; width: 120px;">📍 Location:</td>
                                                    <td style="color: #333333; font-size: 14px;">${location}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Success Box -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background-color: #d4edda; border-left: 4px solid #28a745; border-radius: 4px;">
                                    <tr>
                                        <td style="padding: 15px;">
                                            <p style="margin: 0; color: #155724; font-size: 14px; line-height: 1.5;">
                                                ✅ <strong>Was this you?</strong> No action is needed. Your account is secure.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Warning Box -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; background-color: #f8d7da; border-left: 4px solid #dc3545; border-radius: 4px;">
                                    <tr>
                                        <td style="padding: 15px;">
                                            <p style="margin: 0 0 10px; color: #721c24; font-size: 14px; line-height: 1.5;">
                                                ⚠️ <strong>Wasn't you?</strong> Your account may be compromised.
                                            </p>
                                            <p style="margin: 0; color: #721c24; font-size: 13px; line-height: 1.5;">
                                                Please reset your password immediately and contact our support team.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="margin: 20px 0 0; color: #999999; font-size: 13px; line-height: 1.6;">
                                    We send these notifications to help keep your account secure.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                                <p style="margin: 0 0 10px; color: #6c757d; font-size: 13px;">
                                    This is an automated security notification.
                                </p>
                                <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                                    © ${new Date().getFullYear()} DosroBazar. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

/**
 * Password Change Notification Email Template
 * @param {string} username - The user's username
 * @param {string} email - The user's email
 * @param {string} changeTime - The password change timestamp
 * @returns {string} HTML email template
 */
const passwordChangeTemplate = (username, email, changeTime) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Changed Successfully</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">🔒 Password Changed</h1>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                    Hi <strong>${username}</strong>,
                                </p>
                                <p style="margin: 0 0 30px; color: #666666; font-size: 15px; line-height: 1.6;">
                                    Your DosroBazar account password was successfully changed.
                                </p>
                                
                                <!-- Change Details Box -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <table width="100%" cellpadding="8" cellspacing="0">
                                                <tr>
                                                    <td style="color: #6c757d; font-size: 14px; font-weight: 600; width: 120px;">📧 Email:</td>
                                                    <td style="color: #333333; font-size: 14px;">${email}</td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #6c757d; font-size: 14px; font-weight: 600;">🕐 Changed:</td>
                                                    <td style="color: #333333; font-size: 14px;">${changeTime}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Success Box -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0; background-color: #d4edda; border-left: 4px solid #28a745; border-radius: 4px;">
                                    <tr>
                                        <td style="padding: 15px;">
                                            <p style="margin: 0; color: #155724; font-size: 14px; line-height: 1.5;">
                                                ✅ <strong>All set!</strong> Your password has been updated successfully.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Warning Box -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; background-color: #f8d7da; border-left: 4px solid #dc3545; border-radius: 4px;">
                                    <tr>
                                        <td style="padding: 15px;">
                                            <p style="margin: 0 0 10px; color: #721c24; font-size: 14px; line-height: 1.5;">
                                                ⚠️ <strong>Didn't change your password?</strong>
                                            </p>
                                            <p style="margin: 0; color: #721c24; font-size: 13px; line-height: 1.5;">
                                                Your account may be compromised. Please contact our support team immediately.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="margin: 20px 0 0; color: #999999; font-size: 13px; line-height: 1.6;">
                                    We send these notifications to help keep your account secure.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                                <p style="margin: 0 0 10px; color: #6c757d; font-size: 13px;">
                                    This is an automated security notification.
                                </p>
                                <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                                    © ${new Date().getFullYear()} DosroBazar. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

/**
 * Email Verification Code Template
 * @param {string} code - The 6-digit verification code
 * @param {string} username - The user's username
 * @returns {string} HTML email template
 */
const verificationCodeTemplate = (code, username) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Email Verification</h1>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                                    Hi <strong>${username}</strong>,
                                </p>
                                <p style="margin: 0 0 20px; color: #666666; font-size: 15px; line-height: 1.6;">
                                    Thank you for signing up for Dosro Bazar! Please use the following code to verify your email address:
                                </p>
                                
                                <!-- Code Box -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center">
                                            <div style="display: inline-block; padding: 20px 40px; background-color: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 700; color: #667eea; letter-spacing: 10px;">
                                                ${code}
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="margin: 20px 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                    This code will expire in 10 minutes. If you didn't request this, please ignore this email.
                                </p>
                                
                                <p style="margin: 20px 0 0; color: #999999; font-size: 13px; line-height: 1.6;">
                                    Welcome to our community!
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                                <p style="margin: 0 0 10px; color: #6c757d; font-size: 13px;">
                                    This is an automated message, please do not reply.
                                </p>
                                <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                                    © ${new Date().getFullYear()} Dosro Bazar. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

/**
 * Welcome Email Template (Sent after verification)
 * @param {string} username - The user's username
 * @returns {string} HTML email template
 */
const welcomeTemplate = (username) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Dosro Bazar</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 40px 30px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome Aboard! 🎉</h1>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <p style="margin: 0 0 20px; color: #333333; font-size: 18px; line-height: 1.6;">
                                    Hi <strong>${username}</strong>,
                                </p>
                                <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                                    Congratulations! Your email has been successfully verified, and your Dosro Bazar account is now fully active.
                                </p>
                                <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">
                                    You can now start browsing, buying, and selling items in our marketplace. We're excited to have you with us!
                                </p>
                                
                                <!-- CTA Button -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center">
                                            <a href="${process.env.URI || 'http://localhost:3000'}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Start Exploring</a>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="margin: 20px 0 0; color: #999999; font-size: 13px; line-height: 1.6;">
                                    If you have any questions, feel free to reach out to our support team.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                                <p style="margin: 0 0 10px; color: #6c757d; font-size: 13px;">
                                    This is an welcome email from Dosro Bazar.
                                </p>
                                <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                                    © ${new Date().getFullYear()} Dosro Bazar. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

/**
 * Welcome Email Template (Sent immediately after signup)
 * @param {string} username - The user's username
 * @returns {string} HTML email template
 */
const signupWelcomeTemplate = (username) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Dosro Bazar</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 40px 30px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome to Dosro Bazar! 🎉</h1>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <p style="margin: 0 0 20px; color: #333333; font-size: 18px; line-height: 1.6;">
                                    Hi <strong>${username}</strong>,
                                </p>
                                <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                                    We're thrilled to have you join our marketplace! Your account has been successfully created.
                                </p>
                                <p style="margin: 0 0 30px; color: #666666; font-size: 16px; line-height: 1.6;">
                                    You can start exploring right away. To unlock all features and build trust with other users, please <strong>verify your email</strong> from your profile settings whenever you have a moment.
                                </p>
                                
                                <!-- CTA Button -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center">
                                            <a href="${process.env.URI || 'http://localhost:3000'}/profile" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Go to Profile</a>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="margin: 20px 0 0; color: #999999; font-size: 13px; line-height: 1.6;">
                                    Happy buying and selling!
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                                <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                                    © ${new Date().getFullYear()} Dosro Bazar. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

export {
    passwordResetTemplate,
    loginNotificationTemplate,
    passwordChangeTemplate,
    verificationCodeTemplate,
    welcomeTemplate,
    signupWelcomeTemplate
};


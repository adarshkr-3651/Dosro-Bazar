/**
 * Invoice Email Template
 * HTML template for Advertisement Booking invoices
 * @param {Object} booking - The booking object
 * @returns {string} HTML email template
 */
const invoiceTemplate = (booking) => {
    const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const expiryDateStr = new Date(booking.expiryDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice - Dosro Bazar</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; color: #1e293b;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
            <tr>
                <td align="center">
                    <table width="650" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);">
                        
                        <!-- Header / Branding -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 50px 40px; text-align: center;">
                                <div style="font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: -0.025em; margin-bottom: 8px;">DOSRO BAZAR</div>
                                <div style="font-size: 14px; font-weight: 600; color: rgba(255, 255, 255, 0.8); text-transform: uppercase; letter-spacing: 0.1em;">Official Invoice</div>
                            </td>
                        </tr>

                        <!-- Invoice Info -->
                        <tr>
                            <td style="padding: 40px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding-bottom: 30px;">
                                            <div style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Invoice To</div>
                                            <div style="font-size: 18px; font-weight: 800; color: #0f172a;">${booking.companyName}</div>
                                            <div style="font-size: 14px; color: #64748b; margin-top: 2px;">${booking.companyEmail}</div>
                                            <div style="font-size: 14px; color: #64748b;">${booking.phone}</div>
                                        </td>
                                        <td align="right" style="padding-bottom: 30px; vertical-align: top;">
                                            <div style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Invoice Date</div>
                                            <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${date}</div>
                                            <div style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 12px; margin-bottom: 4px;">Order ID</div>
                                            <div style="font-size: 12px; font-family: monospace; color: #64748b;">${booking.transactionUuid}</div>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Plan Highlights -->
                                <div style="background-color: #f1f5f9; border-radius: 16px; padding: 24px; margin-bottom: 30px; border-left: 4px solid #10b981;">
                                    <div style="font-size: 12px; font-weight: 800; color: #10b981; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Active Campaign</div>
                                    <div style="font-size: 14px; line-height: 1.5; color: #334155;">
                                        Your <strong>${booking.plan} Package</strong> advertisement is now live on our platform. 
                                        The campaign will run until <strong>${expiryDateStr}</strong>.
                                    </div>
                                </div>

                                <!-- Line Items -->
                                <table width="100%" cellpadding="12" cellspacing="0" style="margin-bottom: 30px;">
                                    <thead>
                                        <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                                            <th align="left" style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Description</th>
                                            <th align="right" style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style="border-bottom: 1px solid #f1f5f9; padding: 20px 0;">
                                                <div style="font-size: 15px; font-weight: 700; color: #0f172a;">Hero Banner Advertisement</div>
                                                <div style="font-size: 13px; color: #64748b; margin-top: 4px;">${booking.plan} Plan - Running till ${expiryDateStr}</div>
                                            </td>
                                            <td align="right" style="border-bottom: 1px solid #f1f5f9; padding: 20px 0; font-size: 15px; font-weight: 700; color: #0f172a;">
                                                Rs. ${booking.amount}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <!-- Totals -->
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td width="60%"></td>
                                        <td width="40%">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Subtotal</td>
                                                    <td align="right" style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0f172a;">Rs. ${booking.amount}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Govt. Tax (13% VAT)</td>
                                                    <td align="right" style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #10b981;">+ Rs. ${booking.taxAmount}</td>
                                                </tr>
                                                <tr style="border-top: 2px solid #e2e8f0;">
                                                    <td style="padding: 20px 0 0; font-size: 18px; font-weight: 800; color: #0f172a;">Total Paid</td>
                                                    <td align="right" style="padding: 20px 0 0; font-size: 24px; font-weight: 900; color: #10b981;">Rs. ${booking.totalAmount}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Payment Status Badge -->
                                <div style="margin-top: 40px; text-align: center;">
                                    <div style="display: inline-block; padding: 8px 20px; background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 99px; color: #059669; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;">
                                        Payment Successful via ${booking.paymentMethod.toUpperCase()}
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                                <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.6;">
                                    Thank you for choosing Dosro Bazar. This is an electronically generated invoice and does not require a physical signature. For support, please contact us at support@dosrobazar.com.
                                </p>
                                <p style="margin: 15px 0 0; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">
                                    © ${new Date().getFullYear()} Dosro Bazar Marketplace
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

export default invoiceTemplate;

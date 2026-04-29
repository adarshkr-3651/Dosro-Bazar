/**
 * Regular Item Invoice Template
 * HTML template for Item Sale/Purchase invoices
 * @param {Object} invoiceData - The invoice data (id, title, price, seller, buyer, date)
 * @returns {string} HTML email template
 */
const itemInvoiceTemplate = (invoiceData) => {
    const date = new Date(invoiceData.date).toLocaleDateString('en-US', {
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
                            <td style="background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%); padding: 50px 40px; text-align: center;">
                                <div style="font-size: 32px; font-weight: 900; color: #ffffff; letter-spacing: -0.025em; margin-bottom: 8px;">DOSRO BAZAR</div>
                                <div style="font-size: 14px; font-weight: 600; color: rgba(255, 255, 255, 0.8); text-transform: uppercase; letter-spacing: 0.1em;">Official Purchase Invoice</div>
                            </td>
                        </tr>

                        <!-- Invoice Info -->
                        <tr>
                            <td style="padding: 40px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding-bottom: 30px; width: 50%;">
                                            <div style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Buyer Details</div>
                                            <div style="font-size: 18px; font-weight: 800; color: #0f172a;">${invoiceData.buyerName}</div>
                                            <div style="font-size: 14px; color: #64748b; margin-top: 2px;">${invoiceData.buyerEmail || ''}</div>
                                        </td>
                                        <td style="padding-bottom: 30px; width: 50%;">
                                            <div style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Seller Details</div>
                                            <div style="font-size: 18px; font-weight: 800; color: #0f172a;">${invoiceData.sellerName}</div>
                                            <div style="font-size: 14px; color: #64748b; margin-top: 2px;">${invoiceData.sellerEmail || ''}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" align="right" style="padding-bottom: 30px;">
                                            <div style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Invoice ID</div>
                                            <div style="font-size: 14px; font-weight: 700; color: #0f172a;">${invoiceData.invoiceId}</div>
                                            <div style="font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 12px; margin-bottom: 4px;">Date</div>
                                            <div style="font-size: 14px; color: #64748b;">${date}</div>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Line Items -->
                                <table width="100%" cellpadding="12" cellspacing="0" style="margin-bottom: 30px; border: 1px solid #e2e8f0; border-radius: 12px; border-collapse: separate;">
                                    <thead>
                                        <tr style="background-color: #f8fafc;">
                                            <th align="left" style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0;">Item Description</th>
                                            <th align="right" style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0;">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style="padding: 20px;">
                                                <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${invoiceData.itemTitle}</div>
                                                <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Condition: Verified | Transaction: Secure</div>
                                            </td>
                                            <td align="right" style="padding: 20px; font-size: 15px; font-weight: 700; color: #0f172a;">
                                                Rs. ${invoiceData.amount.toLocaleString()}
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
                                                <tr style="border-top: 2px solid #e2e8f0;">
                                                    <td style="padding: 20px 0 0; font-size: 18px; font-weight: 800; color: #0f172a;">Total Amount</td>
                                                    <td align="right" style="padding: 20px 0 0; font-size: 24px; font-weight: 900; color: #6366f1;">Rs. ${invoiceData.amount.toLocaleString()}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Security Badge -->
                                <div style="margin-top: 40px; text-align: center;">
                                    <div style="display: inline-block; padding: 10px 25px; background-color: #eef2ff; border: 1px solid #6366f1; border-radius: 99px; color: #4338ca; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;">
                                        ✅ Secure Transaction Verified
                                    </div>
                                </div>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                                <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.6;">
                                    Thank you for using Dosro Bazar. This invoice serves as a record of your transaction. For support, please contact us at support@dosrobazar.com.
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

export default itemInvoiceTemplate;

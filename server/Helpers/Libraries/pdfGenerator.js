import html_to_pdf from 'html-pdf-node';

/**
 * Generate a PDF buffer from HTML content
 * @param {string} html - The HTML content to convert
 * @returns {Promise<Buffer>} - The generated PDF buffer
 */
export const generatePDF = async (html) => {
    let options = { 
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    };
    
    let file = { content: html };
    
    try {
        const buffer = await html_to_pdf.generatePdf(file, options);
        return buffer;
    } catch (error) {
        console.error("[generatePDF] Error:", error);
        throw error;
    }
};

import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import https from 'https';

/**
 * Keywords for Nepal-specific ID verification
 */
const KEYWORDS = {
    CITIZENSHIP: ["नेपाल सरकार", "Nepali", "Citizenship Certificate", "नागरिकता"],
    PAN: ["Permanent Account Number", "PAN", "Inland Revenue Department"],
    DRIVING_LICENSE: ["Department of Transport Management", "Driving Licence", "DL No"]
};

/**
 * Helper to download an image from a URL into a Buffer
 */
const getBufferFromUrl = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Failed to download image: Status Code ${res.statusCode}`));
                return;
            }
            const data = [];
            res.on('data', (chunk) => data.push(chunk));
            res.on('end', () => resolve(Buffer.concat(data)));
        }).on('error', (err) => {
            reject(new Error(`Network error while downloading image: ${err.message}`));
        });
    });
};

/**
 * Service to verify identification documents using OCR
 */
const verifyIdProof = async (filePath, idType) => {
    try {
        let imageInput = filePath;

        // 0. Handle URLs if Cloudinary is used
        if (typeof filePath === 'string' && filePath.startsWith('http')) {
            console.log(`[OCR] Fetching image from URL: ${filePath}`);
            imageInput = await getBufferFromUrl(filePath);
        }

        // 1. Image sanity check with sharp
        const image = sharp(imageInput);
        const metadata = await image.metadata();

        if (!['jpeg', 'png', 'jpg', 'webp'].includes(metadata.format)) {
            return {
                verified: false,
                status: 'rejected',
                feedback: "⚠️ Invalid image format. Please upload a clear JPG or PNG image."
            };
        }

        // Check for minimum resolution (e.g., 500x300) to ensure OCR works reliably
        if (metadata.width < 500 || metadata.height < 300) {
            return {
                verified: false,
                status: 'rejected',
                feedback: "⚠️ The image is too small or blurry. Please upload a clearer, high-resolution photo."
            };
        }

        // 2. Run OCR with Tesseract.js
        // We use both English and Nepali languages for recognition
        const { data: { text } } = await Tesseract.recognize(
            imageInput,
            'eng+nep',
            {
                logger: m => {
                    if (m.status === 'recognizing text' && Math.round(m.progress * 100) % 25 === 0) {
                        console.log(`[OCR] ${m.status}: ${Math.round(m.progress * 100)}%`);
                    }
                }
            }
        );

        console.log("[OCR] Extracted Text Length:", text.length);

        // 3. Keyword validation
        const extractedText = text.toLowerCase();
        let matchedKeywords = [];
        let expectedKeywords = [];

        if (idType === 'Citizenship') {
            expectedKeywords = KEYWORDS.CITIZENSHIP;
        } else if (idType === 'PAN') {
            expectedKeywords = KEYWORDS.PAN;
        } else if (idType === 'Driving License') {
            expectedKeywords = KEYWORDS.DRIVING_LICENSE;
        } else {
            // If generic or other, check against all
            expectedKeywords = [...KEYWORDS.CITIZENSHIP, ...KEYWORDS.PAN, ...KEYWORDS.DRIVING_LICENSE];
        }

        matchedKeywords = expectedKeywords.filter(keyword =>
            extractedText.includes(keyword.toLowerCase())
        );

        console.log(`[OCR] Matched ${matchedKeywords.length}/${expectedKeywords.length} keywords for ${idType}`);
        if (matchedKeywords.length > 0) {
            console.log(`[OCR] Matched Keywords: ${matchedKeywords.join(', ')}`);
        }

        // 4. Verification Logic
        if (matchedKeywords.length >= 1) {
            // High confidence if multiple keywords match, else mark as pending for admin review
            if (matchedKeywords.length >= 2) {
                return {
                    verified: true,
                    status: 'verified',
                    feedback: "✅ ID verified successfully."
                };
            } else {
                return {
                    verified: false,
                    status: 'pending',
                    feedback: "ℹ️ ID partially verified (only 1 keyword found). Our team will review it manually soon."
                };
            }
        } else {
            // No keywords matched -> Polite rejection
            return {
                verified: false,
                status: 'rejected',
                feedback: `⚠️ We could not verify this as a valid Nepal ${idType || 'document'}. Please upload a clear image of official Citizenship / PAN / Driving License only.`
            };
        }
    } catch (error) {
        console.error("[OCR Service Error]", error);
        // Fallback to manual verification on error
        return {
            verified: false,
            status: 'pending',
            feedback: "ℹ️ We're having trouble reading the image automatically. An admin will verify it manually."
        };
    }
};

export default verifyIdProof;

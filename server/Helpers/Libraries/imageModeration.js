import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import sharp from "sharp";

/**
 * Moderate an image using Gemini AI
 * @param {string} imageUrl - The URL of the image to moderate
 * @returns {Promise<{isSafe: boolean, reason: string}>}
 */
export const moderateImage = async (imageUrl) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        console.warn("[imageModeration] Gemini API key not configured. Skipping moderation.");
        return { isSafe: true, reason: "" };
    }

    try {
        // 1. Fetch image from URL
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        let buffer = Buffer.from(response.data, 'binary');

        // 2. Resize to a reasonable size to prevent timeouts but keep text readable
        buffer = await sharp(buffer)
            .resize({ width: 2048, height: 2048, fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 85 })
            .toBuffer();

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            safetySettings: [
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            ]
        });

        const prompt = `CONTENT MODERATION TASK:
        Analyze this image for a community marketplace "Dosro Bazar".
        
        ALLOWED:
        - Electronic products (Phones, Laptops, etc.).
        - Brand logos (Samsung, Apple, etc.) and promotional text.
        - People in normal, professional, or casual clothing.
        
        FORBIDDEN (isSafe: false):
        - Vulgarity: Middle fingers, offensive gestures, or swear words.
        - Explicit: Nudity, sexually suggestive content, or adult products.
        - Violence: Blood, weapons, gore, or graphic injuries.
        - Harmful: Hate speech, discriminatory symbols, or dangerous activities.

        Output ONLY a JSON object:
        {
            "isSafe": boolean,
            "reason": "specific explanation",
            "isPromotional": boolean (true if it's a legitimate ad/product)
        }`;

        const result = await model.generateContent([
            {
                inlineData: {
                    data: buffer.toString("base64"),
                    mimeType: "image/jpeg"
                }
            },
            prompt
        ]);

        const geminiResponse = await result.response;
        const text = geminiResponse.text();
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Invalid AI response format");
        
        const moderationResult = JSON.parse(jsonMatch[0]);

        // If the AI identifies it as promotional but is unsure about safety, give it more leeway
        let finalIsSafe = moderationResult.isSafe === true;
        if (moderationResult.isPromotional && !finalIsSafe) {
            // Re-check: If it's promotional, only block for clear vulgarity/nudity
            if (moderationResult.reason?.toLowerCase().includes("text") || 
                moderationResult.reason?.toLowerCase().includes("unclear")) {
                finalIsSafe = true; // Allow if the reason is just "text" or "unclear"
            }
        }

        return {
            isSafe: finalIsSafe,
            reason: moderationResult.reason || ""
        };

    } catch (error) {
        console.error("[imageModeration] Moderation blocked or failed:", error.message);
        
        // If it's a transient service error (not a safety block), we can be slightly more lenient
        // but for advertisements, we still prefer flagging for review.
        return { 
            isSafe: false, 
            reason: `Moderation service issue: ${error.message}` 
        };
    }
};

import asyncErrorWrapper from "express-async-handler";
import { GoogleGenerativeAI } from "@google/generative-ai";

const generateDescription = asyncErrorWrapper(async (req, res) => {
    const { title, category, condition, price } = req.body;

    if (!title) {
        return res.status(400).json({ success: false, message: "Item title is required" });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ success: false, message: "Gemini API key not configured" });
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `You are a professional marketplace listing writer for "Dosro Bazar", a second-hand marketplace in Nepal.

Write a compelling and detailed product listing description for the following item:

- Title: ${title}
- Category: ${category || "General"}
- Condition: ${condition || "Good"}
${price ? `- Price: Rs. ${price}` : ""}

Requirements:
- STRUCTURE:
  1. FIRST, provide a bulleted list of Key Features/Specs (e.g., display, camera, specs, or key material/design traits depending on the product type).
  2. SECOND, provide a compelling, customer-appealing paragraph to drive the sale.
- Detail: Be specific and informative. Highlight the condition.
- Emojis: Include emojis to make it visually appealing.
- Currency: Mention the price (Rs./रु) if provided in the details above.
- Length: Keep the entire output between 100-200 words.
- Accuracy: Do NOT make up specific technical specs unless they are well-known global defaults for the provided specific product model.
- Output ONLY the generated listing text without any conversational filler or title tags.`;

    const result = await model.generateContent(prompt);
    const description = result.response.text().trim();

    return res.status(200).json({ success: true, data: description });
});

export { generateDescription };

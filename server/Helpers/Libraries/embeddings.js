import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Generate embeddings using Google Gemini.
 * Tries text-embedding-004 (768-dim) first, falls back to embedding-001 (768-dim).
 */
const getEmbeddings = async (text) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        console.warn("[Embeddings] GEMINI_API_KEY is not set. Returning empty embeddings.");
        return [];
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    // Use stable gemini-embedding-001 with 768-dim
    const modelIds = ["gemini-embedding-001", "embedding-001"];

    for (const modelId of modelIds) {
        try {
            // console.log(`[Embeddings] Trying model "${modelId}" for: "${text.substring(0, 60)}..."`);
            const model = genAI.getGenerativeModel({ model: modelId });
            const result = await model.embedContent({
                content: { role: 'user', parts: [{ text }] }, 
                taskType: 'RETRIEVAL_QUERY', 
                outputDimensionality: 768
            });
            const values = result.embedding.values;
            // console.log(`[Embeddings] ✅ ${modelId} → ${values.length}-dim vector.`);
            return values;
        } catch (error) {
            console.warn(`[Embeddings] ⚠️ Model "${modelId}" failed: ${error.message}`);
        }
    }

    console.error("[Embeddings] All embedding models failed. Returning empty array.");
    return [];
};

export default getEmbeddings;

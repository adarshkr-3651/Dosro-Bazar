import { HfInference } from "@huggingface/inference";

const getEmbeddings = async (text) => {
    const HUGGING_FACE_TOKEN = process.env.HUGGING_FACE_TOKEN;
    const MODEL_ID = process.env.HF_MODEL_ID || "sentence-transformers/all-MiniLM-L6-v2";

    if (!HUGGING_FACE_TOKEN || HUGGING_FACE_TOKEN === "your_hugging_face_token_here") {
        console.warn("Hugging Face Token is missing or not set. Returning empty embeddings.");
        return [];
    }

    const hf = new HfInference(HUGGING_FACE_TOKEN);

    try {
        console.log(`[Embeddings] Generating embeddings for text: "${text.substring(0, 50)}..."`);

        const embeddings = await hf.featureExtraction({
            model: MODEL_ID,
            inputs: text,
        });

        if (Array.isArray(embeddings)) {
            console.log(`[Embeddings] Successfully generated ${embeddings.length} dimensions.`);
            console.log(`[Embeddings] Sample (first 5 values):`, embeddings.slice(0, 5));
        }

        return embeddings;
    } catch (error) {
        console.error("Error generating embeddings:", error.message);
        // If it's a 403, it's likely a permission issue
        if (error.message.includes("403")) {
            console.error("HINT: Your Hugging Face token might lack 'Inference' permissions.");
        }
        return [];
    }
};

export default getEmbeddings;

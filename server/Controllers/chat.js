import asyncErrorWrapper from "express-async-handler";
import Item from "../Models/item.js";
import getEmbeddings from "../Helpers/Libraries/embeddings.js";
import { HfInference } from "@huggingface/inference";

const getChatResponse = asyncErrorWrapper(async (req, res, next) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ success: false, message: "Please provide a message" });
    }

    console.log(`[Chat] Received message: "${message}"`);

    // 1. Get embeddings for the user message
    let embeddings = [];
    try {
        embeddings = await getEmbeddings(message);
    } catch (error) {
        console.error("[Chat] Embedding generation failed:", error.message);
    }
    
    let contextItems = [];
    if (embeddings && embeddings.length > 0) {
        try {
            // 2. Perform vector search to find relevant items (RAG context)
            contextItems = await Item.aggregate([
                {
                    $vectorSearch: {
                        index: "vector_index",
                        path: "embeddings",
                        queryVector: embeddings,
                        numCandidates: 100,
                        limit: 5
                    }
                },
                {
                    $project: {
                        title: 1,
                        price: 1,
                        category: 1,
                        condition: 1,
                        score: { $meta: "vectorSearchScore" }
                    }
                }
            ]);
            console.log(`[Chat] Found ${contextItems.length} relevant items for context.`);
        } catch (error) {
            console.warn("[Chat] Vector search failed (likely index missing), proceeding without item context:", error.message);
            // Non-fatal, just proceed without specific item context
        }
    }

    // 3. Prepare Prompt
    const siteContext = contextItems.length > 0 
        ? `Here are some relevant items currently available in our marketplace:\n${contextItems.map(item => `- ${item.title} (Price: Rs. ${item.price}, Category: ${item.category}, Condition: ${item.condition})`).join('\n')}`
        : "Currently, I couldn't find specific items matching your query, but I can help you with general site information about buying, selling, and bidding.";

    const systemPrompt = `You are a helpful and friendly AI assistant for \"Dosro Bazar\", a premium marketplace for buying, selling, and bidding on items. 
Your goal is to assist users with their questions about items, site navigation, or how to use the platform.
Be concise, professional, and helpful. Use the context provided below to answer user queries if relevant.

CONTEXT:
${siteContext}

USER MESSAGE:
${message}

AI ASSISTANT RESPONSE:`;

    // 4. Call Hugging Face LLM
    const HUGGING_FACE_TOKEN = process.env.HUGGING_FACE_TOKEN;
    const CHAT_MODEL = process.env.HF_CHAT_MODEL || "mistralai/Mistral-7B-Instruct-v0.2";

    if (!HUGGING_FACE_TOKEN || HUGGING_FACE_TOKEN === "your_hugging_face_token_here") {
        return res.status(200).json({
            success: true,
            data: "I'm sorry, my AI brain isn't fully connected right now (API token missing in config.env). How else can I help you navigate Dosro Bazar?"
        });
    }

    const hf = new HfInference(HUGGING_FACE_TOKEN);

    try {
        const response = await hf.textGeneration({
            model: CHAT_MODEL,
            inputs: systemPrompt,
            parameters: {
                max_new_tokens: 250,
                temperature: 0.7,
                return_full_text: false,
            },
        });

        // Handle both possible response formats from HF (object or array of objects)
        let generatedText = "";
        if (Array.isArray(response)) {
            generatedText = response[0]?.generated_text || "";
        } else {
            generatedText = response.generated_text || "";
        }
        
        generatedText = generatedText.trim();
        console.log(`[Chat] Generated response: "${generatedText.substring(0, 50)}..."`);

        return res.status(200).json({
            success: true,
            data: generatedText || "I'm sorry, I couldn't generate a proper response at this moment."
        });
    } catch (error) {
        console.error("[Chat] Error calling HF Inference:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to generate AI response. Please try again later."
        });
    }
});

export { getChatResponse };

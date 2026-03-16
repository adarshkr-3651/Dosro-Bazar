import asyncErrorWrapper from "express-async-handler";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Item from "../Models/item.js";
import KnowledgeChunk from "../Models/knowledgeChunk.js";
import getEmbeddings from "../Helpers/Libraries/embeddings.js";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const getChatResponse = asyncErrorWrapper(async (req, res) => {
    const { message, history = [] } = req.body;

    if (!message) {
        return res.status(400).json({ success: false, message: "Please provide a message" });
    }

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ success: false, message: "Gemini API key not configured" });
    }

    console.log(`[Chat] Received: "${message}" | History turns: ${history.length}`);

    // ─── Step 1: Generate embedding for the user's message ───────────────────
    let queryEmbeddings = [];
    try {
        queryEmbeddings = await getEmbeddings(message);
    } catch (err) {
        console.warn("[Chat] Embedding failed:", err.message);
    }

    // ─── Step 2: Parallel RAG — search items AND knowledge base ──────────────
    let productContext = "";
    let knowledgeContext = "";

    if (queryEmbeddings.length > 0) {
        const vectorSearchStage = (collection, indexName, limit) => collection.aggregate([
            {
                $vectorSearch: {
                    index: indexName,
                    path: "embeddings",
                    queryVector: queryEmbeddings,
                    numCandidates: 100,
                    limit,
                },
            },
            {
                $project: {
                    _id: 0,
                    content: 1,
                    title: 1,
                    price: 1,
                    category: 1,
                    condition: 1,
                    score: { $meta: "vectorSearchScore" },
                },
            },
        ]);

        const [productResults, knowledgeResults] = await Promise.allSettled([
            vectorSearchStage(Item, "vector_index", 4),
            vectorSearchStage(KnowledgeChunk, "knowledge_index", 5),
        ]);

        // Format product results
        if (productResults.status === "fulfilled" && productResults.value.length > 0) {
            const items = productResults.value;
            productContext = `RELEVANT MARKETPLACE LISTINGS:\n${items
                .map(i => `- ${i.title} | Rs. ${i.price} | ${i.category} | Condition: ${i.condition}`)
                .join("\n")}`;
            console.log(`[Chat] Found ${items.length} relevant products.`);
        } else {
            if (productResults.status === "rejected") {
                console.warn("[Chat] Product vector search failed (index may be missing):", productResults.reason?.message);
            }
        }

        // Format knowledge chunk results
        if (knowledgeResults.status === "fulfilled" && knowledgeResults.value.length > 0) {
            const chunks = knowledgeResults.value;
            knowledgeContext = `WEBSITE KNOWLEDGE BASE:\n${chunks.map(c => c.content).join("\n\n")}`;
            console.log(`[Chat] Found ${chunks.length} relevant knowledge chunks.`);
        } else {
            if (knowledgeResults.status === "rejected") {
                console.warn("[Chat] Knowledge vector search failed (index may be missing):", knowledgeResults.reason?.message);
            }
        }
    }

    // ─── Step 3: Build conversation history string (last 10 turns) ───────────
    const recentHistory = Array.isArray(history) ? history.slice(-10) : [];
    const historyBlock = recentHistory.length > 0
        ? `\nCONVERSATION HISTORY:\n${recentHistory
            .map(t => `${t.role === "assistant" ? "ASSISTANT" : "USER"}: ${t.content}`)
            .join("\n")}\n`
        : "";

    // ─── Step 4: Compose the system prompt ───────────────────────────────────
    const contextSection = [productContext, knowledgeContext].filter(Boolean).join("\n\n");

    const systemPrompt = `You are a helpful, friendly AI assistant exclusively for "Dosro Bazar" — a second-hand marketplace in Nepal where users buy, sell, and bid on items.

STRICT RULES:
- Only answer questions related to Dosro Bazar, its products, features, policies, or how to use the platform.
- If the question is completely unrelated to Dosro Bazar (e.g., general coding help, world news, math homework), politely say: "I can only help with questions about Dosro Bazar. Is there anything about the marketplace I can assist you with?"
- Be concise, warm, and professional.
- Use the context below to give accurate, specific answers.
- If you don't know something specific, suggest the user check the listing or contact the seller directly.
- Respond in the same language the user uses (Nepali or English).

${contextSection ? `CONTEXT:\n${contextSection}` : "No specific context found for this query, but I can help with general platform questions."}
${historyBlock}
USER: ${message}
ASSISTANT:`;

    // ─── Step 5: Generate response with Gemini Flash ──────────────────────────
    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                maxOutputTokens: 350,
                temperature: 0.6,
            },
        });

        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text().trim();

        console.log(`[Chat] Response: "${responseText.substring(0, 80)}..."`);

        return res.status(200).json({ success: true, data: responseText });
    } catch (error) {
        console.error("[Chat] Gemini generation failed:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to generate AI response. Please try again later.",
        });
    }
});

export { getChatResponse };

/**
 * Knowledge Base Ingestion Script
 * 
 * This script reads the website-guide.md, splits it into chunks,
 * generates Gemini embeddings for each chunk, and stores them in MongoDB.
 * 
 * Run once initially, then re-run whenever website-guide.md is updated:
 *   node --experimental-vm-modules scripts/ingestDocs.js
 * 
 * Prerequisites:
 *   - GEMINI_API_KEY set in Config/config.env
 *   - MONGO_URI set in Config/config.env
 *   - MongoDB Atlas Vector Search index "knowledge_index" on knowledge_chunks collection
 *     (Create via Atlas UI after first run: field=embeddings, dimensions=768, similarity=cosine)
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.join(__dirname, "../Config/config.env") });

// Mongoose model (inline to avoid circular imports)
const KnowledgeChunkSchema = new mongoose.Schema({
    content: { type: String, required: true },
    source: { type: String, default: "website-guide" },
    chunkIndex: { type: Number, default: 0 },
    embeddings: { type: [Number], default: [] },
}, { timestamps: true });
const KnowledgeChunk = mongoose.model("KnowledgeChunk", KnowledgeChunkSchema);

async function getGeminiEmbedding(text, model) {
    const result = await model.embedContent({ 
        content: { role: 'user', parts: [{ text }] }, 
        taskType: 'RETRIEVAL_DOCUMENT', 
        outputDimensionality: 768 
    });
    return result.embedding.values;
}

async function main() {
    console.log("🚀 Starting knowledge base ingestion...");

    // 1. Connect to MongoDB
    console.log("📦 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected.");

    // 2. Read the knowledge document
    const docPath = path.join(__dirname, "../docs/website-guide.md");
    if (!fs.existsSync(docPath)) {
        throw new Error(`Knowledge document not found at: ${docPath}`);
    }
    const docText = fs.readFileSync(docPath, "utf-8");
    console.log(`📄 Read website-guide.md (${docText.length} characters)`);

    // 3. Split into chunks
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 600,       // ~600 characters per chunk
        chunkOverlap: 100,    // 100 character overlap for context continuity
        separators: ["\n---\n", "\n## ", "\n### ", "\n\n", "\n", " "],
    });
    const chunks = await splitter.splitText(docText);
    console.log(`✂️  Split into ${chunks.length} chunks.`);

    // 4. Set up Gemini Embedding model
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set in config.env");
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    // 5. Clear existing knowledge chunks
    console.log("🗑️  Clearing existing knowledge chunks...");
    await KnowledgeChunk.deleteMany({ source: "website-guide" });

    // 6. Embed and store each chunk
    console.log("🔢 Generating embeddings and storing chunks...");
    let successCount = 0;
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        try {
            const embeddings = await getGeminiEmbedding(chunk, embeddingModel);
            await KnowledgeChunk.create({
                content: chunk,
                source: "website-guide",
                chunkIndex: i,
                embeddings,
            });
            successCount++;
            console.log(`  ✅ Chunk ${i + 1}/${chunks.length} stored (${chunk.length} chars)`);
        } catch (err) {
            console.error(`  ❌ Failed chunk ${i + 1}: ${err.message}`);
        }

        // Small delay to avoid rate limiting
        if (i < chunks.length - 1) {
            await new Promise(r => setTimeout(r, 200));
        }
    }

    console.log(`\n🎉 Ingestion complete! ${successCount}/${chunks.length} chunks stored.`);
    console.log("\n⚠️  NEXT STEP: Create the Atlas Search Vector Index if not already done:");
    console.log("   Collection: knowledge_chunks");
    console.log("   Index name: knowledge_index");
    console.log("   Field: embeddings | Dimensions: 768 | Similarity: cosine");

    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected. Done!");
    process.exit(0);
}

main().catch(err => {
    console.error("❌ Ingestion failed:", err);
    process.exit(1);
});

/**
 * Unified Vector Database Restoration & Indexing Script
 * 
 * This script will:
 * 1. Connect to MongoDB Atlas.
 * 2. Ingest website guide docs, generate embeddings, and save to the 'knowledgechunks' collection.
 * 3. Generate embeddings for all existing products/items and save them.
 * 4. Create the MongoDB Atlas Vector Search index 'knowledge_index' on the 'knowledgechunks' collection.
 * 5. Create the MongoDB Atlas Vector Search index 'vector_index' on the 'items' collection.
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import mongoose from "mongoose";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Item from "../Models/item.js";
import KnowledgeChunk from "../Models/knowledgeChunk.js";
import getEmbeddings from "../Helpers/Libraries/embeddings.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.join(__dirname, "../Config/config.env") });

async function getGeminiEmbedding(text, model) {
    const result = await model.embedContent({ 
        content: { role: 'user', parts: [{ text }] }, 
        taskType: 'RETRIEVAL_DOCUMENT', 
        outputDimensionality: 768 
    });
    return result.embedding.values;
}

async function main() {
    console.log("🚀 Starting unified Vector Database Restoration...");

    // 1. Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI is not set in config.env");

    console.log("📦 Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected.");

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set in config.env");

    // ─── Step 1: Ingest Website Guide Docs ──────────────────────────────────
    console.log("\n📖 Step 1: Ingesting website guide documentation...");
    const docPath = path.join(__dirname, "../docs/website-guide.md");
    if (!fs.existsSync(docPath)) {
        throw new Error(`Knowledge document not found at: ${docPath}`);
    }
    const docText = fs.readFileSync(docPath, "utf-8");
    console.log(`📄 Read website-guide.md (${docText.length} characters)`);

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 600,
        chunkOverlap: 100,
        separators: ["\n---\n", "\n## ", "\n### ", "\n\n", "\n", " "],
    });
    const chunks = await splitter.splitText(docText);
    console.log(`✂️  Split document into ${chunks.length} chunks.`);

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

    console.log("🗑️  Clearing old knowledge chunks...");
    await KnowledgeChunk.deleteMany({ source: "website-guide" });

    console.log("🔢 Generating embeddings and storing knowledge chunks...");
    let kbSuccess = 0;
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
            kbSuccess++;
            console.log(`  ✅ Chunk ${i + 1}/${chunks.length} stored.`);
        } catch (err) {
            console.error(`  ❌ Failed chunk ${i + 1}: ${err.message}`);
        }
        if (i < chunks.length - 1) await new Promise(r => setTimeout(r, 200));
    }
    console.log(`🎉 Knowledge base seeded: ${kbSuccess}/${chunks.length} chunks stored.`);

    // ─── Step 2: Re-Index Existing Products ──────────────────────────────────
    console.log("\n🛍️ Step 2: Re-indexing existing products/items...");
    const items = await Item.find({});
    console.log(`Found ${items.length} items to process.`);

    let itemSuccess = 0;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        try {
            const textToEmbed = `${item.title} ${item.content.substring(0, 500)}`;
            const newEmbeddings = await getEmbeddings(textToEmbed);
            if (newEmbeddings && newEmbeddings.length > 0) {
                item.embeddings = newEmbeddings;
                await item.save();
                itemSuccess++;
                console.log(`  ✅ Item ${i + 1}/${items.length} updated (ID: ${item._id})`);
            } else {
                console.log(`  ⚠️ Item ${i + 1} got empty embeddings`);
            }
        } catch (err) {
            console.error(`  ❌ Failed item ${i + 1}: ${err.message}`);
        }
        if (i < items.length - 1) await new Promise(r => setTimeout(r, 200));
    }
    console.log(`🎉 Product re-indexing complete: ${itemSuccess}/${items.length} items updated.`);

    // ─── Step 3: Create Atlas Search Vector Indexes ──────────────────────────
    console.log("\n📐 Step 3: Setting up Atlas Search Vector Indexes...");
    const db = mongoose.connection.db;

    // A. Knowledge Base Index
    const kbCollection = db.collection("knowledgechunks");
    try {
        console.log("  Creating index 'knowledge_index' on 'knowledgechunks' collection...");
        await kbCollection.createSearchIndex({
            name: "knowledge_index",
            type: "vectorSearch",
            definition: {
                fields: [
                    {
                        type: "vector",
                        path: "embeddings",
                        numDimensions: 768,
                        similarity: "cosine",
                    },
                ],
            },
        });
        console.log("  ✅ Vector index 'knowledge_index' created successfully.");
    } catch (err) {
        if (err.message?.includes("already exists") || err.codeName === "IndexAlreadyExists") {
            console.log("  ℹ️ Index 'knowledge_index' already exists. Skipping.");
        } else {
            console.error("  ❌ Failed to create 'knowledge_index':", err.message);
        }
    }

    // B. Products Index
    const itemsCollection = db.collection("items");
    try {
        console.log("  Creating index 'vector_index' on 'items' collection...");
        await itemsCollection.createSearchIndex({
            name: "vector_index",
            type: "vectorSearch",
            definition: {
                fields: [
                    {
                        type: "vector",
                        path: "embeddings",
                        numDimensions: 768,
                        similarity: "cosine",
                    },
                ],
            },
        });
        console.log("  ✅ Vector index 'vector_index' created successfully.");
    } catch (err) {
        if (err.message?.includes("already exists") || err.codeName === "IndexAlreadyExists") {
            console.log("  ℹ️ Index 'vector_index' already exists. Skipping.");
        } else {
            console.error("  ❌ Failed to create 'vector_index':", err.message);
        }
    }

    console.log("\n⏳ Disconnecting from MongoDB. Vector databases are restored!");
    console.log("💡 Note: Atlas Search Vector Indexes may take 1-2 minutes to become active in the MongoDB Atlas console.");
    await mongoose.disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error("❌ Fatal error restoring vector databases:", err);
    process.exit(1);
});

/**
 * Creates the Atlas Vector Search index for knowledge_chunks collection.
 * Run once: node scripts/createKnowledgeIndex.js
 */
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../Config/config.env") });

async function main() {
    console.log("🔌 Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected.");

    const db = mongoose.connection.db;
    const collection = db.collection("knowledgechunks");

    try {
        console.log("📐 Creating vector search index 'knowledge_index'...");
        await collection.createSearchIndex({
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
        console.log("✅ Index 'knowledge_index' created successfully on 'knowledgechunks'!");
        console.log("⏳ Note: Atlas indexes take 1–2 minutes to become active.");
    } catch (err) {
        if (err.message?.includes("already exists") || err.codeName === "IndexAlreadyExists") {
            console.log("ℹ️  Index 'knowledge_index' already exists. Nothing to do.");
        } else {
            console.error("❌ Failed to create index:", err.message);
        }
    }

    await mongoose.disconnect();
    console.log("🔌 Disconnected. Done!");
    process.exit(0);
}

main().catch(err => {
    console.error("Fatal:", err);
    process.exit(1);
});

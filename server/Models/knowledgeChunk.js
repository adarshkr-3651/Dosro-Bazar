import mongoose from "mongoose";

const KnowledgeChunkSchema = new mongoose.Schema({
    // The original text chunk
    content: {
        type: String,
        required: true,
    },
    // Source document identifier
    source: {
        type: String,
        default: "website-guide",
    },
    // Chunk position in the original document (for ordering)
    chunkIndex: {
        type: Number,
        default: 0,
    },
    // Gemini text-embedding-004 produces 768-dimensional vectors
    embeddings: {
        type: [Number],
        default: [],
    },
}, { timestamps: true });

const KnowledgeChunk = mongoose.model("KnowledgeChunk", KnowledgeChunkSchema);

export default KnowledgeChunk;

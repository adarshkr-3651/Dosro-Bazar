import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Conversation from "./Models/conversation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'Config', 'config.env') });

const dropIndex = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");
        
        // Drop the specific index
        await Conversation.collection.dropIndex("participants_1_item_1");
        console.log("Successfully dropped the index 'participants_1_item_1'");
        
    } catch (error) {
        if (error.codeName === 'IndexNotFound') {
             console.log("Index already dropped or doesn't exist.");
        } else {
             console.error("Error dropping index:", error);
        }
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
        process.exit(0);
    }
};

dropIndex();

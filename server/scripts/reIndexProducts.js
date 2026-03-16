import dotenv from "dotenv";
import mongoose from "mongoose";
import Item from "../Models/item.js";
import getEmbeddings from "../Helpers/Libraries/embeddings.js";

dotenv.config({ path: "./Config/config.env" });

async function main() {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected.");

    const items = await Item.find({});
    console.log(`Found ${items.length} items to re-index.`);

    let successCount = 0;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        try {
            const textToEmbed = `${item.title} ${item.content.substring(0, 500)}`;
            const newEmbeddings = await getEmbeddings(textToEmbed);
            if (newEmbeddings && newEmbeddings.length > 0) {
                item.embeddings = newEmbeddings;
                await item.save();
                successCount++;
                console.log(`  ✅ Item ${i + 1}/${items.length} updated (ID: ${item._id})`);
            } else {
                console.log(`  ⚠️ Item ${i + 1} got empty embeddings`);
            }
        } catch (err) {
            console.error(`  ❌ Failed item ${i + 1}:`, err.message);
        }
        
        // Small delay
        await new Promise(r => setTimeout(r, 200));
    }

    console.log(`\n🎉 Re-indexing complete! ${successCount}/${items.length} items updated.`);
    await mongoose.disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});

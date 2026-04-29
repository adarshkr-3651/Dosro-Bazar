import mongoose from 'mongoose';
import Advertisement from './Models/Advertisement.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'Config', 'config.env') });

async function cleanAds() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dosro-bazar');
        console.log('Connected to DB');
        
        const result = await Advertisement.deleteMany({ 
            $or: [
                { companyName: /FUCK/i },
                { imageUrl: /ad_/i } // Most ad images have this prefix
            ]
        });
        
        console.log(`Deleted ${result.deletedCount} ads.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

cleanAds();

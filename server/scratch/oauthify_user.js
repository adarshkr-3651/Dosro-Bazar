import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../Models/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', 'Config', 'config.env') });

const oauthifyUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'test_oauth_verification@example.com';
        
        const user = await User.findOne({ email });
        if (!user) {
            console.error('User not found');
            process.exit(1);
        }

        user.authProvider = 'google';
        user.authProviders = ['google', 'email']; // Keep email just in case, but primary is google
        user.googleId = 'test_google_id_999';
        user.password = undefined; // Remove password
        
        await user.save();

        console.log('User OAuth-ified successfully:');
        console.log(JSON.stringify(user, null, 2));

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error updating user:', error);
        process.exit(1);
    }
};

oauthifyUser();

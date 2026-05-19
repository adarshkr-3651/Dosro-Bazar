import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../Models/user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', 'Config', 'config.env') });

const createTestUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const testEmail = 'oauth_test@example.com';
        
        // Remove existing test user if any
        await User.deleteOne({ email: testEmail });

        const user = await User.create({
            username: 'OAuthTestUser',
            email: testEmail,
            phone: '9800000000',
            googleId: 'test_google_id_123',
            authProvider: 'google',
            authProviders: ['google'],
            isVerified: true
            // No password field set
        });

        console.log('Test OAuth user created successfully:');
        console.log(JSON.stringify(user, null, 2));

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error creating test user:', error);
        process.exit(1);
    }
};

createTestUser();

import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables explicitly (in case they weren't loaded yet)
// Try multiple possible paths
const envPaths = [
    join(__dirname, '../../Config/config.env'),
    join(process.cwd(), 'Config/config.env'),
    join(process.cwd(), 'server/Config/config.env'),
];

let envLoaded = false;
for (const envPath of envPaths) {
    const result = dotenv.config({ path: envPath });
    if (!result.error) {
        envLoaded = true;
        // console.log(`Environment variables loaded from: ${envPath}`);
        break;
    }
}

if (!envLoaded) {
    console.warn("Warning: Could not load config.env file. Using process.env directly.");
}

// Configure Cloudinary with individual credentials
// This is more reliable than parsing CLOUDINARY_URL
const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Apply configuration
cloudinary.config(cloudinaryConfig);

// Log configuration status

// Verify configuration
if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
    console.error("ERROR: Cloudinary configuration is incomplete!");
    console.error("Please check your Config/config.env file for:");
    console.error("  - CLOUDINARY_CLOUD_NAME");
    console.error("  - CLOUDINARY_API_KEY");
    console.error("  - CLOUDINARY_API_SECRET");
    console.error("Current values:");
    console.error("  - CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
    console.error("  - CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "Set" : "Not set");
    console.error("  - CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "Set" : "Not set");
} else {
    // console.log("✓ Cloudinary configuration is valid");
}

export default cloudinary;

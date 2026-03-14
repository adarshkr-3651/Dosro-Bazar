import dotenv from "dotenv";

console.log("Loading environment configuration from configLoader.js...");

// Load env vars from the specific file
const result = dotenv.config({
    path: './Config/config.env'
});

if (result.error) {
    console.error("Error loading .env file:", result.error);
} else {
    console.log("Environment variables loaded successfully.");
}

export default result;

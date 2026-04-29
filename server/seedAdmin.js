import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./Models/Admin.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "Config", "config.env") });

const MONGO_URI = process.env.MONGO_URI;

const seedAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Define your admin details here
        const adminDetails = {
            username: "adarsh",
            password: "adarsh@3651A", // Will be hashed by model pre-save hook
            phone: "9827349751",
            email: "admin@dosrobazar.com",
            role: "superadmin"
        };

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ username: adminDetails.username });
        if (existingAdmin) {
            console.log(`Admin with username '${adminDetails.username}' already exists. Updating details...`);
            existingAdmin.password = adminDetails.password;
            existingAdmin.phone = adminDetails.phone;
            existingAdmin.email = adminDetails.email;
            existingAdmin.role = adminDetails.role;
            await existingAdmin.save();
        } else {
            await Admin.create(adminDetails);
            console.log("Admin account created successfully!");
        }

        console.log("--------------------------------");
        console.log("Admin Seeding Complete:");
        console.log(`Username: ${adminDetails.username}`);
        console.log(`Password: ${adminDetails.password}`);
        console.log(`Role: ${adminDetails.role}`);
        console.log("--------------------------------");

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedAdmin();

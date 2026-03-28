import Admin from "../../Models/Admin.js";

/**
 * Initialize default admin account in the dedicated 'admins' collection
 * This runs on server startup to ensure at least one admin exists.
 */
const initializeNewAdmin = async () => {
    try {
        const { ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD, ADMIN_USERNAME } = process.env;

        // Check if admin credentials are configured
        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
            console.log("[initNewAdmin] Admin credentials not fully configured in environment variables");
            return;
        }

        // Check if any admin exists in the new 'admins' collection
        const adminCount = await Admin.countDocuments();

        if (adminCount > 0) {
            console.log(`[initNewAdmin] ✅ Dedicated Admin collection already has ${adminCount} account(s).`);
            return;
        }

        // Create new admin account in the dedicated collection
        const newAdmin = await Admin.create({
            username: ADMIN_USERNAME || "superadmin",
            email: ADMIN_EMAIL,
            phone: ADMIN_PHONE,
            password: ADMIN_PASSWORD,
            role: 'superadmin'
        });

        console.log(`[initNewAdmin] 🚀 Dedicated Admin account created successfully!`);
        console.log(`[initNewAdmin] Username: ${newAdmin.username}`);
        console.log(`[initNewAdmin] Email: ${newAdmin.email}`);
        console.log(`[initNewAdmin] Role: ${newAdmin.role}`);
        console.log(`[initNewAdmin] ⚠️  Please use these credentials to log in at /admin`);

    } catch (error) {
        console.error("[initNewAdmin] ❌ Error seeding dedicated admin account:", error.message);
    }
};

export default initializeNewAdmin;

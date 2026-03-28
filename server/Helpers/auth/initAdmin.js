import User from "../../Models/user.js";
import Admin from "../../Models/Admin.js";

/**
 * Initialize default admin account from environment variables
 * This function runs on server startup to ensure an admin account exists
 */
const initializeAdmin = async () => {
    try {
        const { ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD, ADMIN_USERNAME } = process.env;

        // Check if admin credentials are configured
        if (!ADMIN_EMAIL || !ADMIN_PHONE || !ADMIN_PASSWORD) {
            console.log("[initAdmin] Admin credentials not configured in environment variables");
            return;
        }

        // --- 1. Initialize Legacy Admin in User Collection ---
        const existingLegacyAdmin = await User.findOne({
            $or: [
                { email: ADMIN_EMAIL },
                { phone: ADMIN_PHONE }
            ]
        });

        if (existingLegacyAdmin) {
            if (existingLegacyAdmin.role !== 'admin') {
                existingLegacyAdmin.role = 'admin';
                await existingLegacyAdmin.save();
                console.log(`[initAdmin] ✅ Updated existing legacy user to admin: ${existingLegacyAdmin.email || existingLegacyAdmin.phone}`);
            }
        } else {
            await User.create({
                username: ADMIN_USERNAME || "Admin User",
                email: ADMIN_EMAIL,
                phone: ADMIN_PHONE,
                password: ADMIN_PASSWORD,
                role: 'admin',
                authProvider: 'email',
                authProviders: ['email']
            });
            console.log(`[initAdmin] ✅ Default legacy admin account created successfully in Users collection!`);
        }

        // --- 2. Initialize Modern Admin in Admin Collection ---
        const existingAdmin = await Admin.findOne({
            $or: [
                { email: ADMIN_EMAIL },
                { username: ADMIN_USERNAME || "superadmin" }
            ]
        });

        if (!existingAdmin) {
            await Admin.create({
                username: ADMIN_USERNAME || "superadmin",
                email: ADMIN_EMAIL,
                phone: ADMIN_PHONE,
                password: ADMIN_PASSWORD,
                role: 'superadmin'
            });
            console.log(`[initAdmin] ✅ Default SUPERADMIN account created successfully in Admins collection!`);
            console.log(`[initAdmin] Email/Username: ${ADMIN_EMAIL} or ${ADMIN_USERNAME || 'superadmin'}`);
            console.log(`[initAdmin] Password: ${ADMIN_PASSWORD}`);
        } else {
            console.log(`[initAdmin] ✅ Superadmin account already exists in Admins collection: ${existingAdmin.username}`);
        }

    } catch (error) {
        console.error("[initAdmin] ❌ Error initializing admin account:", error.message);
    }
};

export default initializeAdmin;


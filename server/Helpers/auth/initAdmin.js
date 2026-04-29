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
            return;
        }

        // 1. Initialize Legacy Admin in User Collection (Optional fallback)
        const existingLegacyAdmin = await User.findOne({
            $or: [{ email: ADMIN_EMAIL }, { phone: ADMIN_PHONE }]
        });

        if (!existingLegacyAdmin) {
            await User.create({
                username: ADMIN_USERNAME || "Admin User",
                email: ADMIN_EMAIL,
                phone: ADMIN_PHONE,
                password: ADMIN_PASSWORD,
                role: 'admin',
                isVerified: true,
                authProvider: 'email',
                authProviders: ['email']
            });
        }

        // 2. Initialize Modern Admin in Admin Collection (Primary Admin Credentials)
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
        }

    } catch (error) {
        console.error("[initAdmin] ❌ Error initializing admin account:", error.message);
    }
};

export default initializeAdmin;

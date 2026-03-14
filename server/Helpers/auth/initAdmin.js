import User from "../../Models/user.js";

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

        // Check if admin user already exists
        const existingAdmin = await User.findOne({
            $or: [
                { email: ADMIN_EMAIL },
                { phone: ADMIN_PHONE }
            ]
        });

        if (existingAdmin) {
            // Update existing user to admin if not already
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log(`[initAdmin] ✅ Updated existing user to admin: ${existingAdmin.email || existingAdmin.phone}`);
            } else {
                console.log(`[initAdmin] ✅ Admin account already exists: ${existingAdmin.email || existingAdmin.phone}`);
            }
            return;
        }

        // Create new admin user
        const adminUser = await User.create({
            username: ADMIN_USERNAME || "Admin User",
            email: ADMIN_EMAIL,
            phone: ADMIN_PHONE,
            password: ADMIN_PASSWORD,
            role: 'admin',
            authProvider: 'email',
            authProviders: ['email']
        });

        console.log(`[initAdmin] ✅ Default admin account created successfully!`);
        console.log(`[initAdmin] Email: ${ADMIN_EMAIL}`);
        console.log(`[initAdmin] Phone: ${ADMIN_PHONE}`);
        console.log(`[initAdmin] Password: ${ADMIN_PASSWORD}`);
        console.log(`[initAdmin] ⚠️  Please change the default password after first login!`);

    } catch (error) {
        console.error("[initAdmin] ❌ Error initializing admin account:", error.message);
    }
};

export default initializeAdmin;

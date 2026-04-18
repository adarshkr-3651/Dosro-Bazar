module.exports = [
"[project]/Desktop/Dosro Bazar - Main/client/app/lib/admin-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"001176be324642905056eac38dab1b114e5623cb2e":"getAdBookings","002a968cbb897e18ed7420cf4c091b5cf87eb87193":"isAdminAuthenticated","004917ba9c115305874085d18bea37a8f57ff83d40":"logoutAdmin","00e556ff15cd866bd72ab91b882c7c1b3142d21cfc":"getAdminProfile","403e5bd9bd93410a2b7260629bf10efd335929564d":"loginAdmin","40ea398f7451c0d874d1ecf7c820b61dd5f1e28caf":"createAdmin"},"",""] */ __turbopack_context__.s([
    "createAdmin",
    ()=>createAdmin,
    "getAdBookings",
    ()=>getAdBookings,
    "getAdminProfile",
    ()=>getAdminProfile,
    "isAdminAuthenticated",
    ()=>isAdminAuthenticated,
    "loginAdmin",
    ()=>loginAdmin,
    "logoutAdmin",
    ()=>logoutAdmin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
async function loginAdmin(formData) {
    const username = formData.get("username");
    const password = formData.get("password");
    try {
        const response = await fetch(`${BACKEND_URL}/admin-auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });
        const data = await response.json();
        if (data.success) {
            const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
            // CRITICAL FIX: Server Actions run in Node.js, so 'fetch' does not automatically 
            // send the backend's 'Set-Cookie' header to the user's browser. We have to proxy it manually.
            const setCookieHeader = response.headers.get("set-cookie");
            if (setCookieHeader) {
                const match = setCookieHeader.match(/admin_access_token=([^;]+)/);
                if (match && match[1]) {
                    cookieStore.set("admin_access_token", match[1], {
                        httpOnly: true,
                        secure: ("TURBOPACK compile-time value", "development") === "production",
                        maxAge: 60 * 60 * 24,
                        path: "/"
                    });
                }
            }
            cookieStore.set("admin_session", "authenticated", {
                httpOnly: true,
                secure: ("TURBOPACK compile-time value", "development") === "production",
                maxAge: 60 * 60 * 24,
                path: "/"
            });
            return {
                success: true
            };
        } else {
            return {
                success: false,
                error: data.error || data.message || "Authentication failed"
            };
        }
    } catch (error) {
        console.error("Login Error:", error);
        return {
            success: false,
            error: "Unable to connect to administration server"
        };
    }
}
async function logoutAdmin() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete("admin_session");
    cookieStore.delete("admin_access_token");
    try {
        await fetch(`${BACKEND_URL}/admin-auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (e) {
        console.error("Logout fetch error (ignored):", e);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/admin");
}
async function createAdmin(adminData) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;
    const cookiesToPass = [];
    if (adminToken) cookiesToPass.push(`admin_access_token=${adminToken}`);
    if (userToken) cookiesToPass.push(`accessToken=${userToken}`);
    const cookieHeader = cookiesToPass.join("; ");
    try {
        const response = await fetch(`${BACKEND_URL}/admin-auth/create-admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookieHeader
            },
            body: JSON.stringify(adminData)
        });
        const data = await response.json();
        if (data.success) {
            return {
                success: true,
                message: data.message
            };
        } else {
            return {
                success: false,
                error: data.error || data.message || "Failed to create administrator"
            };
        }
    } catch (error) {
        console.error("Create Admin Error:", error);
        return {
            success: false,
            error: "Unable to connect to administration server"
        };
    }
}
async function getAdminProfile() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;
    const cookiesToPass = [];
    if (adminToken) cookiesToPass.push(`admin_access_token=${adminToken}`);
    if (userToken) cookiesToPass.push(`accessToken=${userToken}`);
    const cookieHeader = cookiesToPass.join("; ");
    try {
        const response = await fetch(`${BACKEND_URL}/admin-auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookieHeader
            }
        });
        const data = await response.json();
        return data.success ? data.admin : null;
    } catch (error) {
        console.error("Get Profile Error:", error);
        return null;
    }
}
async function isAdminAuthenticated() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return cookieStore.get("admin_session")?.value === "authenticated";
}
async function getAdBookings() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;
    const cookiesToPass = [];
    if (adminToken) cookiesToPass.push(`admin_access_token=${adminToken}`);
    if (userToken) cookiesToPass.push(`accessToken=${userToken}`);
    const cookieHeader = cookiesToPass.join("; ");
    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/bookings/all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookieHeader
            }
        });
        const data = await response.json();
        return data.success ? data.bookings : [];
    } catch (error) {
        console.error("Get Ad Bookings Error:", error);
        return [];
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    loginAdmin,
    logoutAdmin,
    createAdmin,
    getAdminProfile,
    isAdminAuthenticated,
    getAdBookings
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(loginAdmin, "403e5bd9bd93410a2b7260629bf10efd335929564d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(logoutAdmin, "004917ba9c115305874085d18bea37a8f57ff83d40", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createAdmin, "40ea398f7451c0d874d1ecf7c820b61dd5f1e28caf", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAdminProfile, "00e556ff15cd866bd72ab91b882c7c1b3142d21cfc", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(isAdminAuthenticated, "002a968cbb897e18ed7420cf4c091b5cf87eb87193", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAdBookings, "001176be324642905056eac38dab1b114e5623cb2e", null);
}),
"[project]/Desktop/Dosro Bazar - Main/client/.next-internal/server/app/admin/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/Dosro Bazar - Main/client/app/lib/admin-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/app/lib/admin-actions.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/Desktop/Dosro Bazar - Main/client/.next-internal/server/app/admin/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/Dosro Bazar - Main/client/app/lib/admin-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "002a968cbb897e18ed7420cf4c091b5cf87eb87193",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isAdminAuthenticated"],
    "403e5bd9bd93410a2b7260629bf10efd335929564d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loginAdmin"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Desktop/Dosro Bazar - Main/client/.next-internal/server/app/admin/page/actions.js { ACTIONS_MODULE0 => "[project]/Desktop/Dosro Bazar - Main/client/app/lib/admin-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/app/lib/admin-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=Desktop_Dosro%20Bazar%20-%20Main_client_54a2f1d1._.js.map
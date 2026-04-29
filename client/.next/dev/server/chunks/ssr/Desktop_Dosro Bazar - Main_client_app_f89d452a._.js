module.exports = [
"[project]/Desktop/Dosro Bazar - Main/client/app/lib/admin-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"001176be324642905056eac38dab1b114e5623cb2e":"getAdBookings","002a968cbb897e18ed7420cf4c091b5cf87eb87193":"isAdminAuthenticated","004917ba9c115305874085d18bea37a8f57ff83d40":"logoutAdmin","00b54606a3ed20c864abad6ee958b85c6f4356be7e":"getAdvanceBookingsAction","00e556ff15cd866bd72ab91b882c7c1b3142d21cfc":"getAdminProfile","403e5bd9bd93410a2b7260629bf10efd335929564d":"loginAdmin","40ea398f7451c0d874d1ecf7c820b61dd5f1e28caf":"createAdmin"},"",""] */ __turbopack_context__.s([
    "createAdmin",
    ()=>createAdmin,
    "getAdBookings",
    ()=>getAdBookings,
    "getAdminProfile",
    ()=>getAdminProfile,
    "getAdvanceBookingsAction",
    ()=>getAdvanceBookingsAction,
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
async function getAdvanceBookingsAction() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;
    const cookiesToPass = [];
    if (adminToken) cookiesToPass.push(`admin_access_token=${adminToken}`);
    if (userToken) cookiesToPass.push(`accessToken=${userToken}`);
    const cookieHeader = cookiesToPass.join("; ");
    try {
        const response = await fetch(`${BACKEND_URL}/admin/advance-bookings`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookieHeader
            }
        });
        const data = await response.json();
        return data.success ? {
            success: true,
            data: data.data
        } : {
            success: false,
            error: data.message
        };
    } catch (error) {
        console.error("Get Advance Bookings Error:", error);
        return {
            success: false,
            error: "Connection error"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    loginAdmin,
    logoutAdmin,
    createAdmin,
    getAdminProfile,
    isAdminAuthenticated,
    getAdBookings,
    getAdvanceBookingsAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(loginAdmin, "403e5bd9bd93410a2b7260629bf10efd335929564d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(logoutAdmin, "004917ba9c115305874085d18bea37a8f57ff83d40", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createAdmin, "40ea398f7451c0d874d1ecf7c820b61dd5f1e28caf", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAdminProfile, "00e556ff15cd866bd72ab91b882c7c1b3142d21cfc", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(isAdminAuthenticated, "002a968cbb897e18ed7420cf4c091b5cf87eb87193", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAdBookings, "001176be324642905056eac38dab1b114e5623cb2e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAdvanceBookingsAction, "00b54606a3ed20c864abad6ee958b85c6f4356be7e", null);
}),
"[project]/Desktop/Dosro Bazar - Main/client/app/components/admin/LogoutButton.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/Desktop/Dosro Bazar - Main/client/app/components/admin/LogoutButton.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Dosro Bazar - Main/client/app/components/admin/LogoutButton.tsx <module evaluation>", "default");
}),
"[project]/Desktop/Dosro Bazar - Main/client/app/components/admin/LogoutButton.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/Desktop/Dosro Bazar - Main/client/app/components/admin/LogoutButton.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/Desktop/Dosro Bazar - Main/client/app/components/admin/LogoutButton.tsx", "default");
}),
"[project]/Desktop/Dosro Bazar - Main/client/app/components/admin/LogoutButton.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$components$2f$admin$2f$LogoutButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/app/components/admin/LogoutButton.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$components$2f$admin$2f$LogoutButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/app/components/admin/LogoutButton.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$components$2f$admin$2f$LogoutButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminDashboardLayout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/app/lib/admin-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-rsc] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/users.js [app-rsc] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/package.js [app-rsc] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/settings.js [app-rsc] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-rsc] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/search.js [app-rsc] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/bell.js [app-rsc] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$megaphone$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Megaphone$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/megaphone.js [app-rsc] (ecmascript) <export default as Megaphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/user-check.js [app-rsc] (ecmascript) <export default as UserCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/message-square.js [app-rsc] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/file-text.js [app-rsc] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/store.js [app-rsc] (ecmascript) <export default as Store>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/credit-card.js [app-rsc] (ecmascript) <export default as CreditCard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/zap.js [app-rsc] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/wallet.js [app-rsc] (ecmascript) <export default as Wallet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$components$2f$admin$2f$LogoutButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/app/components/admin/LogoutButton.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
async function AdminDashboardLayout({ children }) {
    const authenticated = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isAdminAuthenticated"])();
    if (!authenticated) {
        // Redirect to the new admin login page
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/admin");
    }
    const navItems = [
        {
            label: "Dashboard",
            href: "/admin/dashboard",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
        },
        {
            label: "Sellers",
            href: "/admin/dashboard/sellers",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$store$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Store$3e$__["Store"]
        },
        {
            label: "Items",
            href: "/admin/dashboard/items",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"]
        },
        {
            label: "Boosted Items",
            href: "/admin/dashboard/boosts",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"]
        },
        {
            label: "Advance Bookings",
            href: "/admin/dashboard/advance-bookings",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$wallet$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Wallet$3e$__["Wallet"]
        },
        {
            label: "Users",
            href: "/admin/dashboard/users",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"]
        },
        {
            label: "Advertisement",
            href: "/admin/dashboard/advertisement",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$megaphone$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Megaphone$3e$__["Megaphone"]
        },
        {
            label: "Ad Invoices",
            href: "/admin/dashboard/invoices",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$credit$2d$card$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__CreditCard$3e$__["CreditCard"]
        },
        {
            label: "Ad Inquiry",
            href: "/admin/dashboard/ad-inquiry",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"]
        },
        {
            label: "Verifications",
            href: "/admin/dashboard/verifications",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__UserCheck$3e$__["UserCheck"]
        },
        {
            label: "Reports",
            href: "/admin/dashboard/reports",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"]
        },
        {
            label: "Settings",
            href: "/admin/dashboard/settings",
            icon: __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"]
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen bg-slate-50 text-slate-600 font-sans selection:bg-emerald-500/30",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                className: "w-64 border-r border-slate-200 bg-white flex flex-col sticky top-0 h-screen overflow-y-auto custom-scrollbar shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-6 flex items-center gap-3 border-b border-slate-100 flex-shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-2 bg-emerald-500/5 rounded-lg",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                    className: "w-6 h-6 text-emerald-600"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                                    lineNumber: 43,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                                lineNumber: 42,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-bold text-slate-900 tracking-tight",
                                children: "Dosro Bazar Admin"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                                lineNumber: 45,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                        lineNumber: 41,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "flex-1 px-4 py-8 space-y-1",
                        children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                href: item.href,
                                className: "flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(item.icon, {
                                        className: "w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                                        lineNumber: 55,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-sm",
                                        children: item.label
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                                        lineNumber: 56,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, item.href, true, {
                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                                lineNumber: 50,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                        lineNumber: 48,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 border-t border-slate-100 flex-shrink-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$components$2f$admin$2f$LogoutButton$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                            lineNumber: 62,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                        lineNumber: 61,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                lineNumber: 40,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 focus-within:border-emerald-500/50 focus-within:bg-white transition-all w-96",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                        className: "w-4 h-4 text-slate-400"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                                        lineNumber: 70,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Search administration...",
                                        className: "bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 text-slate-900"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                                        lineNumber: 71,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                                lineNumber: 69,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "relative p-2 text-slate-400 hover:text-slate-900 transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                                                lineNumber: 80,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border border-white"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                                                lineNumber: 81,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                                        lineNumber: 79,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 pl-6 border-l border-slate-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-right",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-semibold text-slate-900",
                                                        children: "System Admin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                                                        lineNumber: 85,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-slate-400",
                                                        children: "Root Access"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                                                        lineNumber: 86,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                                                lineNumber: 84,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-emerald-600 font-bold",
                                                children: "SA"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                                                lineNumber: 88,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                                        lineNumber: 83,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                                lineNumber: 78,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                        lineNumber: 68,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                        className: "flex-1 p-8 overflow-y-auto",
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                        lineNumber: 95,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
                lineNumber: 67,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/admin/dashboard/layout.tsx",
        lineNumber: 38,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=Desktop_Dosro%20Bazar%20-%20Main_client_app_f89d452a._.js.map
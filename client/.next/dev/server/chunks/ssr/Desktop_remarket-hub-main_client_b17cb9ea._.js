module.exports = [
"[project]/Desktop/remarket-hub-main/client/app/lib/admin-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0083b4d12061e759d99492aa576470fe7a34dfb5b1":"isAdminAuthenticated","00c367fbe8b23eab14423b7ab1ee9a5e2cdb4fa131":"logoutAdmin","405ec430ed87a2f7abc8dff20dd469727520f27b22":"loginAdmin"},"",""] */ __turbopack_context__.s([
    "isAdminAuthenticated",
    ()=>isAdminAuthenticated,
    "loginAdmin",
    ()=>loginAdmin,
    "logoutAdmin",
    ()=>logoutAdmin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/client/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/client/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/client/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function loginAdmin(formData) {
    const username = formData.get("username");
    const password = formData.get("password");
    const envUsername = process.env.ADMIN_USERNAME || "admin";
    const envPassword = process.env.ADMIN_PASSWORD || "adminpassword123";
    if (username === envUsername && password === envPassword) {
        const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
        cookieStore.set("admin_session", "authenticated", {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === "production",
            maxAge: 60 * 60 * 24,
            path: "/"
        });
        return {
            success: true
        };
    }
    return {
        success: false,
        error: "Invalid credentials"
    };
}
async function logoutAdmin() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete("admin_session");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/adminlogin");
}
async function isAdminAuthenticated() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return cookieStore.get("admin_session")?.value === "authenticated";
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    loginAdmin,
    logoutAdmin,
    isAdminAuthenticated
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(loginAdmin, "405ec430ed87a2f7abc8dff20dd469727520f27b22", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(logoutAdmin, "00c367fbe8b23eab14423b7ab1ee9a5e2cdb4fa131", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(isAdminAuthenticated, "0083b4d12061e759d99492aa576470fe7a34dfb5b1", null);
}),
"[project]/Desktop/remarket-hub-main/client/.next-internal/server/app/adminlogin/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/remarket-hub-main/client/app/lib/admin-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/client/app/lib/admin-actions.ts [app-rsc] (ecmascript)");
;
}),
"[project]/Desktop/remarket-hub-main/client/.next-internal/server/app/adminlogin/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/remarket-hub-main/client/app/lib/admin-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "405ec430ed87a2f7abc8dff20dd469727520f27b22",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loginAdmin"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f2e$next$2d$internal$2f$server$2f$app$2f$adminlogin$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Desktop/remarket-hub-main/client/.next-internal/server/app/adminlogin/page/actions.js { ACTIONS_MODULE0 => "[project]/Desktop/remarket-hub-main/client/app/lib/admin-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/client/app/lib/admin-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=Desktop_remarket-hub-main_client_b17cb9ea._.js.map
module.exports = [
"[project]/Desktop/Dosro Bazar - Main/client/app/lib/admin-data-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0018ecc063da8e847243dc3ef70242f439afd33abc":"getUserStatsAction","00ad6103891b4428402d6913a1d52161f45a554f93":"getItemStatsAction","00dc45866c4187ae66ec0da31e37f9df8753188456":"getAdStatsAction","00dc97466dbd97860b4ad61c630628b79d5e928488":"getDashboardAction","4021975cf63066196ecfe2811e18234983e3a2dda6":"deleteItemAction","408904678ca0ecdf7bcaa5fec1d20d2383e19dda40":"deleteUserAction","600a710f75eba3e8aa1da24e21d6ad6b31b1aaa44a":"updateVerificationAction","602c1efaf0579503415383ba8d78cc8da21da58fde":"getSellersAction","6036c71f9d85db57e4dd17e2acc7e80e237db7d8f8":"getUsersAction","607203496958e62bb0066fba6df6207f95c4654165":"getItemsAction","6087e19ef495c1ee23d4d024e4661bba1fe1571039":"updateUserAction","60bcb1107248af8cbecb6e4c5713669a47f09734e1":"getVerificationsAction"},"",""] */ __turbopack_context__.s([
    "deleteItemAction",
    ()=>deleteItemAction,
    "deleteUserAction",
    ()=>deleteUserAction,
    "getAdStatsAction",
    ()=>getAdStatsAction,
    "getDashboardAction",
    ()=>getDashboardAction,
    "getItemStatsAction",
    ()=>getItemStatsAction,
    "getItemsAction",
    ()=>getItemsAction,
    "getSellersAction",
    ()=>getSellersAction,
    "getUserStatsAction",
    ()=>getUserStatsAction,
    "getUsersAction",
    ()=>getUsersAction,
    "getVerificationsAction",
    ()=>getVerificationsAction,
    "updateUserAction",
    ()=>updateUserAction,
    "updateVerificationAction",
    ()=>updateVerificationAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
// NOTE: All actions in this file are Server Actions that proxy requests to the
// backend Node/Express API using the admin token from the server-side cookie store.
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
async function getAdminCookieHeader() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;
    const parts = [];
    if (adminToken) parts.push(`admin_access_token=${adminToken}`);
    if (userToken) parts.push(`accessToken=${userToken}`);
    return parts.join("; ");
}
async function getUsersAction(page = 1, search = "") {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const params = new URLSearchParams({
            page: String(page),
            limit: "12",
            search
        });
        const res = await fetch(`${BACKEND_URL}/admin/users?${params}`, {
            headers: {
                Cookie: cookieHeader
            },
            cache: "no-store"
        });
        return await res.json();
    } catch  {
        return {
            success: false,
            error: "Failed to fetch users"
        };
    }
}
async function getUserStatsAction() {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const res = await fetch(`${BACKEND_URL}/admin/users/stats`, {
            headers: {
                Cookie: cookieHeader
            },
            cache: "no-store"
        });
        return await res.json();
    } catch  {
        return {
            success: false
        };
    }
}
async function deleteUserAction(id) {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const res = await fetch(`${BACKEND_URL}/admin/users/${id}`, {
            method: "DELETE",
            headers: {
                Cookie: cookieHeader
            }
        });
        return await res.json();
    } catch  {
        return {
            success: false,
            error: "Failed to delete user"
        };
    }
}
async function updateUserAction(id, data) {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const res = await fetch(`${BACKEND_URL}/admin/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader
            },
            body: JSON.stringify(data)
        });
        return await res.json();
    } catch  {
        return {
            success: false,
            error: "Failed to update user"
        };
    }
}
async function getItemsAction(page = 1, search = "") {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const params = new URLSearchParams({
            page: String(page),
            limit: "12",
            search
        });
        const res = await fetch(`${BACKEND_URL}/admin/items?${params}`, {
            headers: {
                Cookie: cookieHeader
            },
            cache: "no-store"
        });
        return await res.json();
    } catch  {
        return {
            success: false,
            error: "Failed to fetch items"
        };
    }
}
async function getItemStatsAction() {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const res = await fetch(`${BACKEND_URL}/admin/items/stats`, {
            headers: {
                Cookie: cookieHeader
            },
            cache: "no-store"
        });
        return await res.json();
    } catch  {
        return {
            success: false
        };
    }
}
async function deleteItemAction(id) {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const res = await fetch(`${BACKEND_URL}/admin/items/${id}`, {
            method: "DELETE",
            headers: {
                Cookie: cookieHeader
            }
        });
        return await res.json();
    } catch  {
        return {
            success: false,
            error: "Failed to delete item"
        };
    }
}
async function getSellersAction(page = 1, search = "") {
    const cookieHeader = await getAdminCookieHeader();
    try {
        // Show all users who have submitted an ID proof document (seller candidates)
        // We use hasIdProof=true instead of role=seller because many submitters are
        // still role='buyer' until ALL profile criteria are met automatically.
        const params = new URLSearchParams({
            page: String(page),
            limit: "12",
            hasIdProof: "true"
        });
        if (search) params.set("search", search);
        const res = await fetch(`${BACKEND_URL}/admin/users?${params}`, {
            headers: {
                Cookie: cookieHeader
            },
            cache: "no-store"
        });
        return await res.json();
    } catch  {
        return {
            success: false,
            error: "Failed to fetch sellers"
        };
    }
}
async function getVerificationsAction(page = 1, status = "") {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const params = new URLSearchParams({
            page: String(page),
            limit: "12",
            hasIdProof: "true"
        });
        // If a specific status tab is selected, filter at the DB level so pagination
        // is accurate. For 'all' tab we only need the hasIdProof filter.
        if (status) params.set("verificationStatus", status);
        const res = await fetch(`${BACKEND_URL}/admin/users?${params}`, {
            headers: {
                Cookie: cookieHeader
            },
            cache: "no-store"
        });
        return await res.json();
    } catch  {
        return {
            success: false,
            error: "Failed to fetch verifications"
        };
    }
}
async function getAdStatsAction() {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const res = await fetch(`${BACKEND_URL}/advertisements`, {
            headers: {
                Cookie: cookieHeader
            },
            cache: "no-store"
        });
        const data = await res.json();
        if (!data.success) return {
            success: false
        };
        const ads = data.ads || [];
        return {
            success: true,
            data: {
                total: ads.length,
                running: ads.filter((a)=>a.status === "running").length,
                stopped: ads.filter((a)=>a.status === "stopped").length,
                expired: ads.filter((a)=>a.status === "expired").length
            }
        };
    } catch  {
        return {
            success: false
        };
    }
}
async function updateVerificationAction(id, verificationStatus) {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const res = await fetch(`${BACKEND_URL}/admin/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieHeader
            },
            body: JSON.stringify({
                verificationStatus
            })
        });
        return await res.json();
    } catch  {
        return {
            success: false,
            error: "Failed to update verification"
        };
    }
}
async function getDashboardAction() {
    const cookieHeader = await getAdminCookieHeader();
    try {
        const res = await fetch(`${BACKEND_URL}/admin/dashboard`, {
            headers: {
                Cookie: cookieHeader
            },
            cache: "no-store"
        });
        return await res.json();
    } catch  {
        return {
            success: false,
            error: "Failed to fetch dashboard data"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getUsersAction,
    getUserStatsAction,
    deleteUserAction,
    updateUserAction,
    getItemsAction,
    getItemStatsAction,
    deleteItemAction,
    getSellersAction,
    getVerificationsAction,
    getAdStatsAction,
    updateVerificationAction,
    getDashboardAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUsersAction, "6036c71f9d85db57e4dd17e2acc7e80e237db7d8f8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserStatsAction, "0018ecc063da8e847243dc3ef70242f439afd33abc", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteUserAction, "408904678ca0ecdf7bcaa5fec1d20d2383e19dda40", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateUserAction, "6087e19ef495c1ee23d4d024e4661bba1fe1571039", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getItemsAction, "607203496958e62bb0066fba6df6207f95c4654165", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getItemStatsAction, "00ad6103891b4428402d6913a1d52161f45a554f93", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteItemAction, "4021975cf63066196ecfe2811e18234983e3a2dda6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getSellersAction, "602c1efaf0579503415383ba8d78cc8da21da58fde", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getVerificationsAction, "60bcb1107248af8cbecb6e4c5713669a47f09734e1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAdStatsAction, "00dc45866c4187ae66ec0da31e37f9df8753188456", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateVerificationAction, "600a710f75eba3e8aa1da24e21d6ad6b31b1aaa44a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getDashboardAction, "00dc97466dbd97860b4ad61c630628b79d5e928488", null);
}),
"[project]/Desktop/Dosro Bazar - Main/client/.next-internal/server/app/admin/dashboard/reports/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/Dosro Bazar - Main/client/app/lib/admin-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/Desktop/Dosro Bazar - Main/client/app/lib/admin-data-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/app/lib/admin-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$data$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/app/lib/admin-data-actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
}),
"[project]/Desktop/Dosro Bazar - Main/client/.next-internal/server/app/admin/dashboard/reports/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/Dosro Bazar - Main/client/app/lib/admin-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/Desktop/Dosro Bazar - Main/client/app/lib/admin-data-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "001176be324642905056eac38dab1b114e5623cb2e",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdBookings"],
    "0018ecc063da8e847243dc3ef70242f439afd33abc",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$data$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserStatsAction"],
    "002a968cbb897e18ed7420cf4c091b5cf87eb87193",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["isAdminAuthenticated"],
    "004917ba9c115305874085d18bea37a8f57ff83d40",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["logoutAdmin"],
    "00ad6103891b4428402d6913a1d52161f45a554f93",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$data$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getItemStatsAction"],
    "00dc45866c4187ae66ec0da31e37f9df8753188456",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$data$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdStatsAction"],
    "00dc97466dbd97860b4ad61c630628b79d5e928488",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$data$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDashboardAction"],
    "00e556ff15cd866bd72ab91b882c7c1b3142d21cfc",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminProfile"],
    "403e5bd9bd93410a2b7260629bf10efd335929564d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loginAdmin"],
    "40ea398f7451c0d874d1ecf7c820b61dd5f1e28caf",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdmin"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f2e$next$2d$internal$2f$server$2f$app$2f$admin$2f$dashboard$2f$reports$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$data$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Desktop/Dosro Bazar - Main/client/.next-internal/server/app/admin/dashboard/reports/page/actions.js { ACTIONS_MODULE0 => "[project]/Desktop/Dosro Bazar - Main/client/app/lib/admin-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/Desktop/Dosro Bazar - Main/client/app/lib/admin-data-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/app/lib/admin-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$admin$2d$data$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/app/lib/admin-data-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=Desktop_Dosro%20Bazar%20-%20Main_client_45d0ec96._.js.map
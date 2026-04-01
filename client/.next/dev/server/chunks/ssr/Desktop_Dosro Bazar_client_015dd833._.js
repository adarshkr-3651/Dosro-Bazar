module.exports = [
"[project]/Desktop/Dosro Bazar/client/app/lib/ad-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0084d64e5a9786154c8bc1250b4af7d3892cb5c027":"getAllAdsAction","4077ade24bd4b375213ef1fe2272fbb7dbf99967d1":"deleteAdAction","40d5a7f36801ff6d62a894b274a7ea0516d9c6c9a9":"createAdAction","601fe52938c4132ef56212a7d03191d6c2a65e03a1":"submitAdEnquiryAction","6048ec1ac8b449438d9879606dc4114a2981af3aa8":"updateAdStatusAction","60ddcc2a959e07512b673c486fa15836005e6ed575":"editAdAction"},"",""] */ __turbopack_context__.s([
    "createAdAction",
    ()=>createAdAction,
    "deleteAdAction",
    ()=>deleteAdAction,
    "editAdAction",
    ()=>editAdAction,
    "getAllAdsAction",
    ()=>getAllAdsAction,
    "submitAdEnquiryAction",
    ()=>submitAdEnquiryAction,
    "updateAdStatusAction",
    ()=>updateAdStatusAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar/client/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
async function createAdAction(formData) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;
    const cookiesToPass = [];
    if (adminToken) cookiesToPass.push(`admin_access_token=${adminToken}`);
    if (userToken) cookiesToPass.push(`accessToken=${userToken}`);
    const cookieHeader = cookiesToPass.join("; ");
    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/create`, {
            method: "POST",
            headers: {
                "Cookie": cookieHeader
            },
            body: formData
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Create Ad Error:", error);
        return {
            success: false,
            error: "Failed to connect to ad server"
        };
    }
}
async function getAllAdsAction() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;
    const cookiesToPass = [];
    if (adminToken) cookiesToPass.push(`admin_access_token=${adminToken}`);
    if (userToken) cookiesToPass.push(`accessToken=${userToken}`);
    const cookieHeader = cookiesToPass.join("; ");
    try {
        const response = await fetch(`${BACKEND_URL}/advertisements`, {
            method: "GET",
            headers: {
                "Cookie": cookieHeader
            },
            cache: "no-store"
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Get Ads Error:", error);
        return {
            success: false,
            ads: []
        };
    }
}
async function updateAdStatusAction(id, status) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;
    const cookiesToPass = [];
    if (adminToken) cookiesToPass.push(`admin_access_token=${adminToken}`);
    if (userToken) cookiesToPass.push(`accessToken=${userToken}`);
    const cookieHeader = cookiesToPass.join("; ");
    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Cookie": cookieHeader
            },
            body: JSON.stringify({
                status
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Update Status Error:", error);
        return {
            success: false,
            error: "Failed to update ad status"
        };
    }
}
async function deleteAdAction(id) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;
    let cookieHeader = "";
    if (adminToken) cookieHeader += `admin_access_token=${adminToken}; `;
    if (userToken) cookieHeader += `accessToken=${userToken}; `;
    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/${id}`, {
            method: "DELETE",
            headers: {
                "Cookie": cookieHeader
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Delete Ad Error:", error);
        return {
            success: false,
            error: "Failed to delete advertisement"
        };
    }
}
async function submitAdEnquiryAction(id, enquiryData) {
    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/${id}/enquire`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(enquiryData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Submit Enquiry Error:", error);
        return {
            success: false,
            error: "Failed to submit inquiry to server"
        };
    }
}
async function editAdAction(id, formData) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    const userToken = cookieStore.get("accessToken")?.value;
    const cookiesToPass = [];
    if (adminToken) cookiesToPass.push(`admin_access_token=${adminToken}`);
    if (userToken) cookiesToPass.push(`accessToken=${userToken}`);
    const cookieHeader = cookiesToPass.join("; ");
    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/${id}`, {
            method: "PUT",
            headers: {
                "Cookie": cookieHeader
            },
            body: formData
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Edit Ad Error:", error);
        return {
            success: false,
            error: "Failed to connect to ad server for editing."
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createAdAction,
    getAllAdsAction,
    updateAdStatusAction,
    deleteAdAction,
    submitAdEnquiryAction,
    editAdAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createAdAction, "40d5a7f36801ff6d62a894b274a7ea0516d9c6c9a9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAllAdsAction, "0084d64e5a9786154c8bc1250b4af7d3892cb5c027", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateAdStatusAction, "6048ec1ac8b449438d9879606dc4114a2981af3aa8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteAdAction, "4077ade24bd4b375213ef1fe2272fbb7dbf99967d1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(submitAdEnquiryAction, "601fe52938c4132ef56212a7d03191d6c2a65e03a1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(editAdAction, "60ddcc2a959e07512b673c486fa15836005e6ed575", null);
}),
"[project]/Desktop/Dosro Bazar/client/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/Dosro Bazar/client/app/lib/ad-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$app$2f$lib$2f$ad$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar/client/app/lib/ad-actions.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
}),
"[project]/Desktop/Dosro Bazar/client/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/Dosro Bazar/client/app/lib/ad-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "0084d64e5a9786154c8bc1250b4af7d3892cb5c027",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$app$2f$lib$2f$ad$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAllAdsAction"],
    "4077ade24bd4b375213ef1fe2272fbb7dbf99967d1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$app$2f$lib$2f$ad$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteAdAction"],
    "40d5a7f36801ff6d62a894b274a7ea0516d9c6c9a9",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$app$2f$lib$2f$ad$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdAction"],
    "601fe52938c4132ef56212a7d03191d6c2a65e03a1",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$app$2f$lib$2f$ad$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["submitAdEnquiryAction"],
    "6048ec1ac8b449438d9879606dc4114a2981af3aa8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$app$2f$lib$2f$ad$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateAdStatusAction"],
    "60ddcc2a959e07512b673c486fa15836005e6ed575",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$app$2f$lib$2f$ad$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["editAdAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$app$2f$lib$2f$ad$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Desktop/Dosro Bazar/client/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/Desktop/Dosro Bazar/client/app/lib/ad-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar$2f$client$2f$app$2f$lib$2f$ad$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar/client/app/lib/ad-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=Desktop_Dosro%20Bazar_client_015dd833._.js.map
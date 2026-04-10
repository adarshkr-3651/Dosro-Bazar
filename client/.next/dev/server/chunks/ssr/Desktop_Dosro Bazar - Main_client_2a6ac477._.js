module.exports = [
"[project]/Desktop/Dosro Bazar - Main/client/app/lib/ad-actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0054d45e5b8ac1149397e0acd86115a4e341342088":"getAdminAdInquiriesAction","00c26984806d28f5736fe0049636f04d8a2a6e0dae":"getAllAdsAction","402244504039ead3d871a4b15e5253ce006e42fd91":"initiateAdBookingAction","404d14c53ac157373c0f085eb45caf26d41dd021f1":"deleteAdAction","405cd0acadae2015cca3e40147d42af520d532f250":"submitAdminAdInquiryAction","40c84ff3daa0b19ee0a47664a2df73d056ff764f54":"createAdAction","40e6a9931f0d72da289c285e7344543233ad5e819f":"deleteAdInquiryAction","6017a682d8e27007b48d0866164a0e6ac1169cad99":"updateAdInquiryStatusAction","601d73044c3adb4c02e25770ac3240a6221006fbdc":"submitAdEnquiryAction","609c034d20b80c1c8a336fdabdeb242697dfb7e9f3":"editAdAction","60c7093d1c17f11527c14fbebac9d1b865b7820fb2":"updateAdStatusAction","707758faf8806755f653909220e2e1ae815c41d3d0":"verifyKhaltiPaymentAction"},"",""] */ __turbopack_context__.s([
    "createAdAction",
    ()=>createAdAction,
    "deleteAdAction",
    ()=>deleteAdAction,
    "deleteAdInquiryAction",
    ()=>deleteAdInquiryAction,
    "editAdAction",
    ()=>editAdAction,
    "getAdminAdInquiriesAction",
    ()=>getAdminAdInquiriesAction,
    "getAllAdsAction",
    ()=>getAllAdsAction,
    "initiateAdBookingAction",
    ()=>initiateAdBookingAction,
    "submitAdEnquiryAction",
    ()=>submitAdEnquiryAction,
    "submitAdminAdInquiryAction",
    ()=>submitAdminAdInquiryAction,
    "updateAdInquiryStatusAction",
    ()=>updateAdInquiryStatusAction,
    "updateAdStatusAction",
    ()=>updateAdStatusAction,
    "verifyKhaltiPaymentAction",
    ()=>verifyKhaltiPaymentAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
async function createAdAction(formData) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
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
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
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
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
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
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
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
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
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
async function submitAdminAdInquiryAction(enquiryData) {
    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/inquiry/admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(enquiryData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Submit Admin Inquiry Error:", error);
        return {
            success: false,
            error: "Failed to connect to server"
        };
    }
}
async function getAdminAdInquiriesAction() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/inquiries/all`, {
            method: "GET",
            headers: {
                "Cookie": `admin_access_token=${adminToken}`
            },
            cache: "no-store"
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Get Ad Inquiries Error:", error);
        return {
            success: false,
            data: []
        };
    }
}
async function updateAdInquiryStatusAction(id, status) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/inquiries/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Cookie": `admin_access_token=${adminToken}`
            },
            body: JSON.stringify({
                status
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Update Inquiry Status Error:", error);
        return {
            success: false,
            error: "Failed to update status"
        };
    }
}
async function deleteAdInquiryAction(id) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const adminToken = cookieStore.get("admin_access_token")?.value;
    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/inquiries/${id}`, {
            method: "DELETE",
            headers: {
                "Cookie": `admin_access_token=${adminToken}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Delete Inquiry Error:", error);
        return {
            success: false,
            error: "Failed to delete inquiry"
        };
    }
}
async function initiateAdBookingAction(formData) {
    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/book`, {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Initiate Ad Booking Error:", error);
        return {
            success: false,
            error: "Failed to connect to server"
        };
    }
}
async function verifyKhaltiPaymentAction(pidx, amount, purchase_order_id) {
    try {
        const response = await fetch(`${BACKEND_URL}/advertisements/payment/khalti/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                pidx,
                amount,
                purchase_order_id
            })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Verify Khalti Error:", error);
        return {
            success: false,
            error: "Failed to verify Khalti payment"
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createAdAction,
    getAllAdsAction,
    updateAdStatusAction,
    deleteAdAction,
    submitAdEnquiryAction,
    editAdAction,
    submitAdminAdInquiryAction,
    getAdminAdInquiriesAction,
    updateAdInquiryStatusAction,
    deleteAdInquiryAction,
    initiateAdBookingAction,
    verifyKhaltiPaymentAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createAdAction, "40c84ff3daa0b19ee0a47664a2df73d056ff764f54", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAllAdsAction, "00c26984806d28f5736fe0049636f04d8a2a6e0dae", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateAdStatusAction, "60c7093d1c17f11527c14fbebac9d1b865b7820fb2", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteAdAction, "404d14c53ac157373c0f085eb45caf26d41dd021f1", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(submitAdEnquiryAction, "601d73044c3adb4c02e25770ac3240a6221006fbdc", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(editAdAction, "609c034d20b80c1c8a336fdabdeb242697dfb7e9f3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(submitAdminAdInquiryAction, "405cd0acadae2015cca3e40147d42af520d532f250", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAdminAdInquiriesAction, "0054d45e5b8ac1149397e0acd86115a4e341342088", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateAdInquiryStatusAction, "6017a682d8e27007b48d0866164a0e6ac1169cad99", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteAdInquiryAction, "40e6a9931f0d72da289c285e7344543233ad5e819f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(initiateAdBookingAction, "402244504039ead3d871a4b15e5253ce006e42fd91", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(verifyKhaltiPaymentAction, "707758faf8806755f653909220e2e1ae815c41d3d0", null);
}),
"[project]/Desktop/Dosro Bazar - Main/client/.next-internal/server/app/payment-verify/khalti/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/Dosro Bazar - Main/client/app/lib/ad-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$ad$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/app/lib/ad-actions.ts [app-rsc] (ecmascript)");
;
}),
"[project]/Desktop/Dosro Bazar - Main/client/.next-internal/server/app/payment-verify/khalti/page/actions.js { ACTIONS_MODULE0 => \"[project]/Desktop/Dosro Bazar - Main/client/app/lib/ad-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "707758faf8806755f653909220e2e1ae815c41d3d0",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$ad$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["verifyKhaltiPaymentAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f2e$next$2d$internal$2f$server$2f$app$2f$payment$2d$verify$2f$khalti$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$ad$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/Desktop/Dosro Bazar - Main/client/.next-internal/server/app/payment-verify/khalti/page/actions.js { ACTIONS_MODULE0 => "[project]/Desktop/Dosro Bazar - Main/client/app/lib/ad-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$ad$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/app/lib/ad-actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=Desktop_Dosro%20Bazar%20-%20Main_client_2a6ac477._.js.map
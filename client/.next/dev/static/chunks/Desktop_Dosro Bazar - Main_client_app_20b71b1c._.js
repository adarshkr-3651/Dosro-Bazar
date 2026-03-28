(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/Dosro Bazar - Main/client/app/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addItem",
    ()=>addItem,
    "changePassword",
    ()=>changePassword,
    "chatWithAI",
    ()=>chatWithAI,
    "completeOAuthRegistration",
    ()=>completeOAuthRegistration,
    "default",
    ()=>__TURBOPACK__default__export__,
    "deleteChatMessage",
    ()=>deleteChatMessage,
    "endpoints",
    ()=>endpoints,
    "facebookLogin",
    ()=>facebookLogin,
    "forgotPassword",
    ()=>forgotPassword,
    "generateItemDescription",
    ()=>generateItemDescription,
    "getAllItems",
    ()=>getAllItems,
    "getConversations",
    ()=>getConversations,
    "getEditItemData",
    ()=>getEditItemData,
    "getFavorites",
    ()=>getFavorites,
    "getMessages",
    ()=>getMessages,
    "getMyListings",
    ()=>getMyListings,
    "getNotifications",
    ()=>getNotifications,
    "getProductBySlug",
    ()=>getProductBySlug,
    "getProfile",
    ()=>getProfile,
    "getRecommendations",
    ()=>getRecommendations,
    "getSimilarItems",
    ()=>getSimilarItems,
    "googleLogin",
    ()=>googleLogin,
    "loginUser",
    ()=>loginUser,
    "logoutUser",
    ()=>logoutUser,
    "markNotificationsAsRead",
    ()=>markNotificationsAsRead,
    "placeBid",
    ()=>placeBid,
    "resendVerificationCode",
    ()=>resendVerificationCode,
    "resetPassword",
    ()=>resetPassword,
    "searchSemantic",
    ()=>searchSemantic,
    "sendChatMessage",
    ()=>sendChatMessage,
    "signUpUser",
    ()=>signUpUser,
    "toggleFavorite",
    ()=>toggleFavorite,
    "toggleOnlineStatus",
    ()=>toggleOnlineStatus,
    "updateBidStatus",
    ()=>updateBidStatus,
    "updateItem",
    ()=>updateItem,
    "updateProfile",
    ()=>updateProfile,
    "uploadChatImage",
    ()=>uploadChatImage,
    "verifyEmail",
    ()=>verifyEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: ("TURBOPACK compile-time value", "http://localhost:5000") || 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});
const BASE_URL = ("TURBOPACK compile-time value", "http://localhost:5000") || 'http://localhost:5000';
async function loginUser(identifier, password) {
    try {
        const response = await api.post('/auth/login', {
            identifier,
            password
        });
        return response.data; // axios automatically parses JSON
    } catch (error) {
        if (error.response) {
            // Backend returns errors in 'error' field, not 'message'
            const err = new Error(error.response.data.error || error.response.data.message || 'Login failed');
            err.response = error.response;
            throw err;
        } else {
            throw new Error(error.message || 'Login failed');
        }
    }
}
async function signUpUser(username, phone, password, email) {
    try {
        const response = await api.post('/auth/register', {
            username,
            phone,
            password,
            email
        });
        return response.data; // axios automatically parses JSON
    } catch (error) {
        if (error.response) {
            // Backend returns errors in 'error' field, not 'message'
            throw new Error(error.response.data.error || error.response.data.message || 'Registration failed');
        } else {
            throw new Error(error.message || 'Registration failed');
        }
    }
}
async function verifyEmail(email, code) {
    try {
        const response = await api.post('/auth/verify-email', {
            email,
            code
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Verification failed');
        } else {
            throw new Error(error.message || 'Verification failed');
        }
    }
}
async function resendVerificationCode(email) {
    try {
        const response = await api.post('/auth/resend-verification', {
            email
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to resend code');
        } else {
            throw new Error(error.message || 'Failed to resend code');
        }
    }
}
async function getProfile() {
    try {
        const response = await api.get('/user/profile');
        return response.data.data; // Controller returns { success: true, data: user }
    } catch (error) {
        if (error.response) {
            const err = new Error(error.response.data.message || 'Failed to fetch profile');
            err.status = error.response.status;
            throw err;
        } else {
            throw new Error(error.message || 'Failed to fetch profile');
        }
    }
}
async function updateProfile(data) {
    try {
        const response = await api.post('/user/editProfile', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to update profile');
        } else {
            throw new Error(error.message || 'Failed to update profile');
        }
    }
}
async function changePassword(oldPassword, newPassword) {
    try {
        const response = await api.put('/user/changePassword', {
            oldPassword,
            newPassword
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to change password');
        } else {
            throw new Error(error.message || 'Failed to change password');
        }
    }
}
async function getFavorites() {
    try {
        const response = await api.get('/user/favorites');
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to fetch favorites');
        } else {
            throw new Error(error.message || 'Failed to fetch favorites');
        }
    }
}
async function toggleFavorite(slug) {
    try {
        const response = await api.post(`/user/${slug}/favorite`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to update favorite');
        } else {
            throw new Error(error.message || 'Failed to update favorite');
        }
    }
}
async function getProductBySlug(slug) {
    try {
        const response = await api.get(`/item/${slug}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to fetch product');
        } else {
            throw new Error(error.message || 'Failed to fetch product');
        }
    }
}
async function addItem(data) {
    try {
        const response = await api.post('/item/additem', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to create item');
        } else {
            throw new Error(error.message || 'Failed to create item');
        }
    }
}
async function logoutUser() {
    try {
        await api.post('/auth/logout'); // Call backend logout to clear cookies and revoke tokens
        // Cookies are cleared by backend response headers
        // Small delay to ensure cookies are processed before redirect
        return {
            success: true
        };
    } catch (error) {
        // If logout fails (e.g., token expired), still try to clear cookies on client side
        // and redirect - user is effectively logged out anyway
        console.error('Logout error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
async function forgotPassword(email) {
    try {
        const response = await api.post('/auth/forgotpassword', {
            email
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to send reset email');
        } else {
            throw new Error(error.message || 'Failed to send reset email');
        }
    }
}
async function resetPassword(resetPasswordToken, newPassword) {
    try {
        const response = await api.put(`/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`, {
            newPassword
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to reset password');
        } else {
            throw new Error(error.message || 'Failed to reset password');
        }
    }
}
async function googleLogin(tokenOrCode, isCode = false) {
    try {
        const payload = isCode ? {
            code: tokenOrCode
        } : {
            idToken: tokenOrCode
        };
        const response = await api.post('/auth/google', payload);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Google login failed');
        } else {
            throw new Error(error.message || 'Google login failed');
        }
    }
}
async function facebookLogin(accessToken, userID) {
    try {
        const response = await api.post('/auth/facebook', {
            accessToken,
            userID
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Facebook login failed');
        } else {
            throw new Error(error.message || 'Facebook login failed');
        }
    }
}
async function completeOAuthRegistration(tempUserId, phone) {
    try {
        const response = await api.post('/auth/complete-oauth', {
            tempUserId,
            phone
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to complete registration');
        } else {
            throw new Error(error.message || 'Failed to complete registration');
        }
    }
}
// Request interceptor for adding auth token
api.interceptors.request.use((config)=>{
    try {
    // Token is now handled via HttpOnly cookies, so we don't need to manually attach it
    // from localStorage. The browser will automatically send the cookie.
    } catch (e) {
    // ignore
    }
    return config;
});
// Variables to handle multiple simultaneous 401s
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error)=>{
    failedQueue.forEach((prom)=>{
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};
// Response interceptor for handling errors
api.interceptors.response.use((response)=>response, async (error)=>{
    const originalRequest = error.config;
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
            // If already refreshing, wait for it to complete
            return new Promise((resolve, reject)=>{
                failedQueue.push({
                    resolve,
                    reject
                });
            }).then(()=>{
                return api(originalRequest);
            }).catch((err)=>{
                return Promise.reject(err);
            });
        }
        // Avoid infinite loops
        originalRequest._retry = true;
        isRefreshing = true;
        try {
            // Attempt to refresh token
            // We use a new axios instance or specific call to avoid interceptor loop if refresh fails
            await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${BASE_URL}/auth/refresh`, {}, {
                withCredentials: true
            });
            // If refresh successful, process the queue and retry original request
            processQueue(null);
            return api(originalRequest);
        } catch (refreshError) {
            // If refresh fails, it means session is truly expired
            // Avoid logging expected 400/401 errors to keep the Next.js dev overlay clean
            if (refreshError.response?.status !== 400 && refreshError.response?.status !== 401) {
                console.error('Token refresh failed:', refreshError);
            }
            processQueue(refreshError);
            // Reject with original error so components know it failed
            return Promise.reject(error);
        } finally{
            isRefreshing = false;
        }
    }
    return Promise.reject(error);
});
async function getAllItems() {
    try {
        const response = await api.get('/item/getAllItems');
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to fetch items');
        } else {
            throw new Error(error.message || 'Failed to fetch items');
        }
    }
}
async function getMyListings() {
    try {
        const response = await api.get('/item/getmyItems/all');
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to fetch your listings');
        } else {
            throw new Error(error.message || 'Failed to fetch your listings');
        }
    }
}
async function getEditItemData(slug) {
    try {
        const response = await api.get(`/item/editItem/${slug}`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to fetch item details');
        } else {
            throw new Error(error.message || 'Failed to fetch item details');
        }
    }
}
async function updateItem(slug, data) {
    try {
        const response = await api.put(`/item/${slug}/edit`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to update item');
        } else {
            throw new Error(error.message || 'Failed to update item');
        }
    }
}
async function searchSemantic(query) {
    try {
        console.log(`[API] searchSemantic called with query: "${query}"`);
        const response = await api.get(`/item/search/semantic?query=${encodeURIComponent(query)}`);
        console.log(`[API] searchSemantic success:`, {
            count: response.data?.data?.length || 0,
            firstItem: response.data?.data?.[0]?.title
        });
        return response.data;
    } catch (error) {
        console.error(`[API] searchSemantic failed:`, error.message);
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to perform semantic search');
        } else {
            throw new Error(error.message || 'Failed to perform semantic search');
        }
    }
}
async function getSimilarItems(slug) {
    try {
        const response = await api.get(`/item/${slug}/similar`);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to fetch similar items');
        } else {
            throw new Error(error.message || 'Failed to fetch similar items');
        }
    }
}
async function getRecommendations() {
    try {
        console.log(`[API] getRecommendations called`);
        const response = await api.get('/item/recommendations/all');
        console.log(`[API] getRecommendations success:`, {
            count: response.data?.data?.length || 0
        });
        return response.data;
    } catch (error) {
        console.error(`[API] getRecommendations failed:`, error.message);
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to fetch recommendations');
        } else {
            throw new Error(error.message || 'Failed to fetch recommendations');
        }
    }
}
async function chatWithAI(message, history = []) {
    try {
        const response = await api.post('/chat', {
            message,
            history
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to get AI response');
        } else {
            throw new Error(error.message || 'Failed to get AI response');
        }
    }
}
async function generateItemDescription(title, category, condition, price) {
    try {
        const response = await api.post('/describe', {
            title,
            category,
            condition,
            price
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to generate description');
        } else {
            throw new Error(error.message || 'Failed to generate description');
        }
    }
}
async function getConversations() {
    try {
        const response = await api.get('/chat-system/conversations');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch conversations');
    }
}
async function getMessages(conversationId) {
    try {
        const response = await api.get(`/chat-system/${conversationId}/messages`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch messages');
    }
}
async function sendChatMessage(receiverId, itemId, text, image, location) {
    try {
        const payload = {
            receiverId,
            itemId
        };
        if (text) payload.text = text;
        if (image) payload.image = image;
        if (location) payload.location = location;
        const response = await api.post('/chat-system/message', payload);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to send message');
    }
}
async function uploadChatImage(file) {
    try {
        const formData = new FormData();
        formData.append('image', file);
        const response = await api.post('/chat-system/uploadImage', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to upload chat image');
    }
}
async function toggleOnlineStatus(isOnlineVisible) {
    try {
        const response = await api.put('/user/toggleOnlineStatus', {
            isOnlineVisible
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update visibility settings');
    }
}
async function deleteChatMessage(messageId) {
    try {
        const response = await api.delete(`/chat-system/message/${messageId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete message');
    }
}
async function placeBid(itemId, amount) {
    try {
        const response = await api.post('/bid/place', {
            itemId,
            amount
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to place bid');
    }
}
async function getNotifications() {
    try {
        console.log("[api.ts] getNotifications() - Fetching notifications...");
        const response = await api.get('/notification/all');
        console.log("[api.ts] getNotifications() - Success:", {
            count: response.data?.data?.length || 0,
            success: response.data?.success
        });
        return response.data;
    } catch (error) {
        console.error("[api.ts] getNotifications() - Error:", error.message);
        const errorMessage = error.response?.data?.error || error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response.data : null) || error.message || 'Failed to fetch notifications';
        throw new Error(errorMessage);
    }
}
async function updateBidStatus(bidId, status) {
    try {
        const response = await api.post('/bid/status', {
            bidId,
            status
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to update bid status');
    }
}
async function markNotificationsAsRead() {
    try {
        const response = await api.post('/notification/read-all');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to mark notifications as read');
    }
}
const endpoints = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout'
    },
    products: {
        list: '/products',
        detail: (id)=>`/products/${id}`,
        create: '/products',
        update: (id)=>`/products/${id}`,
        delete: (id)=>`/products/${id}`
    }
};
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Dosro Bazar - Main/client/app/context/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/app/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/@react-oauth/google/dist/index.esm.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isBuyerMode, setIsBuyerModeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // Initialize mode from localStorage
            const savedMode = localStorage.getItem("isBuyerMode");
            if (savedMode !== null) {
                setIsBuyerModeState(JSON.parse(savedMode));
            }
            // Check for stored auth token and validate
            checkAuthStatus();
            // Clear local favorites on window close/refresh as requested
            const handleUnload = {
                "AuthProvider.useEffect.handleUnload": ()=>{
                    localStorage.removeItem("local_favorites");
                }
            }["AuthProvider.useEffect.handleUnload"];
            window.addEventListener('beforeunload', handleUnload);
            return ({
                "AuthProvider.useEffect": ()=>window.removeEventListener('beforeunload', handleUnload)
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], []);
    const setIsBuyerMode = (mode)=>{
        setIsBuyerModeState(mode);
        localStorage.setItem("isBuyerMode", JSON.stringify(mode));
    };
    const checkAuthStatus = async ()=>{
        try {
            // Try to fetch profile. If it succeeds, we are logged in (via cookie)
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProfile"])();
            setUser(userData);
            // Clear local favorites if user is logged in
            localStorage.removeItem("local_favorites");
        } catch (error) {
            // If 401, it just means user is not logged in, which is expected on initial load
            if (error.status !== 401 && error.response?.status !== 401) {
                console.error('Auth check failed:', error);
            }
            setUser(null);
        } finally{
            setLoading(false);
        }
    };
    const login = async (identifier, password)=>{
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loginUser"])(identifier, password);
            if (data.verificationRequired) {
                return {
                    success: false,
                    verificationRequired: true,
                    email: data.email,
                    message: data.message
                };
            }
            // Backend sets HttpOnly cookies automatically
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProfile"])();
            setUser(userData);
            // Clear local favorites on successful login
            localStorage.removeItem("local_favorites");
            return {
                success: true
            };
        } catch (error) {
            console.warn('Login failed:', error.message);
            // Check if it's the specific verification error/response if it came as an error (though we return 200 now)
            if (error.response?.data?.verificationRequired) {
                return {
                    success: false,
                    verificationRequired: true,
                    email: error.response.data.email,
                    message: error.response.data.message
                };
            }
            return {
                success: false,
                error: error.message
            };
        }
    };
    const register = async (username, phone, password, email)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signUpUser"])(username, phone, password, email);
            // Don't set user here - wait for verification
            return {
                success: true
            };
        } catch (error) {
            console.warn('Registration failed:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    };
    const verify = async (email, code)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["verifyEmail"])(email, code);
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProfile"])();
            setUser(userData);
            return {
                success: true
            };
        } catch (error) {
            console.warn('Verification failed:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    };
    const resendCode = async (email)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["resendVerificationCode"])(email);
            return {
                success: true
            };
        } catch (error) {
            console.warn('Resend code failed:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    };
    const loginWithGoogle = async (tokenOrCode, isCode = false)=>{
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["googleLogin"])(tokenOrCode, isCode);
            // Check if phone number is required
            if (response.requiresPhone) {
                return {
                    success: true,
                    requiresPhone: true,
                    tempUserId: response.tempUserId,
                    userData: response.userData
                };
            }
            // Normal login flow - phone already exists
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProfile"])();
            setUser(userData);
            return {
                success: true
            };
        } catch (error) {
            console.warn('Google login failed:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    };
    const completeOAuthWithPhone = async (tempUserId, phone)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["completeOAuthRegistration"])(tempUserId, phone);
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProfile"])();
            setUser(userData);
            return {
                success: true
            };
        } catch (error) {
            console.warn('OAuth completion failed:', error.message);
            throw error; // Re-throw to let the dialog handle the error
        }
    };
    const loginWithFacebook = async (accessToken, userID)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["facebookLogin"])(accessToken, userID);
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProfile"])();
            setUser(userData);
            return {
                success: true
            };
        } catch (error) {
            console.warn('Facebook login failed:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    };
    const logout = async ()=>{
        try {
            // Reset mode to Buyer (normal home)
            setIsBuyerMode(true);
            // Clear user state immediately for better UX
            setUser(null);
            // Call backend to revoke tokens and clear cookies
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logoutUser"])();
            // Redirect after a brief delay to ensure cookies are cleared and state updated
            setTimeout(()=>{
                window.location.href = '/';
            }, 100);
        } catch (error) {
            console.warn('Logout failed:', error.message);
            // Even if backend fails, clear local state and redirect
            setUser(null);
            setIsBuyerMode(true);
            setTimeout(()=>{
                window.location.href = '/';
            }, 100);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoogleOAuthProvider"], {
        clientId: ("TURBOPACK compile-time value", "897967608865-6u164i9eer47pj48oor5q46maf522pli.apps.googleusercontent.com") || '',
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
            value: {
                user,
                loading,
                login,
                logout,
                register,
                checkAuthStatus,
                setUser,
                loginWithGoogle,
                loginWithFacebook,
                completeOAuthWithPhone,
                verify,
                resendCode,
                isBuyerMode,
                setIsBuyerMode
            },
            children: children
        }, void 0, false, {
            fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/context/AuthContext.tsx",
            lineNumber: 220,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/context/AuthContext.tsx",
        lineNumber: 219,
        columnNumber: 9
    }, this);
}
_s(AuthProvider, "PcTeJZQFEEjP4UVEOhS4H20QteM=");
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Dosro Bazar - Main/client/app/components/theme-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
"use client";
;
;
function ThemeProvider({ children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/theme-provider.tsx",
        lineNumber: 10,
        columnNumber: 12
    }, this);
}
_c = ThemeProvider;
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Dosro Bazar - Main/client/app/components/theme-sync.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeSync",
    ()=>ThemeSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/app/context/AuthContext.tsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ThemeSync() {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const hasSyncedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const lastUserIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeSync.useEffect": ()=>{
            // Only sync theme when:
            // 1. User data is first loaded (hasSyncedRef is false)
            // 2. A different user logs in (userId changed)
            // This prevents overriding manual theme changes during the same session
            if (user?.theme && user?._id) {
                const currentUserId = user._id.toString();
                // If this is a new user or first time syncing, apply their theme preference
                if (!hasSyncedRef.current || lastUserIdRef.current !== currentUserId) {
                    setTheme(user.theme);
                    hasSyncedRef.current = true;
                    lastUserIdRef.current = currentUserId;
                }
            } else if (!user) {
                // User logged out - reset sync flag
                hasSyncedRef.current = false;
                lastUserIdRef.current = null;
            }
        }
    }["ThemeSync.useEffect"], [
        user?._id,
        user?.theme,
        setTheme
    ]);
    return null // This component doesn't render anything
    ;
}
_s(ThemeSync, "yl6dhvEtOlYg2QaXa1nP+P6n5/Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = ThemeSync;
var _c;
__turbopack_context__.k.register(_c, "ThemeSync");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Dosro Bazar - Main/client/app/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Dosro Bazar - Main/client/app/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/app/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10"
        }
    },
    defaultVariants: {
        variant: "default",
        size: "default"
    }
});
const Button = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](_c = ({ className, variant, size, asChild = false, ...props }, ref)=>{
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : "button";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/ui/button.tsx",
        lineNumber: 42,
        columnNumber: 12
    }, ("TURBOPACK compile-time value", void 0));
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Chatbot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/bot.js [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/app/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/app/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/app/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/app/context/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/react-markdown/lib/index.js [app-client] (ecmascript) <export Markdown as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/Dosro Bazar - Main/client/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
const PROMPT_LIMIT = 30;
const STORAGE_KEY = (userId)=>`remarket_chat_history_${userId}`;
_c = STORAGE_KEY;
const getInitialMessage = (name)=>({
        role: "bot",
        content: name ? `Hello ${name}! I'm your Dosro Bazar assistant. How can I help you today?` : "Hello! I'm your Dosro Bazar assistant. How can I help you today?"
    });
function Chatbot() {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        getInitialMessage(user?.username)
    ]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [promptCount, setPromptCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const scrollRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // Load history from localStorage when user logs in
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Chatbot.useEffect": ()=>{
            if (!user) return;
            const key = STORAGE_KEY(user.id);
            try {
                const saved = localStorage.getItem(key);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    setMessages(parsed.messages);
                    setPromptCount(parsed.count);
                } else {
                    setMessages([
                        getInitialMessage(user.username)
                    ]);
                    setPromptCount(0);
                }
            } catch  {
                setMessages([
                    getInitialMessage(user.username)
                ]);
                setPromptCount(0);
            }
        }
    }["Chatbot.useEffect"], [
        user
    ]);
    // Clear history when user logs out
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Chatbot.useEffect": ()=>{
            if (!user) {
                setMessages([
                    getInitialMessage()
                ]);
                setPromptCount(0);
                setIsOpen(false);
            }
        }
    }["Chatbot.useEffect"], [
        user
    ]);
    // Save to localStorage whenever messages or count change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Chatbot.useEffect": ()=>{
            if (!user) return;
            const key = STORAGE_KEY(user.id);
            try {
                localStorage.setItem(key, JSON.stringify({
                    messages,
                    count: promptCount
                }));
            } catch  {
            // Storage quota exceeded or unavailable — fail silently
            }
        }
    }["Chatbot.useEffect"], [
        messages,
        promptCount,
        user
    ]);
    // Auto-scroll on new messages
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Chatbot.useEffect": ()=>{
            if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
        }
    }["Chatbot.useEffect"], [
        messages
    ]);
    // Don't render for unauthenticated users, or inside the Admin portal
    if (!user || pathname?.startsWith("/admin")) return null;
    const clearHistory = ()=>{
        if (user) {
            localStorage.removeItem(STORAGE_KEY(user.id));
        }
        setMessages([
            getInitialMessage(user?.username)
        ]);
        setPromptCount(0);
    };
    const handleSendMessage = async ()=>{
        if (!input.trim() || isLoading) return;
        const userMessage = input.trim();
        setInput("");
        // Check limit before sending
        const newCount = promptCount + 1;
        if (newCount > PROMPT_LIMIT) {
            setMessages((prev)=>[
                    ...prev,
                    {
                        role: "user",
                        content: userMessage
                    },
                    {
                        role: "system",
                        content: `You've reached the ${PROMPT_LIMIT}-message limit. Starting a fresh conversation.`
                    }
                ]);
            // Brief delay so user can see the notice, then reset
            setTimeout(()=>clearHistory(), 1500);
            return;
        }
        setPromptCount(newCount);
        setMessages((prev)=>[
                ...prev,
                {
                    role: "user",
                    content: userMessage
                }
            ]);
        setIsLoading(true);
        // Build history for backend (all prior turns except initial greeting and system messages)
        const history = messages.filter((m)=>m.role !== "system").slice(1) // skip initial greeting
        .map((m)=>({
                role: m.role === "bot" ? "assistant" : "user",
                content: m.content
            }));
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["chatWithAI"])(userMessage, history);
            if (response.success) {
                setMessages((prev)=>[
                        ...prev,
                        {
                            role: "bot",
                            content: response.data
                        }
                    ]);
            } else {
                setMessages((prev)=>[
                        ...prev,
                        {
                            role: "bot",
                            content: "Sorry, I encountered an error. Please try again."
                        }
                    ]);
            }
        } catch  {
            setMessages((prev)=>[
                    ...prev,
                    {
                        role: "bot",
                        content: "Sorry, I'm having trouble connecting right now."
                    }
                ]);
        } finally{
            setIsLoading(false);
        }
    };
    const remainingPrompts = PROMPT_LIMIT - promptCount;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed bottom-6 right-6 z-50 flex flex-col items-end",
        children: [
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 w-[350px] md:w-[400px] h-[500px] bg-background/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 bg-primary text-primary-foreground flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 rounded-full bg-white/20 flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                            size: 20
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                            lineNumber: 161,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                        lineNumber: 160,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-sm",
                                                children: "Dosro Bazar Assistant"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                                lineNumber: 164,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] opacity-80",
                                                children: remainingPrompts <= 5 ? `${remainingPrompts} message${remainingPrompts !== 1 ? "s" : ""} remaining` : "Online & ready to help"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                                lineNumber: 165,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                        lineNumber: 163,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                lineNumber: 159,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "icon",
                                className: "text-primary-foreground hover:bg-white/10 h-8 w-8",
                                onClick: ()=>setIsOpen(false),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                    lineNumber: 178,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                lineNumber: 172,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                        lineNumber: 158,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: scrollRef,
                        className: "flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/20",
                        children: [
                            messages.map((msg, i)=>{
                                if (msg.role === "system") {
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 justify-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                                size: 14,
                                                className: "text-amber-500 shrink-0"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                                lineNumber: 191,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[11px] text-center text-muted-foreground italic",
                                                children: msg.content
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                                lineNumber: 192,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                        lineNumber: 190,
                                        columnNumber: 19
                                    }, this);
                                }
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex gap-2 max-w-[85%]", msg.role === "user" ? "ml-auto flex-row-reverse" : ""),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1", msg.role === "user" ? "bg-secondary" : "bg-primary/10 text-primary"),
                                            children: msg.role === "user" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                size: 14
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                                lineNumber: 214,
                                                columnNumber: 44
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                                size: 14
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                                lineNumber: 214,
                                                columnNumber: 65
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                            lineNumber: 206,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-3 rounded-2xl text-sm shadow-sm", msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted text-foreground rounded-tl-none prose prose-sm dark:prose-invert max-w-none break-words"),
                                            children: msg.role === "bot" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                                                children: msg.content
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                                lineNumber: 225,
                                                columnNumber: 23
                                            }, this) : msg.content
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                            lineNumber: 216,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                    lineNumber: 199,
                                    columnNumber: 17
                                }, this);
                            }),
                            isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 max-w-[85%]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                            lineNumber: 236,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                        lineNumber: 235,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-muted p-3 rounded-2xl rounded-tl-none text-sm",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                                    lineNumber: 240,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce [animation-delay:0.2s]"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                                    lineNumber: 241,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce [animation-delay:0.4s]"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                                    lineNumber: 242,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                            lineNumber: 239,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                        lineNumber: 238,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                lineNumber: 234,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                        lineNumber: 183,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 border-t border-border bg-background/50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: input,
                                        onChange: (e)=>setInput(e.target.value),
                                        onKeyDown: (e)=>e.key === "Enter" && handleSendMessage(),
                                        placeholder: "Ask me anything...",
                                        className: "flex-1 bg-muted border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                        lineNumber: 252,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        size: "icon",
                                        className: "rounded-full h-9 w-9 shrink-0",
                                        onClick: handleSendMessage,
                                        disabled: isLoading || !input.trim(),
                                        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                            className: "animate-spin",
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                            lineNumber: 267,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                            size: 18
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                            lineNumber: 269,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                        lineNumber: 260,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                lineNumber: 251,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[10px] text-center text-muted-foreground mt-2",
                                children: [
                                    "Powered by Dosro Bazar AI · ",
                                    promptCount,
                                    "/",
                                    PROMPT_LIMIT,
                                    " messages used"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                                lineNumber: 273,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                        lineNumber: 250,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                lineNumber: 156,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                size: "icon",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110", isOpen ? "rotate-90 bg-muted text-foreground hover:bg-muted" : "bg-primary text-primary-foreground"),
                onClick: ()=>setIsOpen(!isOpen),
                children: isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                    size: 28
                }, void 0, false, {
                    fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                    lineNumber: 291,
                    columnNumber: 19
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                    size: 28
                }, void 0, false, {
                    fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                    lineNumber: 291,
                    columnNumber: 37
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
                lineNumber: 281,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/Dosro Bazar - Main/client/app/components/Chatbot.tsx",
        lineNumber: 153,
        columnNumber: 5
    }, this);
}
_s(Chatbot, "7jUcWnUK0jqREyswvai0tdVDUvI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$Dosro__Bazar__$2d$__Main$2f$client$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c1 = Chatbot;
var _c, _c1;
__turbopack_context__.k.register(_c, "STORAGE_KEY");
__turbopack_context__.k.register(_c1, "Chatbot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_Dosro%20Bazar%20-%20Main_client_app_20b71b1c._.js.map
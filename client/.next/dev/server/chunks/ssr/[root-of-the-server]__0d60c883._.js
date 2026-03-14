module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/Desktop/remarket-hub-main/client/app/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
    "endpoints",
    ()=>endpoints,
    "facebookLogin",
    ()=>facebookLogin,
    "forgotPassword",
    ()=>forgotPassword,
    "getAllItems",
    ()=>getAllItems,
    "getEditItemData",
    ()=>getEditItemData,
    "getFavorites",
    ()=>getFavorites,
    "getMyListings",
    ()=>getMyListings,
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
    "resendVerificationCode",
    ()=>resendVerificationCode,
    "resetPassword",
    ()=>resetPassword,
    "searchSemantic",
    ()=>searchSemantic,
    "signUpUser",
    ()=>signUpUser,
    "toggleFavorite",
    ()=>toggleFavorite,
    "updateItem",
    ()=>updateItem,
    "updateProfile",
    ()=>updateProfile,
    "verifyEmail",
    ()=>verifyEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/client/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: ("TURBOPACK compile-time value", "http://localhost:5000"),
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
            await __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].post(`${BASE_URL}/auth/refresh`, {}, {
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
        const response = await api.get(`/item/search/semantic?query=${encodeURIComponent(query)}`);
        return response.data;
    } catch (error) {
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
        const response = await api.get('/item/recommendations/all');
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Failed to fetch recommendations');
        } else {
            throw new Error(error.message || 'Failed to fetch recommendations');
        }
    }
}
async function chatWithAI(message) {
    try {
        const response = await api.post('/chat', {
            message
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
}),
"[project]/Desktop/remarket-hub-main/client/app/context/AuthContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/client/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/client/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/client/app/lib/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/client/node_modules/@react-oauth/google/dist/index.esm.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isBuyerMode, setIsBuyerModeState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Initialize mode from localStorage
        const savedMode = localStorage.getItem("isBuyerMode");
        if (savedMode !== null) {
            setIsBuyerModeState(JSON.parse(savedMode));
        }
        // Check for stored auth token and validate
        checkAuthStatus();
    }, []);
    const setIsBuyerMode = (mode)=>{
        setIsBuyerModeState(mode);
        localStorage.setItem("isBuyerMode", JSON.stringify(mode));
    };
    const checkAuthStatus = async ()=>{
        try {
            // Try to fetch profile. If it succeeds, we are logged in (via cookie)
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProfile"])();
            setUser(userData);
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
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loginUser"])(identifier, password);
            if (data.verificationRequired) {
                return {
                    success: false,
                    verificationRequired: true,
                    email: data.email,
                    message: data.message
                };
            }
            // Backend sets HttpOnly cookies automatically
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProfile"])();
            setUser(userData);
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
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signUpUser"])(username, phone, password, email);
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
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["verifyEmail"])(email, code);
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProfile"])();
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
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["resendVerificationCode"])(email);
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
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["googleLogin"])(tokenOrCode, isCode);
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
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProfile"])();
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
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["completeOAuthRegistration"])(tempUserId, phone);
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProfile"])();
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
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["facebookLogin"])(accessToken, userID);
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProfile"])();
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
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logoutUser"])();
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GoogleOAuthProvider"], {
        clientId: ("TURBOPACK compile-time value", "897967608865-6u164i9eer47pj48oor5q46maf522pli.apps.googleusercontent.com") || '',
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
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
            fileName: "[project]/Desktop/remarket-hub-main/client/app/context/AuthContext.tsx",
            lineNumber: 209,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/client/app/context/AuthContext.tsx",
        lineNumber: 208,
        columnNumber: 9
    }, this);
}
const useAuth = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
}),
"[project]/Desktop/remarket-hub-main/client/app/components/theme-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/client/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/client/node_modules/next-themes/dist/index.mjs [app-ssr] (ecmascript)");
"use client";
;
;
function ThemeProvider({ children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/client/app/components/theme-provider.tsx",
        lineNumber: 10,
        columnNumber: 12
    }, this);
}
}),
"[project]/Desktop/remarket-hub-main/client/app/components/theme-sync.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeSync",
    ()=>ThemeSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/client/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/client/node_modules/next-themes/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/client/app/context/AuthContext.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
function ThemeSync() {
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$app$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const { setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTheme"])();
    const hasSyncedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const lastUserIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
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
    }, [
        user?._id,
        user?.theme,
        setTheme
    ]);
    return null // This component doesn't render anything
    ;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0d60c883._.js.map
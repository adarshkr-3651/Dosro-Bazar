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
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addItem",
    ()=>addItem,
    "appleLogin",
    ()=>appleLogin,
    "default",
    ()=>__TURBOPACK__default__export__,
    "endpoints",
    ()=>endpoints,
    "forgotPassword",
    ()=>forgotPassword,
    "getProfile",
    ()=>getProfile,
    "googleLogin",
    ()=>googleLogin,
    "loginUser",
    ()=>loginUser,
    "logoutUser",
    ()=>logoutUser,
    "resetPassword",
    ()=>resetPassword,
    "signUpUser",
    ()=>signUpUser,
    "updateProfile",
    ()=>updateProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: ("TURBOPACK compile-time value", "http://localhost:5000"),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});
const BASE_URL = ("TURBOPACK compile-time value", "http://localhost:5000") || 'http://localhost:5000';
async function loginUser(email, password) {
    try {
        const response = await api.post('/auth/login', {
            email,
            password
        });
        return response.data; // axios automatically parses JSON
    } catch (error) {
        if (error.response) {
            // Backend returns errors in 'error' field, not 'message'
            throw new Error(error.response.data.error || error.response.data.message || 'Login failed');
        } else {
            throw new Error(error.message || 'Login failed');
        }
    }
}
async function signUpUser(username, email, password) {
    try {
        const response = await api.post('/auth/register', {
            username,
            email,
            password
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
        await api.post('/auth/logout'); // Call backend logout to clear cookies
        window.location.href = '/';
    } catch (error) {
        // Even if backend fails, clear local state
        // Even if backend fails, redirect to home
        window.location.href = '/';
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
async function googleLogin(idToken) {
    try {
        const response = await api.post('/auth/google', {
            idToken
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Google login failed');
        } else {
            throw new Error(error.message || 'Google login failed');
        }
    }
}
async function appleLogin(data) {
    try {
        const response = await api.post('/auth/apple', data);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || error.response.data.message || 'Apple login failed');
        } else {
            throw new Error(error.message || 'Apple login failed');
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
// Response interceptor for handling errors
api.interceptors.response.use((response)=>response, async (error)=>{
    if (error.response?.status === 401) {
        if (("TURBOPACK compile-time value", "undefined") !== 'undefined') {
        // We do NOT redirect to login automatically anymore.
        // This allows the app to handle "not logged in" state gracefully (e.g. guest mode)
        // without kicking the user out of public pages.
        }
    }
    return Promise.reject(error);
});
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
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/context/AuthContext.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/lib/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/@react-oauth/google/dist/index.esm.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])();
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Check for stored auth token and validate
        checkAuthStatus();
    }, []);
    const checkAuthStatus = async ()=>{
        try {
            // Try to fetch profile. If it succeeds, we are logged in (via cookie)
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProfile"])();
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
    const login = async (email, password)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loginUser"])(email, password);
            // Backend sets HttpOnly cookies automatically
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProfile"])();
            setUser(userData);
            return {
                success: true
            };
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    };
    const register = async (username, email, password)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signUpUser"])(username, email, password);
            // Backend sets HttpOnly cookies automatically
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProfile"])();
            setUser(userData);
            return {
                success: true
            };
        } catch (error) {
            console.error('Registration failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    };
    const loginWithGoogle = async (idToken)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["googleLogin"])(idToken);
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProfile"])();
            setUser(userData);
            return {
                success: true
            };
        } catch (error) {
            console.error('Google login failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    };
    const loginWithApple = async (data)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["appleLogin"])(data);
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getProfile"])();
            setUser(userData);
            return {
                success: true
            };
        } catch (error) {
            console.error('Apple login failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    };
    const logout = async ()=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logoutUser"])();
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
            setUser(null);
            window.location.href = '/';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GoogleOAuthProvider"], {
        clientId: ("TURBOPACK compile-time value", "your_google_client_id_here") || '',
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
            value: {
                user,
                loading,
                login,
                logout,
                register,
                checkAuthStatus,
                loginWithGoogle,
                loginWithApple
            },
            children: children
        }, void 0, false, {
            fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/context/AuthContext.jsx",
            lineNumber: 96,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/context/AuthContext.jsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
const useAuth = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__52df5276._.js.map
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const api = __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
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
        if (("TURBOPACK compile-time value", "object") !== 'undefined') {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/context/AuthContext.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/@react-oauth/google/dist/index.esm.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])();
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // Check for stored auth token and validate
            checkAuthStatus();
        }
    }["AuthProvider.useEffect"], []);
    const checkAuthStatus = async ()=>{
        try {
            // Try to fetch profile. If it succeeds, we are logged in (via cookie)
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProfile"])();
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
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loginUser"])(email, password);
            // Backend sets HttpOnly cookies automatically
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProfile"])();
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
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signUpUser"])(username, email, password);
            // Backend sets HttpOnly cookies automatically
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProfile"])();
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
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["googleLogin"])(idToken);
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProfile"])();
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
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["appleLogin"])(data);
            const userData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProfile"])();
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
            // Clear user state immediately for better UX
            setUser(null);
            // Call backend to revoke tokens and clear cookies
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logoutUser"])();
            // Redirect after a brief delay to ensure cookies are cleared
            setTimeout(()=>{
                window.location.href = '/';
            }, 100);
        } catch (error) {
            console.error('Logout failed:', error);
            // Even if backend fails, clear local state and redirect
            setUser(null);
            setTimeout(()=>{
                window.location.href = '/';
            }, 100);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f40$react$2d$oauth$2f$google$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoogleOAuthProvider"], {
        clientId: ("TURBOPACK compile-time value", "897967608865-v5blm2hljpf50972i3osmgsvk15bcbqu.apps.googleusercontent.com") || '',
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
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
            lineNumber: 105,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/context/AuthContext.jsx",
        lineNumber: 104,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "NiO5z6JIqzX62LS5UWDgIqbZYyY=");
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
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
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/theme-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
"use client";
;
;
function ThemeProvider({ children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/theme-provider.tsx",
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
"[project]/Desktop/remarket-hub-main/remarket-hub-main/app/components/theme-sync.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeSync",
    ()=>ThemeSync
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/node_modules/next-themes/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$context$2f$AuthContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/remarket-hub-main/remarket-hub-main/app/context/AuthContext.jsx [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function ThemeSync() {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$context$2f$AuthContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { setTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const hasSyncedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const lastUserIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
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
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$app$2f$context$2f$AuthContext$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$remarket$2d$hub$2d$main$2f$remarket$2d$hub$2d$main$2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = ThemeSync;
var _c;
__turbopack_context__.k.register(_c, "ThemeSync");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Desktop_remarket-hub-main_remarket-hub-main_app_473fa799._.js.map
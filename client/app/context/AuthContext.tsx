'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, signUpUser, logoutUser, getProfile, googleLogin, facebookLogin, completeOAuthRegistration, verifyEmail, resendVerificationCode } from '../lib/api';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface User {
    id: string;
    username: string;
    email?: string;
    phone?: string;
    role: string;
    profilePicture?: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string; verificationRequired?: boolean; email?: string; message?: string }>;
    logout: () => Promise<void>;
    register: (username: string, phone: string, password: string, email?: string) => Promise<{ success: boolean; error?: string }>;
    checkAuthStatus: () => Promise<void>;
    setUser: (user: User | null) => void;
    loginWithGoogle: (tokenOrCode: string, isCode?: boolean) => Promise<{ success: boolean; requiresPhone?: boolean; tempUserId?: string; userData?: any; error?: string }>;
    loginWithFacebook: (accessToken: string, userID: string) => Promise<{ success: boolean; error?: string }>;
    completeOAuthWithPhone: (tempUserId: string, phone: string) => Promise<{ success: boolean }>;
    verify: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
    resendCode: (email: string) => Promise<{ success: boolean; error?: string }>;
    isBuyerMode: boolean;
    setIsBuyerMode: (isBuyer: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isBuyerMode, setIsBuyerModeState] = useState(true);

    useEffect(() => {
        // Initialize mode from localStorage
        const savedMode = localStorage.getItem("isBuyerMode");
        if (savedMode !== null) {
            setIsBuyerModeState(JSON.parse(savedMode));
        }
        // Check for stored auth token and validate
        checkAuthStatus();

        // Clear local favorites on window close/refresh as requested
        const handleUnload = () => {
            localStorage.removeItem("local_favorites");
        };
        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, []);

    const setIsBuyerMode = (mode: boolean) => {
        setIsBuyerModeState(mode);
        localStorage.setItem("isBuyerMode", JSON.stringify(mode));
    };

    const checkAuthStatus = async () => {
        try {
            // Try to fetch profile. If it succeeds, we are logged in (via cookie)
            const userData = await getProfile();
            setUser(userData);
            // Clear local favorites if user is logged in
            localStorage.removeItem("local_favorites");
        } catch (error: any) {
            // If 401, it just means user is not logged in, which is expected on initial load
            if (error.status !== 401 && error.response?.status !== 401) {
                console.error('Auth check failed:', error);
            }
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (identifier: string, password: string) => {
        try {
            const data = await loginUser(identifier, password);

            if (data.verificationRequired) {
                return {
                    success: false,
                    verificationRequired: true,
                    email: data.email,
                    message: data.message
                };
            }

            // Backend sets HttpOnly cookies automatically
            if (data.user) {
                // Use user data returned directly from login for immediate state update
                setUser(data.user);
            } else {
                // Fallback: Fetch profile after login if not returned
                const userData = await getProfile();
                setUser(userData);
            }
            // Clear local favorites on successful login
            localStorage.removeItem("local_favorites");
            return { success: true };
        } catch (error: any) {
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
            return { success: false, error: error.message };
        }
    };

    const register = async (username: string, phone: string, password: string, email?: string) => {
        try {
            await signUpUser(username, phone, password, email);
            // Don't set user here - wait for verification
            return { success: true };
        } catch (error: any) {
            console.warn('Registration failed:', error.message);
            return { success: false, error: error.message };
        }
    };

    const verify = async (email: string, code: string) => {
        try {
            await verifyEmail(email, code);
            const userData = await getProfile();
            setUser(userData);
            return { success: true };
        } catch (error: any) {
            console.warn('Verification failed:', error.message);
            return { success: false, error: error.message };
        }
    };

    const resendCode = async (email: string) => {
        try {
            await resendVerificationCode(email);
            return { success: true };
        } catch (error: any) {
            console.warn('Resend code failed:', error.message);
            return { success: false, error: error.message };
        }
    };

    const loginWithGoogle = async (tokenOrCode: string, isCode = false) => {
        try {
            const response = await googleLogin(tokenOrCode, isCode);

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
            if (response.user) {
                // Use user data returned directly from google login for immediate state update
                setUser(response.user);
            } else {
                // Fallback: Fetch profile after login if not returned
                const userData = await getProfile();
                setUser(userData);
            }
            return { success: true };
        } catch (error: any) {
            console.warn('Google login failed:', error.message);
            return { success: false, error: error.message };
        }
    };

    const completeOAuthWithPhone = async (tempUserId: string, phone: string) => {
        try {
            const data = await completeOAuthRegistration(tempUserId, phone);
            if (data.user) {
                setUser(data.user);
            } else {
                const userData = await getProfile();
                setUser(userData);
            }
            return { success: true };
        } catch (error: any) {
            console.warn('OAuth completion failed:', error.message);
            throw error; // Re-throw to let the dialog handle the error
        }
    };

    const loginWithFacebook = async (accessToken: string, userID: string) => {
        try {
            const data = await facebookLogin(accessToken, userID);
            if (data.user) {
                setUser(data.user);
            } else {
                const userData = await getProfile();
                setUser(userData);
            }
            return { success: true };
        } catch (error: any) {
            console.warn('Facebook login failed:', error.message);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            // Reset mode to Buyer (normal home)
            setIsBuyerMode(true);
            // Clear user state immediately for better UX
            setUser(null);
            // Call backend to revoke tokens and clear cookies
            await logoutUser();
            // Redirect after a brief delay to ensure cookies are cleared and state updated
            setTimeout(() => {
                window.location.href = '/';
            }, 100);
        } catch (error: any) {
            console.warn('Logout failed:', error.message);
            // Even if backend fails, clear local state and redirect
            setUser(null);
            setIsBuyerMode(true);
            setTimeout(() => {
                window.location.href = '/';
            }, 100);
        }
    };

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
            <AuthContext.Provider value={{ user, loading, login, logout, register, checkAuthStatus, setUser, loginWithGoogle, loginWithFacebook, completeOAuthWithPhone, verify, resendCode, isBuyerMode, setIsBuyerMode }}>
                {children}
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

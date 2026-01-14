'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signUpUser, logoutUser, getProfile, googleLogin, facebookLogin, completeOAuthRegistration } from '../lib/api';
import { GoogleOAuthProvider } from '@react-oauth/google';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token and validate
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Try to fetch profile. If it succeeds, we are logged in (via cookie)
      const userData = await getProfile();
      setUser(userData);
    } catch (error) {
      // If 401, it just means user is not logged in, which is expected on initial load
      if (error.status !== 401 && error.response?.status !== 401) {
        console.error('Auth check failed:', error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier, password) => {
    try {
      await loginUser(identifier, password);
      // Backend sets HttpOnly cookies automatically
      const userData = await getProfile();
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  };
  //Register function
  const register = async (username, phone, password, email) => {
    try {
      await signUpUser(username, phone, password, email);
      // Backend sets HttpOnly cookies automatically
      const userData = await getProfile();
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message };
    }
  };

  // Google OAuth login function
  const loginWithGoogle = async (tokenOrCode, isCode = false) => {
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
      const userData = await getProfile();
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Google login failed:', error);
      return { success: false, error: error.message };
    }
  };

  const completeOAuthWithPhone = async (tempUserId, phone) => {
    try {
      await completeOAuthRegistration(tempUserId, phone);
      const userData = await getProfile();
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('OAuth completion failed:', error);
      throw error; // Re-throw to let the dialog handle the error
    }
  };

  const loginWithFacebook = async (accessToken, userID) => {
    try {
      await facebookLogin(accessToken, userID);
      const userData = await getProfile();
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Facebook login failed:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      // Clear user state immediately for better UX
      setUser(null);
      // Call backend to revoke tokens and clear cookies
      await logoutUser();
      // Redirect after a brief delay to ensure cookies are cleared
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if backend fails, clear local state and redirect
      setUser(null);
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <AuthContext.Provider value={{ user, loading, login, logout, register, checkAuthStatus, loginWithGoogle, loginWithFacebook, completeOAuthWithPhone }}>
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

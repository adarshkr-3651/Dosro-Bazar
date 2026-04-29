"use client";
import React, { JSX, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import ErrorMessage from '../shared/ErrorMessage';
import VerifyEmailOverlay from './VerifyEmailOverlay';
import ForgotPasswordOverlay from './ForgotPasswordOverlay';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Image from "next/image";
import logo from "../../../public/logo.png";

interface AuthPageProps {
  initialMode: 'signIn' | 'signUp';
}

export default function AuthPage({ initialMode }: AuthPageProps): JSX.Element {
  const router = useRouter();
  const pathname = usePathname();
  const { user, login, register, loginWithGoogle, loginWithFacebook, verifyLogin } = useAuth();

  const [isSignUp, setIsSignUp] = useState(initialMode === 'signUp');
  const [showPassword, setShowPassword] = useState(false);

  const handleToggleMode = (toSignUp: boolean) => {
    setIsSignUp(toSignUp);
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [identifierWarning, setIdentifierWarning] = useState<string | null>(null);
  const [otpRequired, setOtpRequired] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [isVerifyOverlayOpen, setIsVerifyOverlayOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');


  // SignUp State
  const [signUpData, setSignUpData] = useState({
    username: '',
    phone: '',
    password: '',
    email: ''
  });
  const [phoneWarning, setPhoneWarning] = useState<string | null>(null);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);

  // Social Auth State
  const [fbReady, setFbReady] = useState(false);

  // Handle URL sync
  useEffect(() => {
    if (isSignUp && pathname !== '/signUp') {
      window.history.pushState(null, '', '/signUp');
    } else if (!isSignUp && pathname !== '/login') {
      window.history.pushState(null, '', '/login');
    }
  }, [isSignUp, pathname]);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Load saved identifier on mount
  useEffect(() => {
    const savedIdentifier = localStorage.getItem('rememberedIdentifier');
    const wasRemembered = localStorage.getItem('rememberMe') === 'true';

    if (wasRemembered && savedIdentifier) {
      setLoginIdentifier(savedIdentifier);
      setRememberMe(true);
    }
  }, []);

  // Validation Logics
  const validateIdentifier = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

    if (value && !emailRegex.test(value) && !phoneRegex.test(value)) {
      setIdentifierWarning('Please enter a valid email or phone number');
    } else {
      setIdentifierWarning(null);
    }
  };

  const validatePhone = (value: string) => {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    if (value && !phoneRegex.test(value)) {
      setPhoneWarning('Please enter a valid phone number');
    } else {
      setPhoneWarning(null);
    }
  };

  const validateEmail = (value: string) => {
    if (!value) {
      setEmailWarning(null);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailWarning('Please enter a valid email address');
    } else {
      setEmailWarning(null);
    }
  };

  // Handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If OTP is required, redirect form submission to handleOtpSubmit
    if (otpRequired) {
      return handleOtpSubmit(e);
    }

    setError(null);
    setSuccessMessage(null);

    if (!loginIdentifier || !loginPassword) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const result = await login(loginIdentifier, loginPassword);
      
      if (result.otpRequired) {
        setOtpRequired(true);
        setOtpEmail(result.email || '');
        setSuccessMessage(result.message || 'OTP code sent to your email');
        return;
      }

      if (result.verificationRequired) {
        setVerifyEmail(result.email || loginIdentifier);
        setIsVerifyOverlayOpen(true);
        return;
      }

      if (result.success) {
        if (rememberMe) {
          localStorage.setItem('rememberedIdentifier', loginIdentifier);
          localStorage.setItem('rememberMe', 'true');
        } else {
          localStorage.removeItem('rememberedIdentifier');
          localStorage.removeItem('rememberMe');
        }

        setSuccessMessage('Login successful! Redirecting...');
        setTimeout(() => router.push('/'), 1000);
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.MouseEvent | React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!otpValue || otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyLogin(otpEmail, otpValue);
      if (result.success) {
        setSuccessMessage('OTP verified! Login successful.');
        setTimeout(() => router.push('/'), 1000);
      } else {
        setError(result.error || 'OTP verification failed');
      }
    } catch (err: any) {
      setError(err?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!signUpData.username || !signUpData.phone || !signUpData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (signUpData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const result = await register(
        signUpData.username,
        signUpData.phone,
        signUpData.password,
        signUpData.email || undefined
      );

      if (result.success) {
        if (result.verificationRequired) {
          setVerifyEmail(result.email || signUpData.email);
          setIsVerifyOverlayOpen(true);
          return;
        }

        setSuccessMessage('Account created successfully! Redirecting...');
        setTimeout(() => router.push('/'), 1500);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Facebook SDK Logic
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fbAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
      if (!fbAppId || fbAppId === 'your_facebook_app_id_here') return;

      // If SDK is already loaded, just mark as ready
      if ((window as any).FB) {
        setFbReady(true);
        return;
      }

      (window as any).fbAsyncInit = function () {
        if (!(window as any).FB._initialized) {
          (window as any).FB.init({
            appId: fbAppId,
            cookie: true,
            xfbml: true,
            version: 'v18.0'
          });
          (window as any).FB._initialized = true;
        }
        setFbReady(true);
      };

      (function (d, s, id) {
        var js: any, fjs: any = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }
  }, []);

  const handleFacebookLogin = () => {
    if (!fbReady) {
      setError('Facebook SDK is still loading...');
      return;
    }

    (window as any).FB.login((response: any) => {
      if (response.authResponse) {
        setLoading(true);
        loginWithFacebook(response.authResponse.accessToken, response.authResponse.userID)
          .then((result) => {
            if (result.success) {
              setSuccessMessage('Login successful! Redirecting...');
              setTimeout(() => router.push('/'), 1000);
            } else {
              setError(result.error || 'Facebook login failed');
            }
          })
          .catch((err) => setError(err?.message || 'Facebook login failed'))
          .finally(() => setLoading(false));
      } else {
        console.error('Facebook login failed or cancelled:', response);
        setError('Facebook login was cancelled or failed to initialize.');
      }
    }, { scope: 'email' });
  };

  // Custom Google Login Implementation
  const loginWithGoogleCustom = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError(null);
      try {
        const result = await loginWithGoogle(tokenResponse.code, true);
        if (result.success) {
          setSuccessMessage('Auth successful! Redirecting...');
          setTimeout(() => router.push('/'), 1000);
        } else {
          setError(result.error || 'Social auth failed');
        }
      } catch (err: any) {
        setError(err?.message || 'Social auth failed');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google login failed'),
  });

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <header className="p-4 md:p-6 flex justify-between items-center relative z-[110]">
        <Link href="/" className="flex items-center gap-2 max-w-max transition-opacity hover:opacity-80">
          <Image src={logo} alt="Dosro Bazar" width={140} height={45} className="h-10 w-auto" />
        </Link>
        <Link href="/" className="text-sm font-bold text-primary hover:underline hidden md:block">
          Back to Home
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className={`group relative overflow-hidden w-[1000px] max-w-full min-h-[650px] bg-card rounded-[var(--radius)] shadow-[var(--shadow-medium)] border border-border flex flex-col md:block ${isSignUp ? 'right-panel-active' : ''}`} id="auth-container">

          {/* Sign Up Form */}
          <div className={`sign-up-container absolute top-0 h-full transition-transform duration-[700ms] ease-in-out left-0 w-full md:w-1/2 ${isSignUp ? 'z-[5] block relative md:absolute' : 'z-[1] hidden md:block'} group-[.right-panel-active]:translate-x-full`}>
            <div className={`h-full w-full transition-opacity duration-[350ms] ease-in-out ${isSignUp ? 'opacity-100 delay-[350ms]' : 'opacity-0 delay-0'}`}>
              <form onSubmit={handleSignUpSubmit} className="bg-card flex flex-col items-center justify-center p-8 md:p-12 h-full text-center">
              <h1 className="text-3xl font-black mb-2 text-primary">Create Account</h1>
              <span className="text-sm text-muted-foreground mb-6 uppercase tracking-widest font-bold">Start your journey today</span>

              <div className="w-full space-y-3">
                <Input
                  placeholder="Full Name"
                  value={signUpData.username}
                  onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                  className="bg-muted/50 border-none h-12 rounded-[var(--radius)]"
                />
                <Input
                  placeholder="Phone Number"
                  value={signUpData.phone}
                  onChange={(e) => {
                    setSignUpData({ ...signUpData, phone: e.target.value });
                    validatePhone(e.target.value);
                  }}
                  className={`bg-muted/50 border-none h-12 rounded-[var(--radius)] ${phoneWarning ? 'ring-1 ring-amber-400' : ''}`}
                />
                <Input
                  placeholder="Email (Optional)"
                  value={signUpData.email}
                  onChange={(e) => {
                    setSignUpData({ ...signUpData, email: e.target.value });
                    validateEmail(e.target.value);
                  }}
                  className={`bg-muted/50 border-none h-12 rounded-[var(--radius)] ${emailWarning ? 'ring-1 ring-amber-400' : ''}`}
                />
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    className="bg-muted/50 border-none h-12 rounded-[var(--radius)] pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && isSignUp && <div className="mt-4 w-full"><ErrorMessage error={error} /></div>}
              {successMessage && isSignUp && <div className="mt-4 w-full"><ErrorMessage variant="success" message={successMessage} /></div>}

              <Button disabled={loading} type="submit" className="mt-6 w-full h-12 rounded-full font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
                {loading ? 'Creating...' : 'Sign Up'}
              </Button>

              <div className="w-full mt-6 space-y-3">
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
                </div>
                <div className="flex flex-col gap-3 items-center w-full max-w-[320px] mx-auto">
                  <button type="button" onClick={() => loginWithGoogleCustom()} className="w-full h-10 rounded-full border border-border flex items-center justify-center gap-3 transition-all hover:bg-muted/50 bg-card shadow-sm active:scale-[0.98]">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="text-sm font-medium text-foreground">Continue with Google</span>
                  </button>
                  <button type="button" onClick={() => handleFacebookLogin()} className="w-full h-10 rounded-full border border-border flex items-center justify-center gap-3 transition-all hover:bg-muted/50 bg-card shadow-sm active:scale-[0.98]">
                    <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="text-sm font-medium text-foreground">Continue with Facebook</span>
                  </button>
                </div>
              </div>

              <p className="mt-6 cursor-pointer text-primary font-bold md:hidden uppercase tracking-widest text-xs" onClick={() => handleToggleMode(false)}>Already a user? Sign In</p>
            </form>
            </div>
          </div>

          {/* Sign In Form */}
          <div className={`absolute top-0 h-full transition-transform duration-[700ms] ease-in-out left-0 w-full md:w-1/2 ${!isSignUp ? 'z-[5] block relative md:absolute' : 'z-[1] hidden md:block'} group-[.right-panel-active]:translate-x-full`}>
            <div className={`h-full w-full transition-opacity duration-[350ms] ease-in-out ${!isSignUp ? 'opacity-100 delay-[350ms]' : 'opacity-0 delay-0'}`}>
              <form onSubmit={handleLoginSubmit} className="bg-card flex flex-col items-center justify-center p-8 md:p-12 h-full text-center">
              <h1 className="text-3xl font-black mb-2 text-primary">Welcome Back</h1>
              <span className="text-sm text-muted-foreground mb-6 uppercase tracking-widest font-bold">Please enter your credentials</span>

                <div className="w-full space-y-3">
                  <Input
                    placeholder="Email or Phone"
                    value={loginIdentifier}
                    onChange={(e) => {
                      setLoginIdentifier(e.target.value);
                      validateIdentifier(e.target.value);
                    }}
                    className={`bg-muted/50 border-none h-12 rounded-[var(--radius)] ${identifierWarning ? 'ring-1 ring-amber-400' : ''}`}
                  />
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="bg-muted/50 border-none h-12 rounded-[var(--radius)] pr-10"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

              <div className="w-full flex justify-between items-center mt-4 text-xs font-bold text-muted-foreground">
                <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded accent-primary" />
                  Remember me
                </label>
                <button 
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-sm font-medium text-primary hover:underline transition-all"
              >
                Forgot your password?
              </button>
              </div>

              {error && !isSignUp && <div className="mt-4 w-full"><ErrorMessage error={error} /></div>}
              {successMessage && !isSignUp && <div className="mt-4 w-full"><ErrorMessage variant="success" message={successMessage} /></div>}

              <Button disabled={loading} type="submit" className="mt-6 w-full h-12 rounded-full font-bold uppercase tracking-wider bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className="w-full mt-6 space-y-3">
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-muted" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
                </div>
                <div className="flex flex-col gap-3 items-center w-full max-w-[320px] mx-auto">
                  <button type="button" onClick={() => loginWithGoogleCustom()} className="w-full h-10 rounded-full border border-border flex items-center justify-center gap-3 transition-all hover:bg-muted/50 bg-card shadow-sm active:scale-[0.98]">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="text-sm font-medium text-foreground">Continue with Google</span>
                  </button>
                  <button type="button" onClick={() => handleFacebookLogin()} className="w-full h-10 rounded-full border border-border flex items-center justify-center gap-3 transition-all hover:bg-muted/50 bg-card shadow-sm active:scale-[0.98]">
                    <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="text-sm font-medium text-foreground">Continue with Facebook</span>
                  </button>
                </div>
              </div>

              <p className="mt-6 cursor-pointer text-primary font-bold md:hidden uppercase tracking-widest text-xs" onClick={() => handleToggleMode(true)}>New here? Create Account</p>
            </form>
            </div>
          </div>

          {/* Overlay Container (Desktop Only) */}
          <div className="hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-[700ms] ease-in-out z-[100] group-[.right-panel-active]:-translate-x-full">
            {/* Direct hex colors for brand gradient: Midnight Pine (#1E2E24) to Muted Fern (#587A64) */}
            <div className="bg-gradient-to-br from-[#1E2E24] to-[#587A64] bg-no-repeat bg-cover bg-[0_0] text-white relative left-[-100%] h-full w-[200%] transition-transform duration-[700ms] ease-in-out group-[.right-panel-active]:translate-x-1/2">
              
              {/* Overlay Left Panel */}
              <div className="absolute flex flex-col items-center justify-center p-10 text-center top-0 h-full w-1/2 transition-transform duration-[700ms] ease-in-out translate-x-[-20%] group-[.right-panel-active]:translate-x-0">
                <h1 className="text-4xl font-extrabold mb-4 text-white">Welcome Buddy!</h1>
                <p className="text-lg mb-8 text-white/90">Already have an account? Keep in touch with us by logging in with your personal info</p>
                <Button variant="outline" className="rounded-full border-2 border-white bg-transparent hover:bg-white/10 text-white w-48 h-12 font-bold uppercase transition-all active:scale-95" onClick={() => handleToggleMode(false)}>
                  Sign In
                </Button>
              </div>

              {/* Overlay Right Panel */}
              <div className="absolute flex flex-col items-center justify-center p-10 text-center top-0 h-full w-1/2 transition-transform duration-[700ms] ease-in-out right-0 translate-x-0 group-[.right-panel-active]:translate-x-[20%]">
                <h1 className="text-4xl font-extrabold mb-4 text-[#C9E4D1]">Namaste, Friend!</h1>
                <p className="text-lg mb-8 text-white/90">Enter your personal details and start your journey with Dosro Bazar today</p>
                <Button variant="outline" className="rounded-full border-2 border-white bg-transparent hover:bg-white/10 text-white w-48 h-12 font-bold uppercase transition-all active:scale-95" onClick={() => handleToggleMode(true)}>
                  Sign Up
                </Button>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* OTP Overlay */}
      {otpRequired && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={() => setOtpRequired(false)} />
          <div className="relative bg-card w-full max-w-md p-8 rounded-3xl shadow-2xl border border-border animate-in zoom-in slide-in-from-bottom-10 duration-500">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-2xl font-black text-foreground">Two-Factor Authentication</h2>
              <p className="text-sm text-muted-foreground mt-2">
                We've sent a 6-digit verification code to <br />
                <span className="font-bold text-foreground">{otpEmail}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Input
                  placeholder="000000"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="bg-muted/50 border-none h-16 rounded-2xl text-center text-3xl font-bold tracking-[12px] focus:ring-2 ring-emerald-500"
                  autoFocus
                />
                {error && <div className="text-center"><ErrorMessage error={error} /></div>}
              </div>

              <Button 
                type="button"
                disabled={loading} 
                onClick={handleOtpSubmit}
                className="w-full h-14 rounded-full font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all active:scale-95"
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </Button>

              <button 
                type="button" 
                onClick={() => setOtpRequired(false)}
                className="w-full text-sm text-muted-foreground hover:text-primary font-bold transition-colors"
              >
                Cancel and back to login
              </button>
            </div>
          </div>
        </div>
      )}

      <VerifyEmailOverlay 
        isOpen={isVerifyOverlayOpen} 
        onClose={() => setIsVerifyOverlayOpen(false)} 
        email={verifyEmail}
        onSuccess={() => {
          setSuccessMessage('Email verified! You can now log in.');
          setIsSignUp(false);
        }}
      />

      <ForgotPasswordOverlay 
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />

      <div id="fb-root"></div>

      <footer className="p-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Dosro Bazar. All rights reserved.
      </footer>
    </div>
  );
}

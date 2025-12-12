"use client";
import React, { JSX, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/shared/ErrorMessage';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { GoogleLogin } from '@react-oauth/google';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import Image from "next/image";
import logo from "../../public/logo.png";

export default function SignUpPage(): JSX.Element {
  const router = useRouter();
  const { register, loginWithGoogle, loginWithFacebook } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    password: '',
    email: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneWarning, setPhoneWarning] = useState<string | null>(null);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Validate phone number
  const validatePhone = (value: string) => {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    if (value && !phoneRegex.test(value)) {
      setPhoneWarning('Please enter a valid phone number');
    } else {
      setPhoneWarning(null);
    }
  };

  // Validate email (optional)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'phone') {
      validatePhone(value);
    } else if (name === 'email') {
      validateEmail(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (!formData.username || !formData.phone || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (phoneWarning || emailWarning) {
      setError('Please fix the errors before submitting');
      return;
    }

    // Strong password validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    if (!/[a-z]/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter');
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      setError('Password must contain at least one number');
      return;
    }

    setLoading(true);
    try {
      const result = await register(
        formData.username,
        formData.phone,
        formData.password,
        formData.email || undefined
      );

      if (result.success) {
        setSuccessMessage('Account created successfully! Redirecting...');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginWithGoogle(credentialResponse.credential, false);
      if (result.success) {
        setSuccessMessage('Account created successfully! Redirecting...');
        setTimeout(() => {
          router.push('/');
        }, 1000);
      } else {
        setError(result.error || 'Google signup failed');
      }
    } catch (err: any) {
      console.error('Google signup error:', err);
      setError(err?.message || 'Google signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Signup Failed');
    setError('Google signup failed');
  };

  const handleFacebookLogin = () => {
    if (typeof window !== 'undefined' && (window as any).FB) {
      (window as any).FB.login((response: any) => {
        if (response.authResponse) {
          setLoading(true);
          loginWithFacebook(response.authResponse.accessToken, response.authResponse.userID)
            .then((result) => {
              if (result.success) {
                setSuccessMessage('Account created successfully! Redirecting...');
                setTimeout(() => {
                  router.push('/');
                }, 1000);
              } else {
                setError(result.error || 'Facebook signup failed');
              }
            })
            .catch((err) => {
              setError(err?.message || 'Facebook signup failed');
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          setError('Facebook signup cancelled');
        }
      }, { scope: 'public_profile,email' });
    } else {
      setError('Facebook SDK not loaded');
    }
  };

  // Load Facebook SDK
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).fbAsyncInit = function () {
        (window as any).FB.init({
          appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with Logo */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image src={logo} alt="Dosro Bazar" width={120} height={40} className="h-10 w-auto cursor-pointer" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/20 to-background">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Join Dosro Bazar and start buying or selling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="username">Full Name *</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => validatePhone(formData.phone)}
                  placeholder="Enter your phone number"
                  className={phoneWarning ? 'border-amber-400 focus-visible:ring-amber-500' : ''}
                  required
                />
                {phoneWarning && (
                  <ErrorMessage variant="warning" message={phoneWarning} />
                )}
              </div>

              {/* Email (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={() => validateEmail(formData.email)}
                  placeholder="Enter your email"
                  className={emailWarning ? 'border-amber-400 focus-visible:ring-amber-500' : ''}
                />
                {emailWarning && (
                  <ErrorMessage variant="warning" message={emailWarning} />
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 8 chars, uppercase, lowercase, number"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Messages */}
              {successMessage && <ErrorMessage variant="success" message={successMessage} autoDismiss={true} dismissAfter={3000} />}
              {error && <ErrorMessage error={error} autoDismiss={true} dismissAfter={5000} />}

              {/* Submit Button */}
              <Button
                disabled={loading}
                type="submit"
                className="w-full"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href='/login' className="text-primary font-medium hover:underline">Sign In</Link>
              </p>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
                </div>
              </div>

              {/* Social Signup Buttons */}
              <div className="space-y-2">
                {/* Google Signup */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const googleBtn = document.querySelector('[aria-labelledby="button-label"]') as HTMLElement;
                    googleBtn?.click();
                  }}
                  className="w-full"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign up with Google
                </Button>

                {/* Hidden Google Login Component */}
                <div className="hidden">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
                    text="signup_with"
                  />
                </div>

                {/* Facebook Signup */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFacebookLogin}
                  className="w-full"
                >
                  <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Sign up with Facebook
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

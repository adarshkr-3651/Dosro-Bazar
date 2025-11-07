"use client";
import React, { useState } from "react";
import { loginUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { Eye, EyeOff } from "lucide-react"; // 👁️ icons

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      if (data?.token) localStorage.setItem("token", data.token);
      console.log("Login successful:", data);
      router.push("/");
    } catch (err) {
      setError(err?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 bg-white p-8 w-full max-w-md rounded-2xl shadow-md font-[system-ui]"
      >
        {/* Email Field */}
        <div className="flex flex-col">
          <label className="text-gray-800 font-semibold mb-1" htmlFor="email">
            Email
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg h-12 px-3 focus-within:border-blue-500 transition">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border-none outline-none bg-transparent text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col mt-3">
          <label className="text-gray-800 font-semibold mb-1" htmlFor="password">
            Password
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg h-12 px-3 focus-within:border-blue-500 transition">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border-none outline-none bg-transparent text-gray-700 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Remember me + Forgot Password */}
        <div className="flex justify-between items-center mt-2 text-sm">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="accent-blue-500" />
            <span className="text-gray-700">Remember me</span>
          </label>
          <span className="text-blue-600 cursor-pointer hover:underline">
            Forgot password?
          </span>
        </div>

        {error && <ErrorMessage error={error} />}

        {/* Submit */}
        <button
          disabled={loading}
          type="submit"
          className="w-full mt-4 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* Sign Up */}
        <p className="text-center text-gray-700 text-sm mt-2">
          Don’t have an account?{" "}
          <span className="text-blue-600 font-medium cursor-pointer hover:underline">
            Sign Up
          </span>
        </p>

        <p className="text-center text-gray-500 text-sm my-2">Or With</p>

        {/* OAuth Buttons */}
        <button
          type="button"
          className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-3 hover:border-blue-500 transition"
        >
          <img
            src="https://unpkg.com/simple-icons@v10/icons/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <button
          type="button"
          className="flex items-center justify-center gap-2 border border-gray-200 rounded-lg py-3 hover:border-blue-500 transition"
        >
          <img
            src="https://unpkg.com/simple-icons@v10/icons/apple.svg"
            alt="Apple"
            className="w-5 h-5"
          />
          Continue with Apple
        </button>
      </form>
    </div>
  );
}

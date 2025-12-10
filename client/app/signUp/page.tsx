"use client";
import React, { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import ErrorMessage from "../../components/shared/ErrorMessage";
import { Eye, EyeOff } from "lucide-react";
import { signUpUser } from "../../lib/api"; // <-- create this API similar to loginUser
import { loginUser } from "../../lib/api";

export default function SignUpPage(): JSX.Element {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await signUpUser(name, email, password);
      console.log("Signup successful:", data);
      await loginUser(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Registration failed");
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
        <h2 className="text-2xl font-semibold text-gray-800 mb-1 text-center">
          Create an Account
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Join us and start using Dosro Bazar today
        </p>

        {/* Full Name */}
        <div className="flex flex-col">
          <label className="text-gray-800 font-semibold mb-1" htmlFor="name">
            Full Name
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg h-12 px-3 focus-within:border-blue-500 transition">
            <input
              id="name"
              type="text"
              value={name}
              autoComplete="off"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full border-none outline-none bg-transparent text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="text-gray-800 font-semibold mb-1" htmlFor="email">
            Email
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg h-12 px-3 focus-within:border-blue-500 transition">
            <input
              id="email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border-none outline-none bg-transparent text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col mt-3">
          <label className="text-gray-800 font-semibold mb-1" htmlFor="password">
            Password
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg h-12 px-3 focus-within:border-blue-500 transition">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full border-none outline-none bg-transparent text-gray-700 placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col mt-3">
          <label
            className="text-gray-800 font-semibold mb-1"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <div className="flex items-center border border-gray-200 rounded-lg h-12 px-3 focus-within:border-blue-500 transition">
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="off"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full border-none outline-none bg-transparent text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {error && <ErrorMessage error={error} />}

        {/* Submit */}
        <button
          disabled={loading}
          type="submit"
          className="w-full mt-4 bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-60"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {/* Login Redirect */}
        <p className="text-center text-gray-700 text-sm mt-2">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Sign In
          </span>
        </p>

        <p className="text-center text-gray-500 text-sm my-2">Or Sign Up With</p>

        {/* Google */}
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

        {/* Apple */}
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

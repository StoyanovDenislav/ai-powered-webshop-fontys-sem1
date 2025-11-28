"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { HeaderWithAuth } from "../components/HeaderWithAuth";
import headerData from "../../src/content/header.json";

export default function RegisterPage() {
  const { navItems } = headerData;
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      await register(formData.email, formData.password, formData.username);
      router.push("/"); // Redirect to home page after successful registration
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-transparent px-4 py-10 sm:px-8 lg:px-10">
      <div className="cards-shadow mx-auto flex w-full max-w-2xl flex-col gap-8 rounded-4xl border border-[#eadcca]/80 bg-white/90 p-6 backdrop-blur-sm sm:p-10">
        <HeaderWithAuth navItems={navItems} />

        <section className="mt-8">
          <h1 className="text-3xl font-semibold text-[#342117] uppercase tracking-[0.2em] text-center mb-8">
            Create Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[#342117] mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#eadcca]/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#342117]/20 bg-white text-[#342117]"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#342117] mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-[#eadcca]/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#342117]/20 bg-white text-[#342117]"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#342117] mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-[#eadcca]/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#342117]/20 bg-white text-[#342117]"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[#342117] mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-[#eadcca]/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#342117]/20 bg-white text-[#342117]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-[#342117] text-white font-semibold rounded-lg hover:bg-[#4a2f1f] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#7a6455]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#8a5c40] hover:underline font-medium"
              >
                Login here
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auth logic will be added later
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#F7CB1C]/20 bg-zinc-900/50 p-8 backdrop-blur-sm">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-white">VidPlus Admin</h1>
          <p className="text-sm text-zinc-400">Sign in to manage your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@vidplus.com"
              className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#F7CB1C] focus:ring-1 focus:ring-[#F7CB1C]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-zinc-700 bg-black px-4 py-3 text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#F7CB1C] focus:ring-1 focus:ring-[#F7CB1C]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-[#F7CB1C] to-[#FFAE00] py-3 font-semibold text-black transition-all duration-200 hover:from-[#FFAE00] hover:to-[#F7CB1C] hover:shadow-lg hover:shadow-[#F7CB1C]/25"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <a
            href="#"
            className="text-[#F7CB1C] transition-colors hover:text-[#FFAE00]"
          >
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}

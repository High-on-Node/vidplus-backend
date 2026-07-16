"use client";

import React, { useState } from "react";
import Link from "next/link";

const navigation = [
  { name: "Dashboard", href: "/dashboard", current: true },
  { name: "Downloads", href: "/downloads", current: false },
  { name: "Users", href: "/users", current: false },
  { name: "Settings", href: "/settings", current: false },
];

const stats = [
  { name: "Total Downloads Today", value: "142", icon: "download" },
  { name: "Total Downloads All Time", value: "8,432", icon: "archive" },
  { name: "Active Users", value: "23", icon: "users" },
  { name: "Storage Used", value: "2.4 GB", icon: "storage" },
];

const systemStatus = [
  { name: "Server Status", status: "Online", healthy: true },
  { name: "API Health", status: "Healthy", healthy: true },
];

function StatusDot({ healthy }: { healthy: boolean }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${
        healthy ? "bg-green-500" : "bg-red-500"
      }`}
    />
  );
}

function Icon({ name }: { name: string }) {
  const icons: Record<string, React.JSX.Element> = {
    download: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
    ),
    archive: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
        />
      </svg>
    ),
    users: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
    storage: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
        />
      </svg>
    ),
  };
  return icons[name] || null;
}

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-black">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-zinc-800 px-6">
            <Link href="/" className="flex items-center">
              <span className="bg-gradient-to-r from-[#F7CB1C] to-[#FFAE00] bg-clip-text text-xl font-bold text-transparent">
                VidPlus Admin
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4">
            <ul className="space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      item.current
                        ? "bg-gradient-to-r from-[#F7CB1C]/20 to-[#FFAE00]/10 text-[#F7CB1C]"
                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User section */}
          <div className="border-t border-zinc-800 p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#F7CB1C] to-[#FFAE00]" />
              <div>
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-zinc-500">admin@vidplus.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-800 bg-black px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white lg:hidden"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <h2 className="text-lg font-semibold text-white lg:text-xl">
            Dashboard
          </h2>

          <div className="flex items-center gap-4">
            {/* Logout button */}
            <Link
              href="/"
              className="rounded-lg bg-gradient-to-r from-[#F7CB1C] to-[#FFAE00] px-4 py-2 text-sm font-medium text-black transition-all hover:from-[#FFAE00] hover:to-[#F7CB1C]"
            >
              Logout
            </Link>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {/* System status bar */}
          <div className="mb-8 flex flex-wrap gap-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            {systemStatus.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 rounded-lg bg-black/50 px-4 py-2"
              >
                <StatusDot healthy={item.healthy} />
                <span className="text-sm text-zinc-400">{item.name}:</span>
                <span className="text-sm font-medium text-white">
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          {/* Stats grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-[#F7CB1C]/30 hover:shadow-lg hover:shadow-[#F7CB1C]/5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[#F7CB1C]">
                    <Icon name={stat.icon} />
                  </span>
                </div>
                <p className="text-sm font-medium text-zinc-400">{stat.name}</p>
                <p className="mt-1 text-2xl font-bold text-white lg:text-3xl">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Recent activity section */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">
              Recent Activity
            </h3>
            <p className="text-zinc-500">
              Activity feed will be displayed here...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

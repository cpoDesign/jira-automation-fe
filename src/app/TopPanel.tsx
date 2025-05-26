"use client";
import { useAuth, useSubscription, useOrg } from "./auth-context";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function TopPanel() {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subLoading } = useSubscription();
  const { org } = useOrg();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const storedTheme = localStorage.getItem("theme") || (prefersDark ? "dark" : "light");
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <header className="w-full bg-gray-100 dark:bg-gray-900 py-3 px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-800 gap-4">
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg">
          SaaS App
          {org && org.orgName ? ` - ${org.orgName}` : ""}
        </span>
        {!subLoading && (
          <span className="text-xs text-green-700 dark:text-green-300 border border-green-600 rounded px-2 py-1 bg-green-50 dark:bg-green-900">
            Subscription:{" "}
            {typeof subscription === "object" && subscription !== null
              ? subscription.subscriptionTier
              : subscription || "Free"}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        {!authLoading && user && (
          <span className="text-xs text-gray-700 dark:text-gray-200">
            {user.userName}
          </span>
        )}
        {!authLoading && !user && (
          <a
            href="/.auth/login/aad"
            className="text-sm text-blue-600 hover:underline"
          >
            Sign in
          </a>
        )}
        {user && (
          <Link
            href="/subscription"
            className="text-xs text-blue-600 hover:underline"
          >
            {typeof subscription === "object" &&
            subscription !== null &&
            subscription.subscriptionTier !== "Free"
              ? "Change subscription"
              : "Upgrade subscription"}
          </Link>
        )}
        {user && (
          <Link
            href="/configuration"
            className="text-xs text-blue-600 hover:underline"
          >
            Configuration
          </Link>
        )}
        {user && (
          <Link
            href="/core"
            className="text-xs text-blue-600 hover:underline"
          >
            Core
          </Link>
        )}
        <label className="flex items-center cursor-pointer text-xs">
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={toggleTheme}
            className="mr-1"
          />
          Dark mode
        </label>
        {user && (
          <Link
            href="/logout"
            className="text-xs text-gray-600 border border-gray-400 rounded px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            Sign out
          </Link>
        )}
      </div>
    </header>
  );
}

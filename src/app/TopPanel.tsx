"use client";
import { useAuth, useSubscription } from "./auth-context";
import React from "react";
import Link from "next/link";
import ConfigurationPage from "./configuration/page";

export default function TopPanel() {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subLoading } = useSubscription();

  return (
    <header className="w-full bg-gray-100 dark:bg-gray-900 py-3 px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-800 gap-4">
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg">SaaS App</span>
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

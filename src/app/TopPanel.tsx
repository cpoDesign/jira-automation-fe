"use client";
import { useAuth } from "./auth-context";
import React, { useEffect, useState } from "react";
import Link from "next/link";

function useRemoteSubscription() {
  const [subscription, setSubscription] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch(
          "https://jirabackendfunctions20250524235736.azurewebsites.net/api/subscription",
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        setSubscription(data.subscriptionTier);
      } catch {
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    }
    fetchSubscription();
  }, []);
  return { subscription, loading };
}

export default function TopPanel() {
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subLoading } = useRemoteSubscription();

  return (
    <header className="w-full bg-gray-100 dark:bg-gray-900 py-3 px-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-800 gap-4">
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg">SaaS App</span>
        {!subLoading && (
          <span className="text-xs text-green-700 dark:text-green-300 border border-green-600 rounded px-2 py-1 bg-green-50 dark:bg-green-900">
            Subscription: {subscription || "Free"}
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        {!authLoading && user && (
          <span className="text-xs text-gray-700 dark:text-gray-200">{user.userName}</span>
        )}
        {!authLoading && !user && (
          <a href="/.auth/login/aad" className="text-sm text-blue-600 hover:underline">Sign in</a>
        )}
        <Link href="/webhook" className="text-xs text-blue-600 hover:underline">Webhook Info</Link>
        {user && (
          <Link href="/subscription" className="text-xs text-blue-600 hover:underline">
            {subscription && subscription !== "Free" ? "Change subscription" : "Upgrade subscription"}
          </Link>
        )}
        {user && (
          <Link href="/logout" className="text-xs text-gray-600 border border-gray-400 rounded px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-800">Sign out</Link>
        )}
      </div>
    </header>
  );
}

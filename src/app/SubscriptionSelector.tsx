// src/app/SubscriptionSelector.tsx
"use client";
import { Dela_Gothic_One } from "next/font/google";
import { useAvailableSubscriptions, useSubscription } from "./auth-context";
import React, { useState } from "react";
import { trackEvent } from "./appinsights";

export default function SubscriptionSelector({
  onSelect,
}: {
  onSelect?: (id: string) => void;
}) {
  const { plans } = useAvailableSubscriptions();
  const { subscription, loading } = useSubscription();
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  // Internal state to track if user canceled checkout
  const [showSelector, setShowSelector] = useState(true);
  // Extract accountId and user email from subscription and auth context
  const accountId =
    typeof subscription === "object" &&
    subscription !== null &&
    "accountId" in subscription
      ? (subscription as { accountId: string }).accountId
      : undefined;
  const userEmail =
    typeof subscription === "object" &&
    subscription !== null &&
    "isAccountHolder" in subscription &&
    userEmailFromContext()
      ? userEmailFromContext()
      : undefined;

  function userEmailFromContext() {
    // Try to get user email from auth context if available
    // (If you have a useAuth hook, import and use it here)
    // For now, fallback to window.localStorage or similar if needed
    return undefined; // Placeholder, update as needed
  }

  React.useEffect(() => {
    // If redirected back from Stripe and subscription is still Free, show the selector
    const params = new URLSearchParams(window.location.search);
    if (params.has("canceled") && subscription && typeof subscription === "object" && subscription.subscriptionTier === "Free") {
      setShowSelector(true);
    }
    // Optionally, clear the canceled param from the URL
    if (params.has("canceled")) {
      params.delete("canceled");
      window.history.replaceState({}, document.title, window.location.pathname + (params.toString() ? `?${params}` : ''));
    }
  }, [subscription]);

  if (loading) return <div>Loading plans...</div>;
  if (!plans) return <div>Failed to load plans.</div>;
  if (subscription && typeof subscription === "object" && subscription.subscriptionTier !== "Free") return null;
  if (!showSelector) return null;

  async function handleCheckout(priceId: string) {
    if (onSelect) {
      onSelect(priceId);
    }
    setLoadingCheckout(true);
    try {
      const payload = JSON.stringify({ priceId, accountId, userEmail });
      trackEvent("StripeCheckoutSessionStart", { priceId, accountId, userEmail });
      // Call your backend to create a Stripe Checkout session
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });
      const data = await res.json();
      trackEvent("StripeCheckoutSessionResponse", { response: data });
      if (data.url) {
        setCheckoutUrl(data.url);
        setShowSelector(false); // Hide selector on redirect
        window.location.href = data.url;
      }
    } finally {
      setLoadingCheckout(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold mb-2">Choose a Subscription</h2>
      {plans.map((plan) => (
        <button
          key={plan.id}
          className={`border rounded p-4 text-left ${
            typeof subscription === "object" && subscription !== null && subscription.subscriptionTier === plan.name
              ? "border-blue-600 bg-blue-50"
              : "border-gray-300"
          }`}
          onClick={() => handleCheckout(plan.id)}
          disabled={loadingCheckout}
        >
          <div className="font-semibold">
            {plan.name}{" "}
            {plan.price > 0 && (
              <span className="text-xs text-gray-500">${plan.price}/mo</span>
            )}
          </div>
          <div className="text-sm text-gray-600">{plan.description}</div>
        </button>
      ))}
      {checkoutUrl && (
        <div className="text-blue-600 mt-2">Redirecting to checkout...</div>
      )}
    </div>
  );
}

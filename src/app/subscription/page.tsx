"use client";
import { useAvailableSubscriptions } from "../auth-context";
import { useState } from "react";

export default function CheckoutPage() {
  const { plans, loading } = useAvailableSubscriptions();
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);

  async function handleCheckout(priceId: string) {
    setLoadingCheckout(priceId);
    try {
      // Call your backend to create a Stripe Checkout session
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to create Stripe checkout session.");
      }
    } finally {
      setLoadingCheckout(null);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Choose a Subscription Plan</h1>
      {loading && <div>Loading plans...</div>}
      {!loading && plans && (
        <div className="flex flex-col gap-6">
          {plans.map(plan => (
            <div key={plan.id} className="border rounded p-4 flex flex-col gap-2">
              <div className="font-semibold text-lg">{plan.name} {plan.price > 0 && (<span className="text-xs text-gray-500">${plan.price}/mo</span>)}</div>
              <div className="text-sm text-gray-600">{plan.description}</div>
              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={() => handleCheckout(plan.id)}
                disabled={!!loadingCheckout}
              >
                {loadingCheckout === plan.id ? "Redirecting..." : "Subscribe"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

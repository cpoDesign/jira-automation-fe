"use client";
import { useAuth, useSubscription } from "../auth-context";
import { useState, useEffect } from "react";

function useAvailableSubscriptions() {
  const [plans, setPlans] = useState<Array<{
    id: string;
    name: string;
    price: number;
    description: string;
  }> | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchPlans() {
      try {
        let headers: Record<string, string> = {};
        if (user?.email) {
          headers["x-user-email"] = user.email;
        }
        const res = await fetch("/api/subscriptions", { headers });
        if (!res.ok) throw new Error("Failed to fetch plans");
        const data = await res.json();
        setPlans(data);
      } catch {
        setPlans(null);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, [user]);
  return { plans, loading };
}

export default function CheckoutPage() {
  const { plans, loading } = useAvailableSubscriptions();
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);

  async function handleCheckout(priceId: string) {
    setLoadingCheckout(priceId);
    try {
      // Call your backend to create a Stripe Checkout session
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          accountId: subscription?.accountId,
          userEmail: user?.email,
        }),
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
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="border rounded p-4 flex flex-col gap-2"
            >
              <div className="font-semibold text-lg">
                {plan.name}{" "}
                {plan.price > 0 && (
                  <span className="text-xs text-gray-500">
                    ${plan.price}/mo
                  </span>
                )}
              </div>
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

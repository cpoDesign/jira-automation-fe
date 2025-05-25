"use client";
// Simple Azure Static Web Apps Auth context for Next.js
// This is a placeholder. In production, fetch from /.auth/me or use SWA Auth client SDK.
import { createContext, useContext, useEffect, useState } from "react";

export type User = {
  userId: string;
  userName: string;
  email: string;
  provider: string;
  roles: string[];
};

// Add Azure Static Web Apps authentication support
export type AuthContextType = {
  user: User | null;
  loading: boolean;
  token?: string;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function fetchUser() {
      try {
        // Use local mock endpoint for local dev, real endpoint in production
        const isDev =
          process.env.NEXT_PUBLIC_ENV === "development" ||
          process.env.NODE_ENV === "development";
        const endpoint = isDev ? "/api/.auth/me" : "/.auth/me";
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        const principal = data.clientPrincipal;
        if (principal) {
          setUser({
            userId: principal.userId,
            userName: principal.userDetails,
            email: principal.userDetails,
            provider: principal.identityProvider,
            roles: principal.userRoles || [],
          });
          // Get the auth token for API calls
          if (principal.access_token) {
            setToken(principal.access_token);
          } else if (data.identityProviderAccessToken) {
            setToken(data.identityProviderAccessToken);
          }
        } else {
          setUser(null);
          setToken(undefined);
        }
      } catch {
        setUser(null);
        setToken(undefined);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch("/api/subscription", {
          headers: user?.email ? { "x-user-email": user.email } : {},
        });
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
  }, [user]);
  return { subscription, loading };
}

export function useAvailableSubscriptions() {
  const [plans, setPlans] = useState<Array<{
    id: string;
    name: string;
    price: number;
    description: string;
  }> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await fetch(
          "https://jirabackendfunctions20250524235736.azurewebsites.net/api/stripe/subscriptions",
          {
            headers: {
              Origin: window.location.origin,
            },
            // mode: "cors" // (default for cross-origin fetch)
          }
        );
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
  }, []);
  return { plans, loading };
}

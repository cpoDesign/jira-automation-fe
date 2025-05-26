"use client";
// Simple Azure Static Web Apps Auth context for Next.js
// This is a placeholder. In production, fetch from /.auth/me or use SWA Auth client SDK.
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

// Add SubscriptionContext and useSubscription
type SubscriptionType = {
  subscriptionTier: string;
  accountId: string;
  isAccountHolder: boolean;
} | null;

const SubscriptionContext = createContext<{
  subscription: SubscriptionType;
  loading: boolean;
}>({
  subscription: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [subscription, setSubscription] = useState<SubscriptionType>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);

  useEffect(() => {
    async function fetchUserAndSubscription() {
      try {
        // User fetch logic
        const isDev =
          process.env.NEXT_PUBLIC_ENV === "development" ||
          process.env.NODE_ENV === "development";
        const endpoint = isDev ? "/api/.auth/me" : "/.auth/me";
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Not authenticated");
        const data = await res.json();
        const principal = data.clientPrincipal;
        let nextUser: User | null = null;
        if (principal) {
          nextUser = {
            userId: principal.userId,
            userName: principal.userDetails,
            email: principal.userDetails,
            provider: principal.identityProvider,
            roles: principal.userRoles || [],
          };
          setUser(nextUser);
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
        setLoading(false);
        // Subscription fetch logic (only if user is present)
        setSubscriptionLoading(true);
        if (nextUser) {
          const subRes = await fetch("/api/subscription", {
            headers: nextUser.email ? { "x-user-email": nextUser.email } : {},
          });
          if (subRes.ok) {
            const subData = await subRes.json();
            setSubscription(subData);
          } else {
            setSubscription(null);
          }
        } else {
          setSubscription(null);
        }
      } catch {
        setUser(null);
        setToken(undefined);
        setSubscription(null);
      } finally {
        setLoading(false);
        setSubscriptionLoading(false);
      }
    }
    fetchUserAndSubscription();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, token }}>
      <SubscriptionContext.Provider
        value={{ subscription, loading: subscriptionLoading }}
      >
        {children}
      </SubscriptionContext.Provider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useSubscription() {
  return useContext(SubscriptionContext);
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

export type OrgSetup = {
  orgName: string;
  accessToken: string;
  theme: string;
  jiraUrl: string;
};

function encodeBase64(str: string) {
  return typeof window !== "undefined" ? window.btoa(unescape(encodeURIComponent(str))) : "";
}
function decodeBase64(str: string) {
  return typeof window !== "undefined" ? decodeURIComponent(escape(window.atob(str))) : "";
}

const OrgContext = createContext<{
  org: OrgSetup | null;
  setOrg: (org: OrgSetup) => void;
  clearOrg: () => void;
  getAccessToken: () => string | null;
} | null>(null);

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const [org, setOrgState] = useState<OrgSetup | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load org setup from localStorage if available
    const orgName = localStorage.getItem("orgName");
    const accessTokenEncoded = localStorage.getItem("accessToken");
    const theme = localStorage.getItem("theme") || "light";
    const jiraUrl = localStorage.getItem("jiraUrl") || "";
    if (orgName && accessTokenEncoded) {
      setOrgState({ orgName, accessToken: decodeBase64(accessTokenEncoded), theme, jiraUrl });
    }
  }, []);

  useEffect(() => {
    // If not set, redirect to /configuration after auth
    if (org === null && typeof window !== "undefined") {
      router.replace("/configuration");
    }
  }, [org, router]);

  const setOrg = (org: OrgSetup) => {
    localStorage.setItem("orgName", org.orgName);
    localStorage.setItem("accessToken", encodeBase64(org.accessToken));
    localStorage.setItem("theme", org.theme);
    setOrgState(org);
  };
  const clearOrg = () => {
    localStorage.removeItem("orgName");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("theme");
    setOrgState(null);
  };
  const getAccessToken = () => (org ? org.accessToken : null);

  return (
    <OrgContext.Provider value={{ org, setOrg, clearOrg, getAccessToken }}>
      {children}
    </OrgContext.Provider>
  );
}

export function useOrg() {
  const ctx = useContext(OrgContext);
  if (!ctx) throw new Error("useOrg must be used within OrgProvider");
  return ctx;
}

// This page handles the logout redirect for Azure Static Web Apps Auth
// It will redirect to /.auth/logout, then back to the dashboard ("/") after logout

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // After logout, Azure SWA will redirect to the post_logout_redirect_uri
    // We set it to /logout?done=1, and then redirect to dashboard
    const params = new URLSearchParams(window.location.search);
    if (params.get("done")) {
      router.replace("/");
    } else {
      window.location.href =
        "/.auth/logout?post_logout_redirect_uri=/logout?done=1";
    }
  }, [router]);

  return <div>Signing out...</div>;
}

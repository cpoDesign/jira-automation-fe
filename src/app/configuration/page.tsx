"use client";
import { useState, useEffect } from "react";
import { useOrg } from "../auth-context";
import { useRouter } from "next/navigation";

function decodeBase64(str: string) {
  return typeof window !== "undefined" ? decodeURIComponent(escape(window.atob(str))) : "";
}

export default function ConfigurationPage() {
  const { org, setOrg } = useOrg();
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [theme, setTheme] = useState("light");
  const [showPassword, setShowPassword] = useState(false);
  const [accessTokenTouched, setAccessTokenTouched] = useState(false);
  const [jiraUrl, setJiraUrl] = useState("");

  useEffect(() => {
    // Load from org context or localStorage
    if (org) {
      setOrgName(org.orgName);
      setAccessToken(org.accessToken);
      setTheme(org.theme);
      setJiraUrl(org.jiraUrl || "");
    } else {
      const orgNameLS = localStorage.getItem("orgName") || "";
      const accessTokenEncoded = localStorage.getItem("accessToken") || "";
      const themeLS = localStorage.getItem("theme") || "light";
      const jiraUrlLS = localStorage.getItem("jiraUrl") || "";
      setOrgName(orgNameLS);
      setAccessToken(accessTokenEncoded ? decodeBase64(accessTokenEncoded) : "");
      setTheme(themeLS);
      setJiraUrl(jiraUrlLS);
    }
  }, [org]);

  const handleContinue = () => {
    setOrg({ orgName, accessToken, theme, jiraUrl });
    localStorage.setItem("jiraUrl", jiraUrl);
    router.replace("/core");
  };

  const handleAccessTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccessToken(e.target.value);
    setAccessTokenTouched(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Organization Setup
            </h1>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={() => setTheme(theme === "light" ? "dark" : "light")}
                className="mr-2"
              />
              <span className="text-sm">Dark mode</span>
            </label>
          </div>
          <label className="block mt-2 text-gray-700 dark:text-gray-200">
            Organization Name
          </label>
          <input
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
            placeholder="Organization Name"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
          <label className="block mt-2 text-gray-700 dark:text-gray-200">
            Jira URL
          </label>
          <input
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
            placeholder="https://your-domain.atlassian.net"
            value={jiraUrl}
            onChange={e => setJiraUrl(e.target.value)}
            type="url"
            autoComplete="off"
          />
          <label className="block mt-2 text-gray-700 dark:text-gray-200">
            Access Token
          </label>
          <div className="relative w-full">
            <input
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white pr-10"
              placeholder="Access Token"
              value={accessTokenTouched || !org ? accessToken : accessToken.replace(/./g, "*")}
              onChange={handleAccessTokenChange}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              onFocus={() => setAccessTokenTouched(true)}
              readOnly={!!org && !accessTokenTouched}
              onPaste={e => { setAccessToken(e.clipboardData.getData('text')); setAccessTokenTouched(true); }}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-600 text-white rounded px-4 py-2 disabled:bg-gray-400"
              onClick={handleContinue}
              disabled={!orgName || !accessToken || !jiraUrl}
            >
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

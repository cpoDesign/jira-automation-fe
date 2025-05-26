"use client";
import { useState, useEffect } from "react";

export default function SetupPage() {
  const [orgName, setOrgName] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const storedTheme =
      localStorage.getItem("theme") || (prefersDark ? "dark" : "light");
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  const handleContinue = () => {
    localStorage.setItem("orgName", orgName);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("theme", theme);
    alert("Configuration saved. Proceeding...");
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
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
                onChange={toggleTheme}
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
            Access Token
          </label>
          <input
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
            placeholder="Access Token"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            type="password"
          />
          <div className="flex justify-end mt-4">
            <button
              className="bg-blue-600 text-white rounded px-4 py-2 disabled:bg-gray-400"
              onClick={handleContinue}
              disabled={!orgName || !accessToken}
            >
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

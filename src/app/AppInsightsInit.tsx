"use client";
import { useEffect } from "react";
import { initAppInsights, trackPageView } from "./appinsights";

export default function AppInsightsInit() {
  useEffect(() => {
    initAppInsights();
    trackPageView("MainLayout");
  }, []);
  return null;
}

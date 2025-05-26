import { ApplicationInsights } from "@microsoft/applicationinsights-web";

const instrumentationKey =
  process.env.NEXT_PUBLIC_APPINSIGHTS_INSTRUMENTATIONKEY;

let appInsights: ApplicationInsights | null = null;

export function initAppInsights() {
  if (!instrumentationKey) {
    console.warn("App Insights instrumentation key not set.");
    return;
  }
  if (!appInsights) {
    appInsights = new ApplicationInsights({
      config: {
        instrumentationKey,
        enableAutoRouteTracking: true,
      },
    });
    appInsights.loadAppInsights();
  }
}

export function trackPageView(name?: string) {
  if (appInsights) {
    appInsights.trackPageView({ name });
  }
}

export function trackException(error: Error) {
  if (appInsights) {
    appInsights.trackException({ exception: error });
  }
}

export function trackEvent(name: string, properties?: Record<string, any>) {
  if (appInsights) {
    appInsights.trackEvent({ name }, properties);
  }
}

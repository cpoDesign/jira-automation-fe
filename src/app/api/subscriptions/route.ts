// src/app/api/subscriptions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SubscriptionService, OpenAPI } from "@/api/generated";
import { getApiBaseOrThrow } from "../subscription/getApiBaseOrThrow";

export async function GET(req: NextRequest) {
  try {
    let userEmail = req.headers.get("x-user-email");
    if (!userEmail) {
      // Fallback for local development: try to get from cookies or set a default
      const cookies = req.cookies;
      userEmail =
        cookies.get("x-user-email")?.value ||
        process.env.DEV_USER_EMAIL ||
        "testuser@example.com";
    }
    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const apiBase = await getApiBaseOrThrow();
    OpenAPI.BASE = apiBase;
    OpenAPI.HEADERS = {
      "x-ms-client-principal-id": userEmail,
    };
    const data = await SubscriptionService.listStripeSubscriptions();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

// src/app/api/subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SubscriptionService, OpenAPI } from "@/api/generated";
import { getApiBaseOrThrow } from "./getApiBaseOrThrow";

export async function GET(req: NextRequest) {
  try {
    let principalId = undefined;
    // Only use the x-user-email header in production, not in dev
    const userEmail = req.headers.get("x-user-email");
    if (userEmail) {
      principalId = userEmail;
    }
    if (!principalId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Use the shared function to get and validate the API base
    const apiBase = await getApiBaseOrThrow();
    OpenAPI.BASE = apiBase;
    OpenAPI.HEADERS = {
      "x-ms-client-principal-id": principalId,
    };
    // Call the generated SubscriptionService
    const data = await SubscriptionService.getSubscription();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

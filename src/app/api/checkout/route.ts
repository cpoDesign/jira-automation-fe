// src/app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SubscriptionService, OpenAPI } from "@/api/generated";
import { getApiBaseOrThrow } from "../subscription/getApiBaseOrThrow";

export async function POST(req: NextRequest) {
  try {
    debugger;
    const { priceId, accountId, userEmail } = await req.json();
    if (!userEmail || !accountId) {
      return NextResponse.json(
        { error: "Missing userEmail or accountId" },
        { status: 400 }
      );
    }

    const apiBase = await getApiBaseOrThrow();
    OpenAPI.BASE = apiBase;
    OpenAPI.HEADERS = {
      "x-ms-client-principal-id": userEmail,
      AccountId: accountId,
    };

    console.log(userEmail, accountId, priceId);
    debugger;
    debugger;
    const data = await SubscriptionService.createCheckoutSession({
      priceId,
      accountId,
      email: userEmail,
    });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

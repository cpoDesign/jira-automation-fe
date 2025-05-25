// src/app/api/stripe/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { priceId } = await req.json();
  // Call your Azure Function to create a Stripe Checkout session
  const res = await fetch(
    "https://jirabackendfunctions20250524235736.azurewebsites.net/api/stripe/checkout",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId })
    }
  );
  const data = await res.json();
  return NextResponse.json(data);
}

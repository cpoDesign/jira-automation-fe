// src/app/api/subscriptions/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const res = await fetch(process.env.NEXT_PUBLIC_FUNCTION_API + "/stripe/subscriptions", {
    method: "GET"
  });
  const data = await res.json();
  return NextResponse.json(data);
}

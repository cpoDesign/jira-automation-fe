// src/app/api/subscription/route.ts
import { NextRequest, NextResponse } from "next/server";

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
    if (!process.env.NEXT_PUBLIC_FUNCTION_API) {
      return NextResponse.json(
        { error: "Backend API URL not configured" },
        { status: 500 }
      );
    }
    const res = await fetch(
      process.env.NEXT_PUBLIC_FUNCTION_API + "/subscription",
      {
        method: "GET",
        headers: {
          "x-ms-client-principal-id": principalId,
        },
      }
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: `Backend error: ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

// src/app/api/close-account/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Forward the request to the Azure Function (internal API)
  const principalHeader = req.headers.get("x-ms-client-principal");
  let principalId = undefined;
  if (principalHeader) {
    try {
      const principal = JSON.parse(Buffer.from(principalHeader, "base64").toString("utf8"));
      principalId = principal.userId;
    } catch {}
  }
  if (!principalId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const res = await fetch(process.env.NEXT_PUBLIC_FUNCTION_API + "/account/close", {
    method: "POST",
    headers: {
      "x-ms-client-principal-id": principalId,
    },
  });
  const data = await res.text();
  return NextResponse.json({ message: data });
}

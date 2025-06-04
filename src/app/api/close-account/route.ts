// src/app/api/close-account/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AccountService, OpenAPI } from "@/api/generated";
import { getApiBaseOrThrow } from "../subscription/getApiBaseOrThrow";

export async function POST(req: NextRequest) {
  const principalHeader = req.headers.get("x-ms-client-principal");
  let principalId = undefined;
  if (principalHeader) {
    try {
      const principal = JSON.parse(
        Buffer.from(principalHeader, "base64").toString("utf8")
      );
      principalId = principal.userId;
    } catch {}
  }
  if (!principalId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const apiBase = await getApiBaseOrThrow();
    OpenAPI.BASE = apiBase;
    OpenAPI.HEADERS = {
      "x-ms-client-principal-id": principalId,
    };
    // Call the generated AccountService to close the account
    const data = await AccountService.closeAccount();
    return NextResponse.json({ message: data });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

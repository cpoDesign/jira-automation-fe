import { NextResponse } from "next/server";

export async function GET() {
  // Simulate a fake authenticated user for local development
  return NextResponse.json({
    clientPrincipal: {
      userId: "fake-user-id",
      userDetails: "fakeuser@example.com",
      identityProvider: "aad",
      userRoles: ["authenticated"],
      access_token: "fake-access-token"
    }
  });
}

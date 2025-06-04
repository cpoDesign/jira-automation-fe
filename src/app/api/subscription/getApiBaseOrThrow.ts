export async function getApiBaseOrThrow(): Promise<string> {
  const apiBase = process.env.NEXT_PUBLIC_FUNCTION_API;
  if (!apiBase) {
    try {
      const { trackException } = await import("../../appinsights");
      trackException(
        new Error("NEXT_PUBLIC_FUNCTION_API environment variable is not set")
      );
    } catch {}
    throw new Error("NEXT_PUBLIC_FUNCTION_API environment variable is not set");
  }
  return apiBase;
}

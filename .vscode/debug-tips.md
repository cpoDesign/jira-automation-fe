// Recommended breakpoints for debugging checkout issues in SubscriptionSelector
// 1. Set a breakpoint at the start of handleCheckout to inspect input values
// 2. Set a breakpoint after the fetch call to inspect the response
// 3. Set a breakpoint in your /api/checkout/route.ts POST handler to debug backend logic

// Example for VS Code launch.json (already present):
// - Start "Next.js: debug server" to debug server-side (API routes)
// - Start "Next.js: debug client" to debug client-side (React components)

// To set breakpoints:
// - In SubscriptionSelector.tsx, set on:
// - `async function handleCheckout(priceId: string) {`
// - `const payload = JSON.stringify({ priceId, accountId, userEmail });`
// - `const res = await fetch("/api/checkout", { ... });`
// - `const data = await res.json();`
// - In api/checkout/route.ts, set on:
// - `export async function POST(req: NextRequest) {`
// - `const { priceId, accountId, userEmail } = await req.json();`
// - `const data = await SubscriptionService.createCheckoutSession({ ... });`
// - `return NextResponse.json(data);`

// You can now step through the checkout flow and inspect all variables and errors.

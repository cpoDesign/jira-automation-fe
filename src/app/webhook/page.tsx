"use client";
import Link from "next/link";

export default function WebhookInfoPage() {
  return (
    <div className="max-w-xl mx-auto p-8 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">Stripe Webhook URL</h1>
      <p className="text-lg text-gray-700">Copy and configure this URL in your Stripe dashboard:</p>
      <pre className="bg-gray-100 border rounded p-4 text-sm w-full text-center select-all">
{process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_URL}
      </pre>
      <p className="text-gray-500 text-sm">You can find and update this value in your environment variables.</p>
      <Link href="/" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go to Main Page</Link>
    </div>
  );
}

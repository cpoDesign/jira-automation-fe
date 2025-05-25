"use client";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="max-w-xl mx-auto p-8 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold text-green-700">Subscription Successful!</h1>
      <p className="text-lg text-gray-700">Thank you for subscribing. Your subscription is now active.</p>
      <Link href="/" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Go to Main Page</Link>
    </div>
  );
}

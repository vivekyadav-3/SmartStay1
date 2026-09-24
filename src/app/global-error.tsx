"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-2">Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-emerald-600 rounded-lg text-sm font-semibold"
        >
          Try again
        </button>
      </body>
    </html>
  );
}

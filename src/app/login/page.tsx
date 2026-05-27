"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] p-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#059669] text-2xl font-bold text-white shadow-float">
        N
      </div>
      <h1 className="mb-2 font-headline-md text-3xl text-white">Welcome to NutriNode</h1>
      <p className="mb-10 max-w-xs text-gray-400">
        Your personal metabolic control tower for precision dining.
      </p>

      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-4 rounded-full bg-white px-8 py-4 font-body-bold text-black shadow-float transition-all hover:bg-gray-100"
      >
        <img src="https://www.google.com/favicon.ico" className="h-5 w-5" alt="Google" />
        Continue with Google
      </button>

      <footer className="mt-20 text-xs uppercase tracking-widest text-gray-600">
        Clinical Minimalism // v1.0.4
      </footer>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-6 py-20">
        <div className="flex flex-col items-center gap-6 text-center">
          <Image
            src="/zniyerbuy-logo.png"
            alt="ZNIYERBUY"
            width={220}
            height={220}
            priority
          />
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            ZNIYERBUY
          </h1>
          <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Shop smart, delivered fast. Discover deals, manage products, and
            run your store from one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-black dark:hover:bg-zinc-300"
          >
            Go to Shop
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Open Dashboard
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Login
          </Link>
        </div>
      </main>
    </div>
  );
}
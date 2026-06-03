import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-orange-50 text-black dark:bg-black dark:text-orange-100">
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
          <p className="max-w-2xl text-lg text-orange-700 dark:text-orange-300">
            Shop smart, delivered fast. Discover deals, manage products, and
            run your store from one place.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-700 dark:bg-orange-500 dark:text-black dark:hover:bg-orange-600"
          >
            Go to Shop
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-orange-400 px-6 py-3 text-sm font-semibold text-black hover:bg-orange-100 dark:border-orange-500 dark:text-orange-100 dark:hover:bg-orange-900"
          >
            Open Dashboard
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full border border-orange-400 px-6 py-3 text-sm font-semibold text-black hover:bg-orange-100 dark:border-orange-500 dark:text-orange-100 dark:hover:bg-orange-900"
          >
            Login
          </Link>
        </div>
      </main>
    </div>
  );
}
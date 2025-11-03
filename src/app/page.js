import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-black dark:to-gray-900">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center gap-12 px-6 py-16">
        {/* Logo/Brand Section */}


        {/* Hero Section */}
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Welcome to <span className="text-blue-600">RevTrust</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            RevTrust is redefining trust in eCommerce by ensuring every review is verified, authentic, and impactful. Be part of the proof — and help shape the future of transparent brand reputation.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/login"
            className="group flex h-14 items-center justify-center gap-3 rounded-lg bg-blue-600 px-8 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl hover:scale-105"
          >
            <svg 
              className="h-5 w-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
              />
            </svg>
            Go to Login
          </Link>
          

        </div>

        {/* Features Grid */}
        <div className="mt-8 grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
              <svg 
                className="h-6 w-6 text-blue-600 dark:text-blue-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Secure</h3>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Enterprise-grade security for your data
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900">
              <svg 
                className="h-6 w-6 text-purple-600 dark:text-purple-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 10V3L4 14h7v7l9-11h-7z" 
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Fast</h3>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Lightning-fast performance
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
              <svg 
                className="h-6 w-6 text-green-600 dark:text-green-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Reliable</h3>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              99.9% uptime guarantee
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
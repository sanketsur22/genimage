"use client";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { SparklesIcon } from "@heroicons/react/24/solid";

// Example model lists - you'll want to fetch these from your backend
// const textToImageModels = ["Stable Diffusion", "DALL-E 2", "Midjourney"];

export default function Header() {
  const { user, isLoaded } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-white text-xl font-bold">
          GenImage
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/#hero"
            className="text-white/80 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/#features"
            className="text-white/80 hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="text-white/80 hover:text-white transition-colors"
          >
            Pricing
          </Link>

          {/* Documentation Dropdown */}
          <div className="relative group">
            <button className="text-white/80 group-hover:text-white transition-colors">
              Documentation
            </button>
            <div className="absolute left-0 top-full pt-2 invisible group-hover:visible">
              <div className="w-48 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 shadow-lg overflow-hidden">
                <Link
                  href="/components/TextToImageFeatures"
                  className="block px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
                >
                  Text to Image
                </Link>
                <Link
                  href="/components/ImageToTextFeatures"
                  className="block px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
                >
                  Image to Text
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 text-white">
            <SparklesIcon className="w-5 h-5 text-purple-400" />
            <span>100</span>
          </div>

          {!isLoaded ? (
            <div className="h-8 w-8 animate-pulse bg-white/20 rounded-full" />
          ) : user ? (
            <UserButton />
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-4 py-2 rounded-lg bg-white hover:bg-white/90 text-black transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

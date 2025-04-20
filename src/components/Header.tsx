"use client";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChevronDownIcon, SparklesIcon } from "@heroicons/react/24/solid";

// Example model lists - you'll want to fetch these from your backend
const textToImageModels = ["Stable Diffusion", "DALL-E 2", "Midjourney"];
const imageToTextModels = ["GPT-4 Vision", "CogVLM", "LLaVA"];

export default function Header() {
  const { user, isLoaded } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-md">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-white text-xl font-bold">
          GenImage
        </Link>

        <div className="flex items-center gap-6">
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
              Text to Image
              <ChevronDownIcon className="w-4 h-4" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {textToImageModels.map((model) => (
                    <Menu.Item key={model}>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active ? "bg-gray-100" : ""
                          } block px-4 py-2 text-sm text-gray-700`}
                        >
                          {model}
                        </a>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
              Image to Text
              <ChevronDownIcon className="w-4 h-4" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {imageToTextModels.map((model) => (
                    <Menu.Item key={model}>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active ? "bg-gray-100" : ""
                          } block px-4 py-2 text-sm text-gray-700`}
                        >
                          {model}
                        </a>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

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

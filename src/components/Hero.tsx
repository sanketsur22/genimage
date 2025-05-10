"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SignInButton, useAuth } from "@clerk/nextjs";

export default function Hero() {
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const handleNavigate = (mode: "text-to-image" | "image-to-text") => {
    if (mode === "text-to-image") {
      router.push("/text-to-image");
    } else {
      router.push("/image-to-text");
    }
  };

  const renderButton = (mode: "text-to-image" | "image-to-text") => {
    const buttonProps =
      mode === "text-to-image"
        ? {
            className:
              "bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105",
            children: "Text to Image",
          }
        : {
            className:
              "bg-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-purple-800 transition-all border border-white/20 transform hover:scale-105",
            children: "Image to Text",
          };

    if (!isSignedIn) {
      return (
        <SignInButton mode="modal">
          <button {...buttonProps} />
        </SignInButton>
      );
    }

    return <button {...buttonProps} onClick={() => handleNavigate(mode)} />;
  };

  return (
    <section
      id="hero"
      className="relative h-screen w-full bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden"
    >
      {/* Decorative floating elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-pink-400 to-red-500 rounded-full blur-xl opacity-50"
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          rotate: [0, -15, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full blur-xl opacity-40"
      />
      <motion.div
        animate={{
          y: [0, -25, 0],
          x: [0, 15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-green-400 to-teal-500 rounded-full blur-xl opacity-30"
      />

      <div className="container mx-auto px-4 h-full flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Transform Your Ideas Into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-300 to-cyan-200">
                Visual Magic
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-xl">
              Experience the power of AI to convert your text into stunning
              images or extract text from images with just a click.
            </p>
            <div className="flex flex-wrap gap-4">
              {renderButton("text-to-image")}
              {renderButton("image-to-text")}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-transparent rounded-3xl backdrop-blur-sm border border-white/10">
              <div className="absolute -top-4 -right-4 animate-pulse">
                <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 p-1 rounded-lg">
                  <Image
                    src="/window.svg"
                    alt="Window decoration"
                    width={100}
                    height={100}
                    className="opacity-90"
                  />
                </div>
              </div>
              <div className="h-full w-full flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full blur-2xl opacity-30 animate-pulse" />
                  <Image
                    src="/globe.svg"
                    alt="AI Generation"
                    width={320}
                    height={320}
                    className="animate-float relative z-10"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

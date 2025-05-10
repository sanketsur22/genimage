"use client";
import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

const models = [
  {
    name: "DALL·E 3",
    provider: "OpenAI",
    features: [
      "Highest quality photorealistic images",
      "Strong understanding of complex prompts",
      "Accurate text rendering",
      "Strong artistic capabilities",
    ],
    maxResolution: "1024×1024",
    speed: "Fast",
    highlighted: true,
  },
  {
    name: "Stable Diffusion XL",
    provider: "Stability AI",
    features: [
      "High-quality image generation",
      "Custom fine-tuning support",
      "Style consistency",
      "Open source",
    ],
    maxResolution: "1024×1024",
    speed: "Fast",
    highlighted: false,
  },
  {
    name: "Gemini",
    provider: "Google",
    features: [
      "Multimodal understanding",
      "Context-aware generation",
      "Natural prompt handling",
      "Integrated with Google ecosystem",
    ],
    maxResolution: "1024×1024",
    speed: "Medium",
    highlighted: false,
  },
];

export default function TextToImageFeatures() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 pt-16">
      <section className="py-16 bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Advanced Text-to-Image Models
            </h2>
            <p className="mt-4 text-xl text-white/80">
              Choose from our selection of cutting-edge AI models to bring your
              ideas to life
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
            {models.map((model) => (
              <div
                key={model.name}
                className={`relative rounded-2xl p-8 ${
                  model.highlighted
                    ? "bg-purple-600/20 ring-2 ring-purple-400 backdrop-blur-sm"
                    : "bg-white/10 backdrop-blur-sm"
                }`}
              >
                <div className="flex flex-col h-full">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    {model.name}
                    {model.highlighted && (
                      <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                        Recommended
                      </span>
                    )}
                  </h3>
                  <p className="text-purple-200/80 text-sm mt-1">
                    {model.provider}
                  </p>

                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-white/60">Resolution</span>
                      <span className="text-white">{model.maxResolution}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-white/60">Speed</span>
                      <span className="text-white">{model.speed}</span>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-4 flex-1">
                    {model.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckIcon className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <span className="text-white/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-white/5 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              Why Choose Our Text-to-Image Service?
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-white">
                  High Quality Output
                </h4>
                <p className="text-white/80">
                  Get stunning, high-resolution images that match your vision
                  with incredible detail and accuracy.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-white">
                  Multiple Models
                </h4>
                <p className="text-white/80">
                  Choose from various AI models, each with their unique
                  strengths and capabilities.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-white">
                  Fast Generation
                </h4>
                <p className="text-white/80">
                  Experience quick turnaround times with our optimized
                  infrastructure and efficient processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

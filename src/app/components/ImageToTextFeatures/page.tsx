import React from "react";
import { CheckIcon } from "@heroicons/react/24/solid";

const features = [
  {
    name: "Google Vision AI",
    provider: "Google Cloud",
    description:
      "Powered by Google Cloud Vision AI, this model excels at accurate text extraction from images with support for multiple languages and different text orientations.",
    strengths: [
      "High accuracy for printed text",
      "Multiple language support",
      "Handles complex layouts",
      "Good for business documents",
    ],
    bestFor: "Business documents, receipts, and multi-language content",
    highlighted: true,
  },
  {
    name: "Microsoft TrOCR",
    provider: "Microsoft",
    description:
      "Transformer-based OCR model that combines the power of transformers with optical character recognition for robust text extraction.",
    strengths: [
      "Advanced text recognition",
      "Works well with various fonts",
      "Handles handwritten text",
      "Good for natural scenes",
    ],
    bestFor: "Handwritten documents and natural scene text",
    highlighted: false,
  },
  {
    name: "Salesforce BLIP",
    provider: "Salesforce",
    description:
      "BLIP (Bootstrapping Language-Image Pre-training) model that excels at understanding the context and content within images.",
    strengths: [
      "Context-aware text extraction",
      "Good for complex scenes",
      "Natural language understanding",
      "Image-text alignment",
    ],
    bestFor: "Social media content and context-rich images",
    highlighted: false,
  },
  {
    name: "Donut Document Understanding",
    provider: "DonutAI",
    description:
      "Specialized in document understanding and structured text extraction from complex layouts.",
    strengths: [
      "Structured document analysis",
      "Form recognition",
      "Table extraction",
      "Maintains document structure",
    ],
    bestFor: "Forms, structured documents, and tables",
    highlighted: false,
  },
];

export default function ImageToTextFeatures() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 pt-16">
      <section className="py-16 bg-gradient-to-b from-purple-900/20 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Image to Text Features
            </h2>
            <p className="mt-4 text-xl text-white/80">
              Extract text from images using state-of-the-art AI models
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="group relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl transition-all duration-300 hover:bg-white/10 hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-semibold text-white">
                      {feature.name}
                    </h3>
                    {feature.highlighted && (
                      <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-purple-200/80 text-sm mb-2">
                    {feature.provider}
                  </p>
                  <p className="text-gray-400 mb-6">{feature.description}</p>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-purple-400 mb-3">
                        Key Strengths
                      </h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {feature.strengths.map((strength, idx) => (
                          <li
                            key={idx}
                            className="text-gray-400 text-sm flex items-center gap-2"
                          >
                            <CheckIcon className="h-4 w-4 text-purple-400 flex-shrink-0" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-purple-400">
                        Best For
                      </h4>
                      <p className="text-gray-400 mt-2 text-sm">
                        {feature.bestFor}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          <div className="mt-16 bg-white/5 backdrop-blur-sm rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6">
              Why Choose Our Image to Text Service?
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-white">
                  Advanced OCR Technology
                </h4>
                <p className="text-white/80">
                  Leverage cutting-edge OCR models to accurately extract text
                  from any type of image.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-white">
                  Multiple Models
                </h4>
                <p className="text-white/80">
                  Choose from various specialized models optimized for different
                  types of documents and use cases.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-white">
                  Fast Processing
                </h4>
                <p className="text-white/80">
                  Get quick results with our optimized infrastructure and
                  efficient text extraction pipeline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

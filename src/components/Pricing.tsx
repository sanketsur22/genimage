import React from "react";

const Pricing = () => {
  const tiers = [
    {
      name: "Free",
      price: "0",
      features: [
        "5 Image-to-Text conversions/month",
        "5 Text-to-Image generations/month",
        "Basic resolution support",
        "Standard processing speed",
      ],
      buttonText: "Get Started",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "9.99",
      features: [
        "100 Image-to-Text conversions/month",
        "100 Text-to-Image generations/month",
        "HD resolution support",
        "Priority processing",
        "Advanced customization options",
      ],
      buttonText: "Try Pro",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "29.99",
      features: [
        "Unlimited conversions",
        "Ultra HD resolution",
        "Instant processing",
        "API access",
        "Custom integration support",
        "Dedicated support",
      ],
      buttonText: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-16 bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-xl text-purple-100/80">
            Choose the perfect plan for your needs
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-8 transform transition-all duration-300 hover:scale-105 ${
                tier.highlighted
                  ? "bg-gradient-to-b from-purple-900/70 to-purple-800/60 ring-1 ring-purple-400/30 scale-105 backdrop-blur-sm shadow-xl"
                  : "bg-gradient-to-b from-purple-950/50 to-purple-900/40 backdrop-blur-sm hover:from-purple-900/60 hover:to-purple-800/50 shadow-lg"
              }`}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-purple-400/5 to-transparent"></div>
              <div className="relative flex flex-col h-full">
                <h3 className="text-xl font-semibold text-purple-100">
                  {tier.name}
                </h3>
                <p className="mt-4 flex items-baseline">
                  <span className="text-5xl font-bold tracking-tight text-white">
                    ${tier.price}
                  </span>
                  <span className="ml-1 text-sm font-semibold text-purple-200/80">
                    /month
                  </span>
                </p>
                <ul className="mt-8 space-y-4 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg
                        className="h-6 w-6 text-purple-300 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="ml-3 text-base text-purple-100/90">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-8 w-full rounded-xl px-4 py-3 text-sm font-semibold shadow-lg transition-all duration-300 ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-purple-400 to-purple-500 text-white hover:from-purple-500 hover:to-purple-600 transform hover:-translate-y-1"
                      : "bg-purple-800/40 text-purple-100 hover:bg-purple-700/50 backdrop-blur-sm transform hover:-translate-y-1"
                  }`}
                >
                  {tier.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

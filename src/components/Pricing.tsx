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
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect plan for your needs
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl shadow-xl p-8 ${
                tier.highlighted
                  ? "ring-2 ring-indigo-600 scale-105 bg-white"
                  : "bg-white"
              }`}
            >
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-semibold text-gray-900">
                  {tier.name}
                </h3>
                <p className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    ${tier.price}
                  </span>
                  <span className="ml-1 text-sm font-semibold text-gray-500">
                    /month
                  </span>
                </p>
                <ul className="mt-6 space-y-4 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg
                        className="h-6 w-6 text-green-500 flex-shrink-0"
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
                      <span className="ml-3 text-base text-gray-700">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-8 w-full rounded-md px-4 py-2 text-sm font-semibold shadow-sm ${
                    tier.highlighted
                      ? "bg-indigo-600 text-white hover:bg-indigo-500"
                      : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
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

import Image from "next/image";

export default function Features() {
  return (
    <section id="features" className="min-h-screen py-12 bg-gradient-to-br from-purple-500 to-indigo-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Powerful Features
          </h2>
          <p className="mt-4 text-xl text-white/80">
            Transform your ideas into reality with our advanced AI-powered tools
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Text to Image Feature */}
          <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-3">
              Text to Image Generation
            </h3>
            <p className="text-white/80 mb-4 text-sm">
              Transform your text descriptions into stunning visual artwork
              using state-of-the-art AI models.
            </p>
            <div className="aspect-video relative rounded-xl overflow-hidden border border-white/20">
              <Image
                src="/text-to-image-demo.gif"
                alt="Text to Image Demo"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Image to Text Feature */}
          <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-3">
              Image to Text Analysis
            </h3>
            <p className="text-white/80 mb-4 text-sm">
              Upload any image and get detailed descriptions and analysis
              powered by advanced AI vision models.
            </p>
            <div className="aspect-video relative rounded-xl overflow-hidden border border-white/20">
              <Image
                src="/image-to-text-demo.gif"
                alt="Image to Text Demo"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl p-6 border border-white/10 group">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white">
                Multiple AI Models
              </h4>
              <p className="text-white/70 text-sm">
                Choose from various state-of-the-art options for the perfect
                results
              </p>
            </div>
          </div>

          <div className="backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl p-6 border border-white/10 group">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white">
                Real-time Generation
              </h4>
              <p className="text-white/70 text-sm">
                Watch your ideas transform into visuals in real-time
              </p>
            </div>
          </div>

          <div className="backdrop-blur-sm bg-white/5 hover:bg-white/10 transition-all duration-300 rounded-xl p-6 border border-white/10 group">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white">Chat History</h4>
              <p className="text-white/70 text-sm">
                Access your past generations and conversations anytime
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-gradient-to-br from-pink-400 to-red-500 rounded-full blur-xl opacity-30" />
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full blur-xl opacity-20" />
      </div>
    </section>
  );
}

import React from "react";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    title: "One Tap Download",
    description: "Paste any video link and download with a single tap. No complex steps.",
    icon: "download",
  },
  {
    title: "Saves to Your Photos",
    description: "Videos go straight to your Camera Roll. Access them anytime, anywhere.",
    icon: "photos",
  },
  {
    title: "No Watermarks",
    description: "Clean downloads every time. No watermarks, no account required, no limits.",
    icon: "sparkles",
  },
];

const steps = [
  {
    step: "01",
    title: "Copy the Video Link",
    description: "Find the video you want and copy its URL from any app or browser.",
  },
  {
    step: "02",
    title: "Paste it in VidPlus",
    description: "Open VidPlus and paste the link. We handle all the formats automatically.",
  },
  {
    step: "03",
    title: "Save to Photos",
    description: "Tap download and the video is saved to your Camera Roll instantly.",
  },
];

function Icon({ name }: { name: string }) {
  const icons: Record<string, React.JSX.Element> = {
    download: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V8" />
      </svg>
    ),
    photos: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    sparkles: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  };
  return icons[name] || null;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-zinc-800/50 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/app-icon-512.png"
              alt="VidPlus"
              width={40}
              height={40}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-white">
              VidPlus<span className="bg-gradient-to-r from-[#F7CB1C] to-[#FFAE00] bg-clip-text text-transparent">.io</span>
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="hidden text-sm font-medium text-zinc-400 transition-colors hover:text-white sm:block"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hidden text-sm font-medium text-zinc-400 transition-colors hover:text-white sm:block"
            >
              How It Works
            </a>
            <a
              href="#pricing"
              className="hidden text-sm font-medium text-zinc-400 transition-colors hover:text-white sm:block"
            >
              Pricing
            </a>
            <a
              href="#how-it-works"
              className="hidden text-sm font-medium text-zinc-400 transition-colors hover:text-white sm:block"
            >
              Download
            </a>
            <a
              href="#"
              className="rounded-full bg-gradient-to-r from-[#F7CB1C] to-[#FFAE00] px-4 py-2 text-sm font-semibold text-black transition-all hover:from-[#FFAE00] hover:to-[#F7CB1C]"
            >
              Get the App
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center px-4 pt-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7CB1C]/5 via-transparent to-transparent" />
        
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Download Any Video,{" "}
            <span className="bg-gradient-to-r from-[#F7CB1C] to-[#FFAE00] bg-clip-text text-transparent">
              Instantly
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400 sm:text-xl">
            Save videos from anywhere to your iPhone. Fast, clean, no limits.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-[#F7CB1C] to-[#FFAE00] px-8 py-4 font-semibold text-black transition-all hover:from-[#FFAE00] hover:to-[#F7CB1C] hover:shadow-lg hover:shadow-[#F7CB1C]/25"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download on the App Store
            </a>
            <a
              href="#features"
              className="rounded-full border border-zinc-700 bg-transparent px-8 py-4 font-semibold text-white transition-all hover:border-[#F7CB1C] hover:text-[#F7CB1C]"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Everything You Need
            </h2>
            <p className="mx-auto max-w-2xl text-zinc-400">
              Built for speed, simplicity, and getting the job done.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900/30 p-8 transition-all hover:border-[#F7CB1C]/30 hover:bg-zinc-900/50"
              >
                <div className="mb-6 inline-flex rounded-xl bg-gradient-to-br from-[#F7CB1C]/20 to-[#FFAE00]/10 p-4 text-[#F7CB1C]">
                  <Icon name={feature.icon} />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-zinc-400">
              Three simple steps to download any video.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((item, index) => (
              <div key={item.step} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-12 left-1/2 hidden h-0.5 w-full bg-gradient-to-r from-[#F7CB1C]/50 to-transparent md:block" />
                )}
                <div className="relative flex flex-col items-center text-center">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#F7CB1C]/30 bg-zinc-900/50">
                    <span className="bg-gradient-to-r from-[#F7CB1C] to-[#FFAE00] bg-clip-text text-3xl font-bold text-transparent">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="max-w-xs text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900/50 to-zinc-900/20 p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Ready to Start Downloading?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-zinc-400">
            Join thousands of users who trust VidPlus for their video downloads.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#F7CB1C] to-[#FFAE00] px-8 py-4 font-semibold text-black transition-all hover:from-[#FFAE00] hover:to-[#F7CB1C] hover:shadow-lg hover:shadow-[#F7CB1C]/25"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Download on the App Store
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center">
              <span className="bg-gradient-to-r from-[#F7CB1C] to-[#FFAE00] bg-clip-text text-xl font-bold text-transparent">
                VidPlus
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <a href="#" className="text-zinc-400 transition-colors hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="text-zinc-400 transition-colors hover:text-white">
                Terms of Use
              </a>
              <a href="#" className="text-zinc-400 transition-colors hover:text-white">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-zinc-500">
            2025 VidPlus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

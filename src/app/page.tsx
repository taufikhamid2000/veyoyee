"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import AliBitlifeStory from "@/components/landing/AliBitlifeStory";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PhaseRolloutSection from "@/components/landing/PhaseRolloutSection";
import WhyVeyoyeeSection from "@/components/landing/WhyVeyoyeeSection";
import KeyBenefitsSection from "@/components/landing/KeyBenefitsSection";
import Testimonial from "@/components/landing/Testimonial";
import Image from "next/image";

// FAQ Section
const FAQ = () => (
  <div className="max-w-3xl mx-auto mt-8 mb-12">
    <div className="flex flex-col items-center mb-6 md:mb-8">
      <span className="inline-block px-3 md:px-4 py-0.5 rounded-full bg-blue-900 text-blue-300 font-medium text-xs md:text-sm mb-4 md:mb-6">
        FAQ
      </span>
      <h3 className="text-2xl md:text-4xl font-bold text-white text-center leading-snug">
        Frequently Asked Questions
      </h3>
    </div>
    <div className="flex flex-col gap-2 md:gap-4">
      <div className="bg-gray-800 rounded-lg p-2 md:p-4 mb-2 md:mb-4 border border-gray-700 max-w-xs md:max-w-2xl mx-auto md:mx-0 w-full">
        <div className="font-semibold text-blue-300 mb-1 md:mb-2 text-xs md:text-base">
          Isn’t this just another survey swap site?
        </div>
        <div className="text-gray-300 text-xs md:text-base">
          No. Veyoyee is built for academic, nonprofit, and commercial
          researchers who care about quality, ethics, and real impact. We go far
          beyond simple swaps with advanced quality control, real rewards, and a
          research-driven community.
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg p-2 md:p-4 mb-2 md:mb-4 border border-gray-700 max-w-xs md:max-w-2xl mx-auto md:mx-0 w-full">
        <div className="font-semibold text-blue-300 mb-1 md:mb-2 text-xs md:text-base">
          Can’t people just use AI to fill out surveys?
        </div>
        <div className="text-gray-300 text-xs md:text-base">
          We use advanced AI/bot detection, reputation systems, and response
          validation to ensure your data comes from real, thoughtful humans. Our
          platform is designed to protect research integrity.
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg p-2 md:p-4 mb-2 md:mb-4 border border-gray-700 max-w-xs md:max-w-2xl mx-auto md:mx-0 w-full">
        <div className="font-semibold text-blue-300 mb-1 md:mb-2 text-xs md:text-base">
          Is Veyoyee only for universities?
        </div>
        <div className="text-gray-300 text-xs md:text-base">
          No! While we’re built for academic and nonprofit research, commercial
          and business users are welcome. Everyone benefits from our focus on
          quality and ethics.
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg p-2 md:p-4 mb-2 md:mb-4 border border-gray-700 max-w-xs md:max-w-2xl mx-auto md:mx-0 w-full">
        <div className="font-semibold text-blue-300 mb-1 md:mb-2 text-xs md:text-base">
          How are participants rewarded?
        </div>
        <div className="text-gray-300 text-xs md:text-base">
          Participants receive transparent, fair rewards for their time and
          input—no confusing points or fake credits. Our system is designed for
          trust and fairness.
        </div>
      </div>
    </div>
  </div>
);

// Mouse-following blob effect
const MouseBlobEffect = () => {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setPos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 -z-10 pointer-events-none">
      <svg
        width="100%"
        height="100%"
        className="w-full h-full"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <defs>
          <radialGradient id="blob-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
          </radialGradient>
        </defs>
        <ellipse
          cx={`${pos.x * 100}%`}
          cy={`${pos.y * 100}%`}
          rx="340"
          ry="220"
          fill="url(#blob-gradient)"
          filter="blur(60px)"
        />
      </svg>
    </div>
  );
};

// Trusted By logos (placeholder)
const TrustedBy = () => (
  <div className="w-full flex flex-col items-center my-8">
    <span className="text-xs md:text-sm text-gray-400 mb-2">
      Trusted by researchers at
    </span>
    <div className="flex flex-wrap gap-6 justify-center items-center opacity-80">
      <div className="bg-white/10 rounded-lg px-4 py-2 flex items-center min-w-[100px] min-h-[40px]">
        <span className="text-gray-200 font-bold text-lg">Uni A</span>
      </div>
      <div className="bg-white/10 rounded-lg px-4 py-2 flex items-center min-w-[100px] min-h-[40px]">
        <span className="text-gray-200 font-bold text-lg">Company B</span>
      </div>
      <div className="bg-white/10 rounded-lg px-4 py-2 flex items-center min-w-[100px] min-h-[40px]">
        <span className="text-gray-200 font-bold text-lg">Nonprofit C</span>
      </div>
      <div className="bg-white/10 rounded-lg px-4 py-2 flex items-center min-w-[100px] min-h-[40px]">
        <span className="text-gray-200 font-bold text-lg">Uni D</span>
      </div>
    </div>
  </div>
);

// Carousel for testimonials
const CarouselTestimonials = () => {
  const testimonials = [
    {
      name: "Dr. Jane Smith",
      role: "Professor of Sociology",
      org: "University A",
      text: "Veyoyee is a game-changer for academic research. The data quality and ethical standards are unmatched.",
    },
    {
      name: "Alex Kim",
      role: "Market Research Lead",
      org: "Company C",
      text: "We finally found a platform that delivers real, actionable insights—not just empty survey responses.",
    },
    {
      name: "Maria Lopez",
      role: "Nonprofit Researcher",
      org: "Nonprofit B",
      text: "The transparent rewards and community focus make Veyoyee stand out. Our participants love it!",
    },
    {
      name: "Dr. Ravi Patel",
      role: "Research Director",
      org: "University D",
      text: "I was worried about AI-faked responses, but Veyoyee’s protections gave me total confidence in my data.",
    },
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setIdx((i) => (i + 1) % testimonials.length),
      4000
    );
    return () => clearInterval(timer);
  }, [testimonials.length]);
  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full min-h-[170px] md:min-h-[220px] max-w-xs md:max-w-xl mx-auto flex items-center justify-center">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className={`absolute left-0 right-0 transition-opacity duration-700 flex justify-center ${
              i === idx
                ? "opacity-100 z-10 pointer-events-auto"
                : "opacity-0 z-0 pointer-events-none"
            }`}
            style={{
              display: i === idx ? "flex" : "none",
            }}
          >
            <Testimonial {...t} />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2 mt-4 relative z-20">
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${
              i === idx ? "bg-blue-400" : "bg-gray-600"
            } transition`}
            onClick={() => setIdx(i)}
            aria-label={`Show testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  // Icon components
  const CheckIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
  const TimeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 6v6l4 2"></path>
    </svg>
  );
  const ShieldIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  );
  const AcademicIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  );

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Enhanced Hero Section */}
      <section className="relative min-h-[70vh] py-16 md:py-32 w-full overflow-hidden flex flex-col justify-center">
        <div className="absolute inset-0 -z-20 animate-gradient-x bg-gradient-to-tr from-blue-800 via-indigo-900 to-blue-600 opacity-70 blur-2xl" />
        <MouseBlobEffect />
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-center gap-0 md:gap-x-16">
          <div className="w-full md:w-1/2 flex justify-center md:justify-end mb-10 md:mb-0 self-center md:pr-8">
            <Image
              src="/assets/ChatGPT Image Jul 16, 2025, 03_18_06 PM.png"
              alt="Researchers collaborating illustration"
              width={480}
              height={320}
              className="object-contain w-full max-w-[420px] h-auto drop-shadow-xl rounded-2xl border-2 border-blue-900/30"
              priority
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left self-center md:pl-8 max-w-xl">
            <span className="mb-4 inline-block px-4 py-1 rounded-full bg-blue-900/80 text-blue-200 text-xs md:text-sm font-semibold tracking-wide shadow">
              For Researchers & Organizations
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white tracking-tight drop-shadow-lg leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-300 bg-clip-text text-transparent">
                Research
              </span>{" "}
              That <span className="text-blue-300">Rewards</span> Everyone
            </h1>
            <p className="text-base md:text-xl text-blue-100 mb-6 max-w-xl font-medium">
              <span className="text-white/90">Veyoyee</span> connects
              researchers with quality respondents through{" "}
              <span className="font-semibold text-blue-200">
                fair incentives
              </span>
              .<br className="hidden md:block" /> Create surveys, reward
              participants, and get better data—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center md:justify-start">
              <a
                href="/surveyor"
                className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition text-lg md:text-xl transform hover:scale-105 flex items-center gap-2 group text-center border-2 border-blue-300/30"
              >
                <span>Start Your First Survey</span>
                <svg
                  className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
              <a
                href="#how"
                className="bg-white/10 hover:bg-white/20 text-blue-200 px-8 py-4 rounded-xl font-semibold shadow transition text-lg md:text-xl flex items-center gap-2 border-2 border-blue-300/10"
              >
                <span>See How It Works</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 5v14m7-7H5"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <TrustedBy />
      </section>

      {/* Problem Statement Section as Interactive Bitlife Story */}
      <AliBitlifeStory />

      {/* How It Works Section (componentized) */}
      <HowItWorksSection />

      {/* Phase Rollout Section (componentized) */}
      <PhaseRolloutSection />

      {/* Why Veyoyee is Different (componentized) */}
      <WhyVeyoyeeSection />

      {/* Features Section (componentized) */}
      <KeyBenefitsSection
        CheckIcon={CheckIcon}
        TimeIcon={TimeIcon}
        ShieldIcon={ShieldIcon}
        AcademicIcon={AcademicIcon}
      />

      {/* Testimonials Section */}
      <div
        id="testimonials"
        className="w-full bg-gradient-to-b from-blue-950 to-indigo-950 py-[40px] md:py-[100px] px-4 md:px-6"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center mb-6 md:mb-10">
            <span className="inline-block px-3 md:px-4 py-0.5 rounded-full bg-blue-900 text-blue-300 font-medium text-xs md:text-sm mb-4 md:mb-6">
              Testimonials
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-snug text-center">
              What Our Users Say
            </h2>
          </div>
          <CarouselTestimonials />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full bg-gradient-to-b from-indigo-950 to-blue-900 py-[40px] md:py-[100px] px-4 md:px-6">
        <FAQ />
      </div>

      {/* Final CTA Section */}
      <div className="w-full bg-gradient-to-b from-blue-900 to-blue-950 py-[80px] md:py-[140px] px-4 md:px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="flex flex-col items-center mb-6 md:mb-8">
            <span className="inline-block px-3 md:px-4 py-0.5 rounded-full bg-blue-900 text-blue-300 font-medium text-xs md:text-sm mb-4 md:mb-6">
              Get Started
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-snug text-center">
              Ready to Get Real, Reliable Survey Data?
            </h2>
          </div>
          <p className="text-base md:text-lg text-blue-100 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
            Join the growing community of researchers using Veyoyee to get
            better data and reward participants fairly.
          </p>
          <Link
            href="/auth/signup"
            className="transform transition-transform duration-300 hover:scale-105 inline-block"
          >
            <Button
              variant="primary"
              size="lg"
              className="bg-white text-blue-100 hover:bg-blue-50 px-8 py-4 text-base md:text-lg font-medium shadow-xl flex items-center gap-2"
            >
              <span>Start Your First Survey</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

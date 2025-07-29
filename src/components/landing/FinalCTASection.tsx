import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";

const FinalCTASection: React.FC = () => (
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
        Join the growing community of researchers using Veyoyee to get better
        data and reward participants fairly.
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
);

export default FinalCTASection;

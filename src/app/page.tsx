"use client";

import React from "react";
import AliBitlifeStory from "@/components/landing/AliBitlifeStory";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PhaseRolloutSection from "@/components/landing/PhaseRolloutSection";
import WhyVeyoyeeSection from "@/components/landing/WhyVeyoyeeSection";
import KeyBenefitsSection from "@/components/landing/KeyBenefitsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import FinalCTASection from "@/components/landing/FinalCTASection";
import HeroSection from "@/components/landing/HeroSection";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <HeroSection />

      <AliBitlifeStory />

      <HowItWorksSection />

      <PhaseRolloutSection />

      <WhyVeyoyeeSection />

      <KeyBenefitsSection />

      <TestimonialsSection />

      <FAQSection />

      <FinalCTASection />
    </div>
  );
}

export default Home;

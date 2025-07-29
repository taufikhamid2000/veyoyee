import React from "react";

const FAQSection = () => (
  <section className="w-full bg-gradient-to-b from-indigo-950 to-blue-900 py-[40px] md:py-[100px] px-4 md:px-6">
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
            researchers who care about quality, ethics, and real impact. We go
            far beyond simple swaps with advanced quality control, real rewards,
            and a research-driven community.
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2 md:p-4 mb-2 md:mb-4 border border-gray-700 max-w-xs md:max-w-2xl mx-auto md:mx-0 w-full">
          <div className="font-semibold text-blue-300 mb-1 md:mb-2 text-xs md:text-base">
            Can’t people just use AI to fill out surveys?
          </div>
          <div className="text-gray-300 text-xs md:text-base">
            We use advanced AI/bot detection, reputation systems, and response
            validation to ensure your data comes from real, thoughtful humans.
            Our platform is designed to protect research integrity.
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2 md:p-4 mb-2 md:mb-4 border border-gray-700 max-w-xs md:max-w-2xl mx-auto md:mx-0 w-full">
          <div className="font-semibold text-blue-300 mb-1 md:mb-2 text-xs md:text-base">
            Is Veyoyee only for universities?
          </div>
          <div className="text-gray-300 text-xs md:text-base">
            No! While we’re built for academic and nonprofit research,
            commercial and business users are welcome. Everyone benefits from
            our focus on quality and ethics.
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-2 md:p-4 mb-2 md:mb-4 border border-gray-700 max-w-xs md:max-w-2xl mx-auto md:mx-0 w-full">
          <div className="font-semibold text-blue-300 mb-1 md:mb-2 text-xs md:text-base">
            How are participants rewarded?
          </div>
          <div className="text-gray-300 text-xs md:text-base">
            Participants receive transparent, fair rewards for their time and
            input—no confusing points or fake credits. Our system is designed
            for trust and fairness.
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default FAQSection;

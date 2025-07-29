import React from "react";

const StepCard = ({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) => (
  <div className="relative bg-gray-800 p-1 md:p-8 rounded-2xl shadow-lg border border-gray-700 z-10 max-w-xs mx-auto w-full">
    <div className="absolute -top-3 md:-top-5 -left-3 md:-left-5 bg-gradient-to-r from-blue-600 to-indigo-700 w-7 h-7 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xs md:text-xl font-bold shadow-md">
      <span className="text-white">{number}</span>
    </div>
    <div className="mt-2 md:mt-5">
      <h3 className="text-sm md:text-2xl font-bold mb-1 md:mb-4 text-white">
        {title}
      </h3>
      <p className="text-xs md:text-base text-gray-300 font-medium">
        {description}
      </p>
    </div>
  </div>
);

export default function HowItWorksSection() {
  return (
    <div
      id="how"
      className="w-full bg-gradient-to-b from-indigo-950 to-blue-900 py-[40px] md:py-[100px] px-4 md:px-6 relative"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center mb-6 md:mb-8">
          <span className="inline-block px-3 md:px-4 py-0.5 rounded-full bg-blue-900 text-blue-300 font-medium text-xs md:text-sm mb-4 md:mb-6">
            How It Works
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-snug text-center">
            How Veyoyee Works
          </h2>
        </div>
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 transform -translate-y-1/2 z-0"></div>
          <div className="grid md:grid-cols-3 gap-4 md:gap-12 relative z-10">
            <StepCard
              number={1}
              title="Create Your Survey"
              description="Design professional surveys with our intuitive builder. Set real rewards to attract quality participants."
            />
            <StepCard
              number={2}
              title="Collect Real Responses"
              description="Participants complete your survey and receive transparent, fair rewards. AI/bot protection ensures data quality."
            />
            <StepCard
              number={3}
              title="Analyze & Share Results"
              description="Access high-quality data, advanced analytics, and export options. Participants cash out their earned rewards."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

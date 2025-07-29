import React from "react";

const FeatureItem = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="group flex flex-col items-center text-center p-2 md:p-6 bg-gray-800/50 rounded-xl shadow-lg border border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm max-w-xs mx-auto w-full">
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full flex-shrink-0 mb-6 shadow-md transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-blue-500/50">
      <div className="text-white w-8 h-8">{icon}</div>
    </div>
    <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3 text-gray-100 group-hover:text-blue-400 transition-colors duration-300">
      {title}
    </h3>
    <p className="text-xs md:text-base text-gray-300 font-medium">
      {description}
    </p>
  </div>
);

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

const KeyBenefitsSection = () => (
  <div
    id="features"
    className="w-full bg-gradient-to-b from-blue-900 to-blue-950 py-[40px] md:py-[100px] px-4 md:px-6"
  >
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col items-center mb-6 md:mb-8">
        <span className="inline-block px-3 md:px-4 py-0.5 rounded-full bg-blue-900 text-blue-300 font-medium text-xs md:text-sm mb-4 md:mb-6">
          Key Benefits
        </span>
        <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-snug text-center">
          Why Researchers Choose Veyoyee
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        <FeatureItem
          icon={<CheckIcon />}
          title="Higher Quality Data"
          description="Advanced validation, reputation, and AI/bot protection ensure real, thoughtful responses."
        />
        <FeatureItem
          icon={<TimeIcon />}
          title="Time-Saving"
          description="Streamlined survey creation, automated reward distribution, and built-in analytics save valuable time."
        />
        <FeatureItem
          icon={<ShieldIcon />}
          title="Ethical & Secure"
          description="Built with data protection, privacy, and ethical research standards at its core."
        />
        <FeatureItem
          icon={<AcademicIcon />}
          title="Academic & Commercial"
          description="Designed for universities, nonprofits, and businesses—flexible for any research need."
        />
      </div>
    </div>
  </div>
);

export default KeyBenefitsSection;

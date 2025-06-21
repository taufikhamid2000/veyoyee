import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";
// import Image from "next/image";

// Feature Item component for reusability
const FeatureItem = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="group flex flex-col items-center text-center p-6 bg-gray-800/50 rounded-xl shadow-lg border border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm">
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full flex-shrink-0 mb-6 shadow-md transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-blue-500/50">
      <div className="text-white w-8 h-8">{icon}</div>
    </div>
    <h3 className="text-xl font-bold mb-3 text-gray-100 group-hover:text-blue-400 transition-colors duration-300">
      {title}
    </h3>
    <p className="text-gray-300 font-medium">{description}</p>
  </div>
);

// Step card component for the how it works section
const StepCard = ({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) => (
  <div className="relative bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700 z-10">
    <div className="absolute -top-5 -left-5 bg-gradient-to-r from-blue-600 to-indigo-700 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold shadow-md">
      <span className="text-white">{number}</span>
    </div>
    <div className="mt-5">
      <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-gray-300 font-medium">{description}</p>
    </div>
  </div>
);

export default function Home() {
  // Icon components for better React approach
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
      {" "}
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-blue-950 to-indigo-950 py-20">
        <div className="max-w-6xl mx-auto text-center px-6 relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 overflow-hidden">
            <svg
              className="absolute -top-24 -left-24 text-blue-500 w-64 h-64 opacity-20"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M31.2,-51.1C40.1,-41.9,47,-32.1,53.2,-21.1C59.4,-10,64.8,2.2,62.5,13C60.1,23.9,50.1,33.4,39,41.4C28,49.4,16,55.8,2.4,58.7C-11.2,61.7,-25.4,61.1,-35,53.9C-44.5,46.7,-49.3,33,-54.2,19.5C-59,6.1,-64,-7.1,-63.1,-21.2C-62.2,-35.3,-55.5,-50.3,-44.4,-59.4C-33.4,-68.6,-17.7,-71.8,-3.2,-68C11.2,-64.1,22.4,-53.1,31.2,-51.1Z"
                transform="translate(100 100)"
              />
            </svg>
            <svg
              className="absolute -bottom-24 -right-24 text-indigo-500 w-64 h-64 opacity-20"
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="currentColor"
                d="M44.3,-76.5C58.3,-69.3,70.9,-58.3,79.8,-44.5C88.7,-30.7,93.9,-14.3,92.1,1.1C90.2,16.5,81.3,32,71.9,47.6C62.4,63.3,52.4,79.1,38.4,82.7C24.3,86.3,6.1,77.6,-9.5,69.8C-25,61.9,-38,54.9,-42.5,42.6C-47.1,30.3,-43.4,12.8,-42.4,-3.9C-41.5,-20.5,-43.3,-36.3,-37.7,-44.4C-32.2,-52.5,-19.4,-52.9,-5.8,-56.2C7.7,-59.6,17.7,-66.1,30.4,-73.7"
                transform="translate(100 100)"
              />
            </svg>
          </div>{" "}
          <div className="inline-block bg-blue-900/30 px-5 py-2 rounded-full text-sm font-semibold mb-8 shadow-md backdrop-blur-sm">
            <span className="text-blue-200">
              For Academic & Nonprofit Researchers
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight">
            <span className="text-blue-300">
              Research That Rewards Everyone
            </span>
          </h1>
          <p className="text-xl text-white mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            Veyoyee connects researchers with quality respondents through fair
            incentives. Create surveys, reward participants, and get better
            data—all in one place.
          </p>{" "}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
            <Link
              href="/auth/signup"
              className="transform transition-transform duration-300 hover:scale-105"
            >
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-8 py-3 text-lg font-medium shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Started for Free
              </Button>
            </Link>
            <Link
              href="/auth/signin"
              className="transform transition-transform duration-300 hover:scale-105"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 py-3 text-lg font-medium bg-transparent border-white text-white hover:bg-white/10"
              >
                Sign In
              </Button>
            </Link>
          </div>
          <div className="text-sm font-medium text-gray-300 bg-transparent rounded-full px-4 py-2 inline-block backdrop-blur-sm">
            No credit card required to start
          </div>
        </div>
      </div>{" "}
      {/* How It Works Section */}
      <div className="w-full bg-gray-900 py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          {" "}
          <div className="mb-16 text-center">
            <span className="inline-block px-4 py-1 rounded-full bg-blue-900 text-blue-300 font-medium text-sm mb-4">
              Simple Process
            </span>
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-5">
              How Veyoyee Works
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our streamlined process makes research more efficient and
              rewarding for everyone involved.
            </p>
          </div>
          <div className="relative">
            {/* Connection lines between steps */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 transform -translate-y-1/2 z-0"></div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative z-10">
              <StepCard
                number={1}
                title="Create Your Survey"
                description="Design professional surveys with our intuitive builder. Set rewards that attract quality participants."
              />

              <StepCard
                number={2}
                title="Collect Responses"
                description="Participants complete your survey and automatically receive tokens for their time and input."
              />

              <StepCard
                number={3}
                title="Analyze Results"
                description="Access high-quality data and insights while participants cash out their earned rewards."
              />
            </div>
          </div>
        </div>
      </div>{" "}
      {/* Features Section */}
      <div className="w-full bg-gradient-to-br from-gray-950 to-blue-950 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          {" "}
          <div className="mb-16 text-center">
            <span className="inline-block px-4 py-1 rounded-full bg-blue-900 text-blue-300 font-medium text-sm mb-4">
              Key Benefits
            </span>
            <h2 className="text-4xl font-extrabold text-white tracking-tight mb-5">
              Why Choose Veyoyee
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our platform is designed with researchers in mind, offering
              benefits that matter.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureItem
              icon={<CheckIcon />}
              title="Higher Response Rates"
              description="Fair compensation incentivizes participation and leads to more complete, thoughtful responses."
            />

            <FeatureItem
              icon={<TimeIcon />}
              title="Time-Saving"
              description="Streamlined survey creation and automated reward distribution saves valuable research time."
            />

            <FeatureItem
              icon={<ShieldIcon />}
              title="Secure & Ethical"
              description="Built with data protection and ethical research standards at its core."
            />

            <FeatureItem
              icon={<AcademicIcon />}
              title="Academic Focus"
              description="Designed specifically for academic and nonprofit researchers with features that matter to you."
            />
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 py-20 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            Ready to Transform Your Research?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
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
              className="bg-white text-blue-100 hover:bg-blue-50 px-8 py-6 text-lg font-medium shadow-xl"
            >
              Start Your First Survey
            </Button>
          </Link>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg
            className="absolute -top-24 -right-24 text-white w-96 h-96"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M44.3,-76.5C58.3,-69.3,70.9,-58.3,79.8,-44.5C88.7,-30.7,93.9,-14.3,92.1,1.1C90.2,16.5,81.3,32,71.9,47.6C62.4,63.3,52.4,79.1,38.4,82.7C24.3,86.3,6.1,77.6,-9.5,69.8C-25,61.9,-38,54.9,-42.5,42.6C-47.1,30.3,-43.4,12.8,-42.4,-3.9C-41.5,-20.5,-43.3,-36.3,-37.7,-44.4C-32.2,-52.5,-19.4,-52.9,-5.8,-56.2C7.7,-59.6,17.7,-66.1,30.4,-73.7"
              transform="translate(100 100)"
            />
          </svg>
          <svg
            className="absolute -bottom-24 -left-24 text-white w-96 h-96"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="currentColor"
              d="M31.2,-51.1C40.1,-41.9,47,-32.1,53.2,-21.1C59.4,-10,64.8,2.2,62.5,13C60.1,23.9,50.1,33.4,39,41.4C28,49.4,16,55.8,2.4,58.7C-11.2,61.7,-25.4,61.1,-35,53.9C-44.5,46.7,-49.3,33,-54.2,19.5C-59,6.1,-64,-7.1,-63.1,-21.2C-62.2,-35.3,-55.5,-50.3,-44.4,-59.4C-33.4,-68.6,-17.7,-71.8,-3.2,-68C11.2,-64.1,22.4,-53.1,31.2,-51.1Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

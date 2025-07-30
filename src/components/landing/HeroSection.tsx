import React from "react";
import Image from "next/image";

const MouseBlobEffect = () => {
  const [pos, setPos] = React.useState({ x: 0.5, y: 0.5 });
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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

const HeroSection: React.FC = () => (
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
          <span className="text-white/90">Veyoyee</span> connects researchers
          with quality respondents through{" "}
          <span className="font-semibold text-blue-200">fair incentives</span>
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
            href="/pricing"
            className="bg-white/10 hover:bg-white/20 text-blue-200 px-8 py-4 rounded-xl font-semibold shadow transition text-lg md:text-xl flex items-center gap-2 border-2 border-blue-300/10"
          >
            <span>Would you like to buy the project?</span>
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
);

export default HeroSection;

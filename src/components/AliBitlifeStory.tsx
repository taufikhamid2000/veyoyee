import React, { useState } from "react";

type StepType = 0 | 1 | "quality" | "none" | "nonquality";

const aliSlideTitles = ["Meet Ali", "Ali's University Journey"];

const aliSlideContents = [
  <p key="slide-1">
    This is Ali. He’s a first-year university student, excited to start his
    journey. Early on, Ali is introduced to <b>Veyoyee</b>, a survey swapping
    platform that helps students collect quality responses for their research
    projects.
  </p>,
  <p key="slide-2">
    Ali learns that to create his own survey on Veyoyee, he needs a{" "}
    <b>Survey Creation Pass (SCP)</b>. To earn an SCP, he must answer 100
    different surveys with responses accepted by the survey owners. Ali now
    faces a choice throughout his university years...
  </p>,
];

const dilemmaText = (
  <p>What does Ali do during his first, second, and third year?</p>
);

const outcomes = {
  quality: {
    title: "Ali Earns His SCP",
    text: (
      <>
        <p>
          Ali answers 100 surveys over his first, second, and third year, always
          providing thoughtful, quality responses. Each response is accepted by
          the survey owners.
          <br />
          By his final year, Ali claims his <b>
            Survey Creation Pass (SCP)
          </b>{" "}
          and is able to create his own survey on Veyoyee. He easily collects
          quality responses for his research and impresses his supervisor!
        </p>
        <div className="text-green-400 font-bold mt-4">
          Outcome: Ali gets his SCP and completes his research successfully!
        </div>
      </>
    ),
  },
  none: {
    title: "Ali Misses Out on the SCP",
    text: (
      <>
        <p>
          Ali ignores the advice and doesn’t answer enough surveys. When his
          final year arrives, he can’t claim a Survey Creation Pass (SCP).
          <br />
          He struggles to find quality respondents for his research, and his
          project suffers as a result.
        </p>
        <div className="text-red-400 font-bold mt-4">
          Outcome: Ali couldn&apos;t get an SCP and struggled to collect
          responses.
        </div>
      </>
    ),
  },
  nonquality: {
    title: "Ali Tries to Game the System",
    text: (
      <>
        <p>
          Ali answers 100 surveys, but rushes through them with low-effort or
          irrelevant responses. Most of his answers are rejected by the survey
          owners.
          <br />
          When it’s time to claim his SCP, Ali doesn’t qualify. He can’t create
          his own survey and struggles to get the data he needs.
        </p>
        <div className="text-yellow-400 font-bold mt-4">
          Outcome: Ali didn&apos;t get an SCP due to poor quality responses.
        </div>
      </>
    ),
  },
};

export default function AliBitlifeStory() {
  const [step, setStep] = useState<StepType>(0); // 0, 1 (dilemma), 'quality', 'none', 'nonquality'

  if (step === "quality" || step === "none" || step === "nonquality") {
    const outcome = outcomes[step];
    return (
      <section className="w-full bg-gradient-to-b from-blue-950 to-indigo-950 py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <span className="inline-block px-3 md:px-4 py-0.5 rounded-full bg-red-900 text-red-200 font-medium text-xs md:text-sm mb-4 md:mb-6">
            The Outcome
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-snug mb-4">
            {outcome.title}
          </h2>
          <div className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed min-h-[80px] flex flex-col items-center justify-center">
            {outcome.text}
          </div>
          <button
            className="mt-8 px-6 py-3 rounded-xl bg-blue-800 text-white font-bold shadow hover:bg-blue-700 transition"
            onClick={() => setStep(0)}
          >
            Restart Story
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gradient-to-b from-blue-950 to-indigo-950 py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        <span className="inline-block px-3 md:px-4 py-0.5 rounded-full bg-red-900 text-red-200 font-medium text-xs md:text-sm mb-4 md:mb-6">
          The Problem
        </span>
        <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-snug mb-4">
          {aliSlideTitles[step as number]}
        </h2>
        <div className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed min-h-[80px] flex flex-col items-center justify-center">
          {typeof step === "number" && step < 2
            ? aliSlideContents[step]
            : dilemmaText}
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 mt-8">
          {typeof step === "number" && step < 1 && (
            <button
              className="px-6 py-3 rounded-xl bg-blue-800 text-white font-bold shadow hover:bg-blue-700 transition"
              onClick={() => setStep((step + 1) as StepType)}
            >
              Next
            </button>
          )}
          {step === 1 && (
            <>
              <button
                className="px-6 py-3 rounded-xl bg-green-700 text-white font-bold shadow hover:bg-green-600 transition"
                onClick={() => setStep("quality")}
              >
                Ali answers 100 surveys with quality responses
              </button>
              <button
                className="px-6 py-3 rounded-xl bg-yellow-600 text-white font-bold shadow hover:bg-yellow-500 transition"
                onClick={() => setStep("nonquality")}
              >
                Ali answers 100 surveys with non-quality responses
              </button>
              <button
                className="px-6 py-3 rounded-xl bg-red-700 text-white font-bold shadow hover:bg-red-600 transition"
                onClick={() => setStep("none")}
              >
                Ali ignores the advice and doesn&apos;t answer enough surveys
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

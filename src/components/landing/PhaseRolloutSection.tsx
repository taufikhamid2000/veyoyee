import React from "react";

const PhaseRolloutSection = () => (
  <section className="w-full bg-gradient-to-b from-blue-900 to-indigo-950 py-16 md:py-24 px-4 md:px-6">
    <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
      <span className="inline-block px-3 md:px-4 py-0.5 rounded-full bg-indigo-900 text-indigo-200 font-medium text-xs md:text-sm mb-4 md:mb-6">
        Phase Rollout
      </span>
      <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-snug mb-4">
        University-First, Then the World
      </h2>
      <ol className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed list-decimal list-inside space-y-2">
        <li>
          <b>Pilot Launch:</b> Partner with select university departments to
          validate the platform and gather feedback.
        </li>
        <li>
          <b>Campus Expansion:</b> Roll out to more faculties and student
          organizations, building a trusted academic community.
        </li>
        <li>
          <b>Open Access:</b> Gradually open to nonprofits and commercial
          research, maintaining high standards and academic roots.
        </li>
      </ol>
    </div>
  </section>
);

export default PhaseRolloutSection;

import React from "react";

// Comparison Table (moved from app/page.tsx)
const ComparisonTable = () => (
  <div className="overflow-x-auto mt-8 mb-0 pb-0">
    <table className="min-w-full text-sm text-left text-gray-300 border border-gray-700 rounded-xl overflow-hidden">
      <thead className="bg-blue-900 text-blue-200">
        <tr>
          <th className="px-6 py-3">Feature</th>
          <th className="px-6 py-3">Veyoyee</th>
          <th className="px-6 py-3">Typical Swap Site</th>
        </tr>
      </thead>
      <tbody className="bg-gray-900">
        <tr className="border-b border-gray-700">
          <td className="px-6 py-4">Academic/Nonprofit Focus</td>
          <td className="px-6 py-4">✅ Yes</td>
          <td className="px-6 py-4">❌ No</td>
        </tr>
        <tr className="border-b border-gray-700">
          <td className="px-6 py-4">Commercial Use</td>
          <td className="px-6 py-4">✅ Supported</td>
          <td className="px-6 py-4">✅/❌ Limited</td>
        </tr>
        <tr className="border-b border-gray-700">
          <td className="px-6 py-4">AI/Bot Protection</td>
          <td className="px-6 py-4">✅ Advanced</td>
          <td className="px-6 py-4">❌ Weak/None</td>
        </tr>
        <tr className="border-b border-gray-700">
          <td className="px-6 py-4">Quality Control</td>
          <td className="px-6 py-4">✅ Reputation & Validation</td>
          <td className="px-6 py-4">❌ Basic/None</td>
        </tr>
        <tr className="border-b border-gray-700">
          <td className="px-6 py-4">Real Rewards</td>
          <td className="px-6 py-4">✅ Transparent</td>
          <td className="px-6 py-4">❌ Points/Fake Credits</td>
        </tr>
        <tr>
          <td className="px-6 py-4">Data Privacy & Ethics</td>
          <td className="px-6 py-4">✅ Strong</td>
          <td className="px-6 py-4">❌ Weak</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const WhyVeyoyeeSection = () => (
  <div className="w-full bg-gradient-to-b from-indigo-950 to-blue-900 py-[40px] md:py-[100px] px-4 md:px-6">
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col items-center">
        <span className="inline-block px-3 md:px-4 py-0.5 rounded-full bg-blue-900 text-blue-300 font-medium text-xs md:text-sm mb-4 md:mb-6">
          Why Veyoyee
        </span>
        <h2 className="text-2xl md:text-4xl font-extrabold text-white leading-snug text-center">
          Why Veyoyee is Different
        </h2>
      </div>
      <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto text-center leading-relaxed">
        We’re not just another survey swap. Veyoyee is built for research that
        matters—combining academic rigor, commercial flexibility, and
        next-generation protections.
      </p>
      <ComparisonTable />
    </div>
  </div>
);

export default WhyVeyoyeeSection;

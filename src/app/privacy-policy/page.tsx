import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Veyoyee",
  description: "Read the privacy policy for Veyoyee.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Privacy Policy
      </h1>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        Your privacy is important to us. This Privacy Policy explains how
        Veyoyee collects, uses, and protects your information when you use our
        platform.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">
        1. Information We Collect
      </h2>
      <ul className="list-disc ml-6 mb-4 text-gray-600 dark:text-gray-300">
        <li>Account information (name, email, etc.) when you register.</li>
        <li>Survey data you create, share, or respond to.</li>
        <li>Usage data (device, browser, IP address, etc.).</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">
        2. How We Use Your Information
      </h2>
      <ul className="list-disc ml-6 mb-4 text-gray-600 dark:text-gray-300">
        <li>To provide and improve our services.</li>
        <li>To communicate with you about your account or surveys.</li>
        <li>To ensure platform security and prevent abuse.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">
        3. Data Sharing & Security
      </h2>
      <ul className="list-disc ml-6 mb-4 text-gray-600 dark:text-gray-300">
        <li>We do not sell your personal data to third parties.</li>
        <li>
          Survey data may be shared with survey creators as intended by the
          platform.
        </li>
        <li>We use industry-standard security to protect your data.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">4. Your Rights</h2>
      <ul className="list-disc ml-6 mb-4 text-gray-600 dark:text-gray-300">
        <li>You can access, update, or delete your account at any time.</li>
        <li>Contact us for any privacy-related requests or questions.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">
        5. Changes to This Policy
      </h2>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        We may update this Privacy Policy from time to time. We will notify you
        of any significant changes.
      </p>
      <p className="text-gray-500 text-xs mt-8">Last updated: June 23, 2025</p>
    </div>
  );
}

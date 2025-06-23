import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Veyoyee",
  description: "Read the terms of service for Veyoyee.",
};

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Terms of Service
      </h1>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        Please read these Terms of Service (&quot;Terms&quot;) carefully before
        using the Veyoyee platform. By accessing or using our services, you
        agree to be bound by these Terms.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">1. Use of Service</h2>
      <ul className="list-disc ml-6 mb-4 text-gray-600 dark:text-gray-300">
        <li>You must be at least 13 years old to use Veyoyee.</li>
        <li>You are responsible for your account and all activity under it.</li>
        <li>Do not use Veyoyee for unlawful, harmful, or abusive purposes.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">2. Content</h2>
      <ul className="list-disc ml-6 mb-4 text-gray-600 dark:text-gray-300">
        <li>You retain ownership of the content you create.</li>
        <li>
          You grant Veyoyee a license to use, display, and distribute your
          content as needed to provide the service.
        </li>
        <li>
          Do not post content that infringes on others&apos; rights or violates
          laws.
        </li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">3. Termination</h2>
      <ul className="list-disc ml-6 mb-4 text-gray-600 dark:text-gray-300">
        <li>
          We may suspend or terminate your account for violations of these
          Terms.
        </li>
        <li>You may delete your account at any time.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">
        4. Disclaimer &amp; Limitation of Liability
      </h2>
      <ul className="list-disc ml-6 mb-4 text-gray-600 dark:text-gray-300">
        <li>
          Veyoyee is provided &quot;as is&quot; without warranties of any kind.
        </li>
        <li>
          We are not liable for any damages resulting from your use of the
          platform.
        </li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">5. Changes to Terms</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        We may update these Terms from time to time. Continued use of Veyoyee
        means you accept the revised Terms.
      </p>
      <p className="text-gray-500 text-xs mt-8">Last updated: June 23, 2025</p>
    </div>
  );
}

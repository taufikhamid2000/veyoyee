import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Policy - Veyoyee",
  description: "Read the security policy for Veyoyee.",
};

export default function SecurityPolicyPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        Security Policy
      </h1>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        Veyoyee is committed to protecting your data and ensuring the security
        of our platform. This Security Policy outlines our approach to
        safeguarding your information.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">1. Data Protection</h2>
      <ul className="list-disc ml-6 mb-4 text-gray-600 dark:text-gray-300">
        <li>All user data is encrypted in transit using HTTPS/TLS.</li>
        <li>We use secure authentication and authorization mechanisms.</li>
        <li>
          Access to sensitive data is restricted to authorized personnel only.
        </li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">2. Platform Security</h2>
      <ul className="list-disc ml-6 mb-4 text-gray-600 dark:text-gray-300">
        <li>
          Regular security audits and vulnerability assessments are performed.
        </li>
        <li>
          We monitor for suspicious activity and respond promptly to incidents.
        </li>
        <li>Backups are performed regularly to prevent data loss.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">
        3. User Responsibilities
      </h2>
      <ul className="list-disc ml-6 mb-4 text-gray-600 dark:text-gray-300">
        <li>Keep your account credentials secure and do not share them.</li>
        <li>
          Report any suspicious activity or security concerns to our support
          team.
        </li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">4. Contact</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        If you have any questions or concerns about security, please contact us
        at{" "}
        <a
          href="mailto:support@veyoyee.com"
          className="underline hover:text-blue-500"
        >
          support@veyoyee.com
        </a>
        .
      </p>
      <p className="text-gray-500 text-xs mt-8">Last updated: June 23, 2025</p>
    </div>
  );
}

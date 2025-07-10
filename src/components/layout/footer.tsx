import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-950 text-gray-300 py-10 mt-16 border-t border-blue-900">
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand and Description */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left col-span-2 md:col-span-1">
          <h2 className="text-xl font-bold text-white mb-2">Veyoyee</h2>
          <p className="text-sm text-gray-400 mb-4 max-w-xs">
            Veyoyee is a modern platform for creating, sharing, and analyzing
            surveys. Secure. Simple. Insightful.
          </p>
          <div className="text-xs text-gray-500 mt-6">
            © {new Date().getFullYear()} Veyoyee. All rights reserved.
          </div>
        </div>
        {/* Links */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="font-semibold text-white mb-2">Links</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/" className="hover:text-white block py-1">
                Home
              </Link>
            </li>
            <li>
              <Link href="/explore" className="hover:text-white block py-1">
                Explore
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white block py-1">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
        {/* Policies */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="font-semibold text-white mb-2">Policies</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                href="privacy-policy"
                className="hover:text-white block py-1"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="terms-of-service"
                className="hover:text-white block py-1"
              >
                Terms of Service
              </Link>
            </li>
            <li>
              <Link
                href="security-policy"
                className="hover:text-white block py-1"
              >
                Security Policy
              </Link>
            </li>
          </ul>
        </div>
        {/* Socials */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="font-semibold text-white mb-2">Follow Us</h3>
          <div className="flex gap-6 mt-2 justify-center md:justify-start">
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-white p-2 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.7-.02-1.36-.21-1.94-.53v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59a8.36 8.36 0 0 1-2.54.7z" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-white p-2 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.68 0H1.32A1.32 1.32 0 0 0 0 1.32v21.36A1.32 1.32 0 0 0 1.32 24h11.5v-9.29H9.69v-3.62h3.13V8.41c0-3.1 1.89-4.79 4.65-4.79 1.32 0 2.45.1 2.78.14v3.22h-1.91c-1.5 0-1.79.71-1.79 1.75v2.3h3.58l-.47 3.62h-3.11V24h6.09A1.32 1.32 0 0 0 24 22.68V1.32A1.32 1.32 0 0 0 22.68 0" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-white p-2 rounded transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11.75 20h-3v-10h3v10zm-1.5-11.25c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zm15.25 11.25h-3v-5.5c0-1.32-.03-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9v5.6h-3v-10h2.89v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

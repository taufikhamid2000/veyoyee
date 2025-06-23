"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import SignOutButton from "@/components/auth/sign-out-button";
import { Menu, X } from "lucide-react";
import UserNavDropdown from "@/components/layout/user-nav-dropdown";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    // Check current auth status
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user || null;
      setUser(sessionUser);
      setLoading(false);
    };

    checkUser();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        const sessionUser = session?.user || null;
        setUser(sessionUser);
        // If user just signed in, redirect to dashboard
        // Commenting out to prevent redirection issues
        // if (event === "SIGNED_IN" && sessionUser) {
        //   window.location.href = "/dashboard";
        // }
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);
  return (
    <nav className="relative">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <Link
          href="/"
          className={`text-gray-200 hover:text-white transition-colors${
            pathname === "/" ? " font-bold border-b-2 border-blue-400" : ""
          }`}
        >
          Home
        </Link>

        {loading ? (
          <span className="text-gray-400">Loading...</span>
        ) : user ? (
          // Authenticated menu items
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`text-gray-200 hover:text-white transition-colors${
                pathname.startsWith("/dashboard")
                  ? " font-bold border-b-2 border-blue-400"
                  : ""
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/explore"
              className={`text-gray-200 hover:text-white transition-colors${
                pathname.startsWith("/explore")
                  ? " font-bold border-b-2 border-blue-400"
                  : ""
              }`}
            >
              Explore
            </Link>
            <ThemeToggle />
            {user && <UserNavDropdown user={user} />}
          </div>
        ) : (
          // Unauthenticated menu items
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Link
              href="/auth/signin"
              className="text-gray-200 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Burger Menu */}
      <div className="md:hidden flex justify-end">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 focus:outline-none text-gray-200 hover:text-white"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-14 mt-2 w-56 rounded-xl bg-blue-900/95 backdrop-blur-lg shadow-lg py-2 z-10 border border-blue-700/50"
          >
            <Link
              href="/"
              className={`block px-6 py-3 text-sm text-gray-200 hover:text-white hover:bg-blue-800/50 transition-colors${
                pathname === "/" ? " font-bold border-b-2 border-blue-400" : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {loading ? (
              <span className="block px-6 py-3 text-sm text-gray-400">
                Loading...
              </span>
            ) : user ? (
              // Authenticated mobile menu
              <>
                <Link
                  href="/dashboard"
                  className={`block px-6 py-3 text-sm text-gray-200 hover:text-white hover:bg-blue-800/50 transition-colors${
                    pathname.startsWith("/dashboard")
                      ? " font-bold border-b-2 border-blue-400"
                      : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/explore"
                  className={`block px-6 py-3 text-sm text-gray-200 hover:text-white hover:bg-blue-800/50 transition-colors${
                    pathname.startsWith("/explore")
                      ? " font-bold border-b-2 border-blue-400"
                      : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Explore
                </Link>
                {user && (
                  <Link
                    href="/profile"
                    className="block px-6 py-3 text-sm text-blue-300 bg-blue-950/70 hover:text-blue-100 hover:bg-blue-900/80 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {user.email?.split("@")[0]}
                  </Link>
                )}
                <div className="px-6 py-3">
                  <SignOutButton
                    variant="link"
                    className="w-full text-left text-sm text-red-400 hover:text-red-300"
                  />
                </div>
                <div className="px-6 py-3 flex justify-center border-t border-blue-800/50 mt-1">
                  <ThemeToggle />
                </div>
              </>
            ) : (
              // Unauthenticated mobile menu
              <>
                <Link
                  href="/auth/signin"
                  className="block px-6 py-3 text-sm text-gray-200 hover:text-white hover:bg-blue-800/50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <div className="px-6 py-3">
                  <Link
                    href="/auth/signup"
                    className="block w-full text-center py-2 text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full hover:from-blue-600 hover:to-indigo-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
                <div className="px-6 py-3 flex justify-center border-t border-blue-800/50 mt-1">
                  <ThemeToggle />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import SignOutButton from "@/components/auth/sign-out-button";

export default function UserNavDropdown({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Create button ripple effect
  const createRipple = (event: React.MouseEvent<HTMLElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement("span");
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className =
      "absolute bg-blue-400/20 rounded-full pointer-events-none animate-ripple";

    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={(e) => {
          setIsOpen(!isOpen);
          createRipple(e);
        }}
        className="flex items-center gap-1 px-4 py-1.5 bg-blue-800/50 text-blue-100 rounded-full text-sm hover:bg-blue-700/60 hover:shadow-md hover:shadow-blue-900/30 transition-all duration-300 border border-blue-700/50 group relative overflow-hidden"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="relative z-10">{user.email?.split("@")[0]}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>{" "}
      <div
        className={`
          absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-blue-900/95 backdrop-blur-lg 
          ring-1 ring-blue-700/50 z-10 overflow-hidden transition-all duration-300 ease-in-out origin-top
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0 animate-dropdown"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }
        `}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="user-menu-button"
      >
        {" "}
        <div className="py-1" role="menu" aria-orientation="vertical">
          <div className="px-4 py-3 text-sm text-gray-200 border-b border-blue-800/70 animate-fade-in">
            <p className="font-medium">{user.email}</p>
            <p className="text-xs text-blue-300">Logged in</p>
          </div>
          <Link
            href="/dashboard"
            className="block px-4 py-3 text-sm text-gray-200 hover:bg-blue-800/50 hover:text-white transition-colors relative overflow-hidden group animate-slide-down"
            style={{ animationDelay: "75ms" }}
            onClick={(e) => {
              createRipple(e);
              setTimeout(() => setIsOpen(false), 150);
            }}
          >
            <span className="relative z-10 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 opacity-70 group-hover:opacity-100 transition-opacity"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </span>
          </Link>
          <Link
            href="/dashboard/profile"
            className="block px-4 py-3 text-sm text-gray-200 hover:bg-blue-800/50 hover:text-white transition-colors relative overflow-hidden group animate-slide-down"
            style={{ animationDelay: "150ms" }}
            onClick={(e) => {
              createRipple(e);
              setTimeout(() => setIsOpen(false), 150);
            }}
          >
            <span className="relative z-10 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2 opacity-70 group-hover:opacity-100 transition-opacity"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile Settings
            </span>
          </Link>
          <div
            className="border-t border-blue-800/70 pt-1 pb-1 animate-slide-down"
            style={{ animationDelay: "225ms" }}
          >
            <div
              className="px-4 py-2 relative overflow-hidden group"
              onClick={(e) => createRipple(e)}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 opacity-70 group-hover:opacity-100 transition-opacity text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <SignOutButton
                  variant="ghost"
                  className="w-full text-left text-sm text-red-400 hover:text-red-300 p-0 h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";

export default function SessionRedirect() {
  useEffect(() => {
    // Disabled automatic redirection to prevent loops
    const checkSession = async () => {};

    checkSession();
  }, []);

  return null; // This component doesn't render anything
}

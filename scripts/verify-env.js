/* eslint-disable @typescript-eslint/no-require-imports */
// verify-env.js
require("dotenv").config({ path: ".env.local" });
console.log("Verifying environment variables...");

const requiredEnvVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_REDIRECT_URL",
];

let missingVars = [];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  } else {
    // Log the first few characters of each env var to verify it's set correctly
    // (but don't expose sensitive values in logs)
    const value = process.env[varName];
    const safeValue =
      varName.includes("KEY") || varName.includes("SECRET")
        ? `${value.substring(0, 10)}...`
        : value;

    console.log(`✓ ${varName} is set: ${safeValue}`);
  }
});

if (missingVars.length > 0) {
  console.error(
    `❌ Missing required environment variables: ${missingVars.join(", ")}`
  );
  process.exit(1);
} else {
  console.log("✅ All required environment variables are set!");
}

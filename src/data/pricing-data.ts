export interface PricingItem {
  title: string;
  hours: number;
  rate: number;
  color: "blue" | "purple" | "orange" | "teal" | "yellow" | "indigo" | "red" | "gray";
}

export interface PricingSection {
  title: string;
  items: PricingItem[];
}

export const pricingData: PricingSection[] = [
  {
    title: "1. Core Architecture & Stack",
    items: [
      { title: "Next.js 13+ (App Router)", hours: 8, rate: 20, color: "blue" },
      { title: "TypeScript Throughout", hours: 5, rate: 20, color: "blue" },
      { title: "Tailwind CSS Setup", hours: 4, rate: 20, color: "blue" },
      { title: "Supabase Integration", hours: 6, rate: 20, color: "blue" },
      { title: "Modular Structure", hours: 7, rate: 20, color: "blue" },
    ]
  },
  {
    title: "2. Authentication & Authorization",
    items: [
      { title: "Secure Registration", hours: 4, rate: 20, color: "purple" },
      { title: "Secure Login", hours: 4, rate: 20, color: "purple" },
      { title: "Protected Routes", hours: 4, rate: 20, color: "purple" },
      { title: "Session Management", hours: 4, rate: 20, color: "purple" },
      { title: "Custom Hooks", hours: 4, rate: 20, color: "purple" },
    ]
  },
  {
    title: "3. Survey Platform",
    items: [
      { title: "Survey Creation", hours: 25, rate: 20, color: "orange" },
      { title: "Survey Editing", hours: 15, rate: 20, color: "orange" },
      { title: "Multiple Question Types", hours: 12, rate: 20, color: "orange" },
      { title: "Bulk Actions", hours: 18, rate: 20, color: "orange" },
      { title: "Import/Export", hours: 10, rate: 20, color: "orange" },
      { title: "Analytics Dashboard", hours: 25, rate: 20, color: "orange" },
    ]
  },
  {
    title: "4. Marketplace & Monetization",
    items: [
      { title: "Marketplace UI", hours: 6, rate: 20, color: "teal" },
      { title: "Purchase Logic", hours: 6, rate: 20, color: "teal" },
      { title: "Transfer Logic", hours: 4, rate: 20, color: "teal" },
      { title: "Data Models", hours: 4, rate: 20, color: "teal" },
    ]
  },
  {
    title: "5. Leaderboard & Gamification",
    items: [
      { title: "Leaderboard UI", hours: 4, rate: 20, color: "yellow" },
      { title: "Reputation System", hours: 10, rate: 20, color: "yellow" },
      { title: "Performance Tiers", hours: 10, rate: 20, color: "yellow" },
      { title: "Data Models", hours: 5, rate: 20, color: "yellow" },
    ]
  },
  {
    title: "6. Reusable UI/UX Components",
    items: [
      { title: "Custom Components", hours: 20, rate: 20, color: "indigo" },
      { title: "Accessibility", hours: 10, rate: 20, color: "indigo" },
      { title: "Loading States", hours: 10, rate: 20, color: "indigo" },
    ]
  },
  {
    title: "7. Testing & Developer Experience",
    items: [
      { title: "Jest Tests", hours: 10, rate: 20, color: "red" },
      { title: "Types/Interfaces", hours: 5, rate: 20, color: "red" },
      { title: "Utility Functions", hours: 5, rate: 20, color: "red" },
      { title: "Service Layers", hours: 5, rate: 20, color: "red" },
    ]
  },
  {
    title: "8. Documentation & Compliance",
    items: [
      { title: "Privacy Policy", hours: 5, rate: 20, color: "gray" },
      { title: "Security Policy", hours: 5, rate: 20, color: "gray" },
      { title: "Terms of Service", hours: 5, rate: 20, color: "gray" },
      { title: "Code Documentation", hours: 5, rate: 20, color: "gray" },
    ]
  },
];

export const comparisonData = {
  myRate: {
    title: "My Rate (Beginner Developer)",
    rate: "RM20/hour",
    description: "More time taken due to learning curve",
    features: [
      "Detailed, thorough implementation",
      "Comprehensive documentation",
      "Quality-focused approach",
      "~200 hours with AI assistance"
    ],
    color: "green" as const
  },
  marketRate: {
    title: "Market Average (Experienced Developer)",
    rate: "RM40-60/hour",
    features: [
      "Faster implementation",
      "~280 hours estimated time",
      "Higher efficiency",
      "More expensive total cost"
    ],
    color: "orange" as const,
    link: {
      href: "https://my.jobstreet.com/career-advice/role/full-stack-developer/salary",
      text: "Based on RM5.1k-7.5k monthly salary"
    }
  }
};

export const summaryData = {
  totalHours: 200,
  hourlyRate: 20,
  totalValue: 4000,
  pricingRecommendations: [
    {
      title: "Commercial License",
      value: "RM4,000 - RM6,000",
      subtitle: "Multi-use, resale rights, support/updates",
      color: "blue" as const
    },
    {
      title: "Standard License", 
      value: "RM3,000 - RM4,000",
      subtitle: "Single use, no resale",
      color: "green" as const
    },
    {
      title: "Basic License",
      value: "RM2,500 - RM3,000", 
      subtitle: "Single use, limited support",
      color: "orange" as const
    }
  ]
}; 
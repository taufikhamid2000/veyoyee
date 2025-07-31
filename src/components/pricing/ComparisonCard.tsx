import React from "react";

interface ComparisonCardProps {
  title: string;
  rate: string;
  description?: string;
  features: string[];
  color: "green" | "orange";
  link?: {
    href: string;
    text: string;
  };
}

const colorVariants = {
  green: {
    container: "bg-green-900/50 border-green-800",
    title: "text-green-200",
    rate: "text-green-300",
    description: "text-green-300",
    features: "text-green-200",
    link: "text-yellow-300 hover:text-yellow-200"
  },
  orange: {
    container: "bg-orange-900/50 border-orange-800",
    title: "text-orange-200",
    rate: "text-orange-300",
    description: "text-orange-300",
    features: "text-orange-200",
    link: "text-yellow-300 hover:text-yellow-200"
  }
};

export function ComparisonCard({ title, rate, description, features, color, link }: ComparisonCardProps) {
  const colors = colorVariants[color];
  
  return (
    <div className={`p-6 rounded-2xl border ${colors.container}`}>
      <h3 className={`text-xl font-semibold mb-4 text-center ${colors.title}`}>
        {title}
      </h3>
      <div className="text-center">
        <p className={`text-3xl font-bold mb-2 ${colors.rate}`}>
          {rate}
        </p>
        {link ? (
          <p className={`text-center mb-4 ${colors.link}`}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {link.text}
            </a>
          </p>
        ) : (
          <p className={`text-sm mb-4 ${colors.description}`}>
            {description}
          </p>
        )}
        <div className="space-y-2 text-left">
          {features.map((feature, index) => (
            <p key={index} className={`text-sm ${colors.features}`}>
              ✓ {feature}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
} 
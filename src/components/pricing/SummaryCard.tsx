import React from "react";

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  description?: string;
  color?: "blue" | "green" | "orange";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colorVariants = {
  blue: "bg-blue-900/50 border-blue-800 text-blue-200",
  green: "bg-green-900/50 border-green-800 text-green-200",
  orange: "bg-orange-900/50 border-orange-800 text-orange-200",
};

const sizeVariants = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function SummaryCard({ 
  title, 
  value, 
  subtitle, 
  description, 
  color = "blue", 
  size = "md",
  className = ""
}: SummaryCardProps) {
  return (
    <div className={`rounded-2xl text-center border ${colorVariants[color]} ${sizeVariants[size]} ${className}`}>
      <h3 className={`text-xl font-semibold mb-2 ${colorVariants[color].split(" ")[0]}`}>
        {title}
      </h3>
      {subtitle && (
        <p className={`text-sm mb-4 ${colorVariants[color].split(" ")[0]}`}>
          {subtitle}
        </p>
      )}
      <p className={`text-2xl font-bold ${colorVariants[color].split(" ")[0]}`}>
        {value}
      </p>
      {description && (
        <p className={`text-sm mt-2 ${colorVariants[color].split(" ")[0]}`}>
          {description}
        </p>
      )}
    </div>
  );
} 
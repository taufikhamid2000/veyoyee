import React from "react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  title: string;
  hours: number;
  rate: number;
  color: "blue" | "purple" | "orange" | "teal" | "yellow" | "indigo" | "red" | "gray";
  className?: string;
}

const colorVariants = {
  blue: "bg-blue-900/50 border-blue-800 text-blue-200",
  purple: "bg-purple-900/50 border-purple-800 text-purple-200",
  orange: "bg-orange-900/50 border-orange-800 text-orange-200",
  teal: "bg-teal-900/50 border-teal-800 text-teal-200",
  yellow: "bg-yellow-900/50 border-yellow-800 text-yellow-200",
  indigo: "bg-indigo-900/50 border-indigo-800 text-indigo-200",
  red: "bg-red-900/50 border-red-800 text-red-200",
  gray: "bg-gray-900/50 border-gray-800 text-gray-200",
};

const textColorVariants = {
  blue: "text-blue-300",
  purple: "text-purple-300",
  orange: "text-orange-300",
  teal: "text-teal-300",
  yellow: "text-yellow-300",
  indigo: "text-indigo-300",
  red: "text-red-300",
  gray: "text-gray-300",
};

export function PricingCard({ title, hours, rate, color, className }: PricingCardProps) {
  const total = hours * rate;
  
  return (
    <div className={cn(
      "p-6 rounded-2xl border",
      colorVariants[color],
      className
    )}>
      <h4 className={cn("font-semibold mb-2", colorVariants[color].split(" ")[0])}>
        {title}
      </h4>
      <p className={cn("text-xl font-bold", textColorVariants[color])}>
        {hours} hours × RM{rate} = RM{total.toLocaleString()}
      </p>
    </div>
  );
} 
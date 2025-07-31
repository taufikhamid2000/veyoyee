import React from "react";
import { PricingCard } from "./PricingCard";

interface PricingItem {
  title: string;
  hours: number;
  rate: number;
  color: "blue" | "purple" | "orange" | "teal" | "yellow" | "indigo" | "red" | "gray";
}

interface PricingSectionProps {
  title: string;
  items: PricingItem[];
  className?: string;
}

export function PricingSection({ title, items, className }: PricingSectionProps) {
  const totalHours = items.reduce((sum, item) => sum + item.hours, 0);
  const totalValue = items.reduce((sum, item) => sum + (item.hours * item.rate), 0);
  
  return (
    <div className={`rounded-3xl bg-blue-950/80 shadow-2xl backdrop-blur-lg p-8 border border-blue-900 ${className}`}>
      <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
        {title}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <PricingCard
            key={index}
            title={item.title}
            hours={item.hours}
            rate={item.rate}
            color={item.color}
          />
        ))}
      </div>
      
      <div className="bg-green-900/50 p-6 rounded-2xl text-center mt-6 border border-green-800">
        <p className="text-xl font-bold text-green-300">
          Subtotal: {totalHours} hours = RM{totalValue.toLocaleString()}
        </p>
      </div>
    </div>
  );
} 
import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "high" | "medium" | "low" | "todo" | "inprogress" | "done" | "default";
  className?: string;
}

const variants = {
  high: "bg-red-50 text-red-600 border border-red-100",
  medium: "bg-orange-50 text-orange-600 border border-orange-100",
  low: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  todo: "bg-gray-100 text-gray-600 border border-gray-200",
  inprogress: "bg-amber-50 text-amber-600 border border-amber-100",
  done: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  default: "bg-gray-100 text-gray-700",
};

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;

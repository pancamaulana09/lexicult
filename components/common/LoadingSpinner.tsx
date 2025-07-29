"use client";

import React from "react";
import clsx from "clsx";

type LoadingSpinnerProps = {
  size?: number; // pixel size
  color?: string; // Tailwind color utility, like "text-blue-500"
  className?: string;
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 32,
  color = "text-blue-500",
  className = "",
}) => {
  return (
    <div className={clsx("flex items-center justify-center", className)}>
      <svg
        className={clsx("animate-spin", color)}
        style={{ width: size, height: size }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </div>
  );
};

export default LoadingSpinner;

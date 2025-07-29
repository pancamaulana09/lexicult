"use client";

import React from "react";
import clsx from "clsx";
import { ProgressBar } from "@/components/learning/ProgressBar";

type ProgressCardProps = {
  title: string;
  subtitle?: string;
  progress: number; // 0–100
  level?: string;
  className?: string;
};

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  subtitle,
  progress,
  level,
  className,
}) => {
  return (
    <div
      className={clsx(
        "p-4 rounded-xl shadow-md bg-white dark:bg-slate-800 transition-colors",
        "border border-slate-200 dark:border-slate-700",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
        {level && (
          <span className="text-xs font-bold text-yellow-500 bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded-full">
            {level}
          </span>
        )}
      </div>
      <ProgressBar value={progress} />
      <div className="mt-2 text-right text-xs text-slate-600 dark:text-slate-400">
        {progress}% complete
      </div>
    </div>
  );
};

export default ProgressCard;

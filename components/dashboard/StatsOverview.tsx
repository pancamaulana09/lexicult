"use client";

import React from "react";
import clsx from "clsx";
import {
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

type Stat = {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string; // e.g. 'text-green-500'
};

type StatsOverviewProps = {
  stats: Stat[];
  className?: string;
};

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, className }) => {
  return (
    <div
      className={clsx(
        "p-4 rounded-xl shadow-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors",
        className
      )}
    >
      <h3 className="text-md font-semibold mb-4 text-slate-800 dark:text-slate-100">
        Stats Overview
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div
              className={clsx(
                "w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700",
                stat.color || "text-blue-500"
              )}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsOverview;

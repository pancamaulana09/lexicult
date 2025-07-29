"use client";

import { LightningBoltIcon, PlusIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import React from "react";

type Action = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  color?: string; // Tailwind class e.g. bg-blue-500
};

type QuickActionsProps = {
  actions: Action[];
  className?: string;
};

export const QuickActions: React.FC<QuickActionsProps> = ({ actions, className }) => {
  return (
    <div
      className={clsx(
        "p-4 rounded-xl shadow-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors",
        className
      )}
    >
      <h3 className="text-md font-semibold mb-4 text-slate-800 dark:text-slate-100">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            className={clsx(
              "flex flex-col items-center justify-center rounded-lg p-3 text-sm font-medium text-white hover:scale-[1.03] transition-transform duration-200",
              action.color || "bg-blue-500"
            )}
          >
            <div className="w-6 h-6 mb-1">{action.icon}</div>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;

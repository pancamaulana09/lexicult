"use client";

import React from "react";
import clsx from "clsx";

type OnlineStatusProps = {
  status: "online" | "offline" | "idle" | "busy";
  size?: number; // Optional: size of the dot
};

const statusColorMap: Record<OnlineStatusProps["status"], string> = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  idle: "bg-yellow-400",
  busy: "bg-red-500",
};

export const OnlineStatus: React.FC<OnlineStatusProps> = ({ status, size = 10 }) => {
  const dotSize = `${size}px`;

  return (
    <span
      className={clsx(
        "inline-block rounded-full border border-white dark:border-slate-800 shadow",
        statusColorMap[status]
      )}
      style={{ width: dotSize, height: dotSize }}
      title={status.charAt(0).toUpperCase() + status.slice(1)}
    />
  );
};

export default OnlineStatus;

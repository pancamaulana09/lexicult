"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

type NotificationType = "info" | "success" | "error" | "warning";

export type NotificationItem = {
  id: string;
  message: string;
  type?: NotificationType;
  duration?: number; // in milliseconds
};

type NotificationProps = {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
};

const typeStyles: Record<NotificationType, string> = {
  info: "bg-blue-500 text-white",
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  warning: "bg-yellow-400 text-black",
};

export const Notification: React.FC<NotificationProps> = ({
  notifications,
  onDismiss,
}) => {
  useEffect(() => {
    const timers = notifications.map((n) =>
      setTimeout(() => onDismiss(n.id), n.duration || 3000)
    );
    return () => timers.forEach(clearTimeout);
  }, [notifications, onDismiss]);

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={clsx(
              "p-4 rounded shadow-lg flex justify-between items-start",
              typeStyles[notification.type || "info"]
            )}
          >
            <div className="flex-1 pr-4">{notification.message}</div>
            <button
              className="text-white hover:text-opacity-75 text-xl leading-none"
              onClick={() => onDismiss(notification.id)}
              aria-label="Dismiss notification"
            >
              &times;
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Notification;

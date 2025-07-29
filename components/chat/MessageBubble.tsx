"use client";

import { MessageProps, useMessageContext } from "stream-chat-react";
import { format } from "date-fns";
import clsx from "clsx";

export const MessageBubble = (props: MessageProps) => {
  const {
    message,
    isMyMessage,
    groupStyles,
  } = useMessageContext();

  const sentAt = message?.created_at ? format(new Date(message.created_at), "HH:mm") : "";

  return (
    <div
      className={clsx(
        "px-4 py-1 flex flex-col",
        isMyMessage ? "items-end" : "items-start"
      )}
    >
      <div
        className={clsx(
          "rounded-xl px-4 py-2 max-w-[80%] text-sm shadow-sm transition-all",
          isMyMessage
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 dark:bg-slate-700 text-black dark:text-white rounded-bl-none"
        )}
      >
        {message?.text}
      </div>
      <span className="text-xs mt-1 text-muted-foreground">{sentAt}</span>
    </div>
  );
};

export default MessageBubble;

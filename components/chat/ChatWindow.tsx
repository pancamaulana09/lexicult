"use client";

import { useChatContext, Channel, MessageList, MessageInput, Thread } from "stream-chat-react";
import { useState } from "react";
import "stream-chat-react/dist/css/v2/index.css"; // Ensure the base styles are loaded

export const ChatWindow = () => {
  const { channel } = useChatContext();
  const [thread, setThread] = useState(null);

  if (!channel) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No chat selected.
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full border-l border-slate-700 bg-background text-foreground">
      <Channel
        channel={channel}
        Thread={Thread}
        thread={thread}
        setThread={setThread}
        Message={(props) => <MessageList {...props} />}
      >
        <div className="flex-1 overflow-y-auto">
          <MessageList
            messageActions={["react", "reply", "delete"]}
            onThreadSelect={(message) => setThread(message)}
          />
        </div>
        <div className="p-2 border-t border-slate-700">
          <MessageInput focus />
        </div>
      </Channel>
    </div>
  );
};

export default ChatWindow;

import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { Send, MessageSquare, Wifi, WifiOff, Loader2 } from "lucide-react";
import { useTaskChat } from "../../Hooks/useTaskChat";
import { useAppSelector } from "../../Store/store";
import type { ChatMessage } from "../../Interfaces/IChat";

interface TaskChatPanelProps {
  taskId: string;
  taskTitle: string;
}

/* ── Helpers ── */
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function groupMessagesByDay(messages: ChatMessage[]) {
  const groups: { day: string; messages: ChatMessage[] }[] = [];
  for (const msg of messages) {
    const day = getDayLabel(msg.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.day === day) {
      last.messages.push(msg);
    } else {
      groups.push({ day, messages: [msg] });
    }
  }
  return groups;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-indigo-500",
];

function avatarColor(id: string) {
  const code = id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

/* ── Avatar ── */
function ChatAvatar({ name, id, imageUrl }: { name: string; id: string; imageUrl?: string }) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-white"
      />
    );
  }
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ring-2 ring-white ${avatarColor(id)}`}
    >
      {getInitials(name)}
    </div>
  );
}

/* ── Typing Indicator ── */
function TypingBubble({ names }: { names: string[] }) {
  const label =
    names.length === 1
      ? `${names[0]} is typing`
      : names.length === 2
      ? `${names[0]} and ${names[1]} are typing`
      : "Several people are typing";

  return (
    <div className="flex items-end gap-2">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2.5 flex items-center gap-2">
        <span className="text-xs text-gray-500 mr-1">{label}</span>
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

/* ── Empty State ── */
function EmptyChat() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#1a6b5a]/10 flex items-center justify-center">
        <MessageSquare className="w-8 h-8 text-[#1a6b5a]" />
      </div>
      <div>
        <p className="font-semibold text-gray-800 mb-1">No messages yet</p>
        <p className="text-sm text-gray-400 max-w-[200px]">
          Be the first to start the conversation for this task.
        </p>
      </div>
    </div>
  );
}

/* ── Main Component ── */
const TaskChatPanel = ({ taskId, taskTitle }: TaskChatPanelProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const { messages, typingUsers, isConnected, isLoadingHistory, sendMessage, notifyTyping, messagesEndRef } =
    useTaskChat(taskId);

  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    sendMessage(trimmed);
    setInputValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [inputValue, sendMessage]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    notifyTyping();
    // Auto-grow textarea
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const grouped = groupMessagesByDay(messages);
  const canSend = inputValue.trim().length > 0 && isConnected;

  return (
    <div className="flex flex-col h-full bg-gray-50/50">
      {/* ── Chat Header ── */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-[#1a6b5a] flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-700 truncate">{taskTitle}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {isConnected ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs text-emerald-600 font-medium">Live</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-xs text-amber-600 font-medium">Connecting…</span>
            </>
          )}
        </div>
      </div>

      {/* ── Message Area ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1 custom-scrollbar">
        {isLoadingHistory ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin text-[#1a6b5a]" />
            <span className="text-sm">Loading messages…</span>
          </div>
        ) : messages.length === 0 ? (
          <EmptyChat />
        ) : (
          grouped.map(({ day, messages: dayMsgs }) => (
            <div key={day} className="flex flex-col gap-2">
              {/* Day divider */}
              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-[11px] font-semibold text-gray-400 px-2">{day}</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {dayMsgs.map((msg) => {
                const isOwn = msg.sender._id === user?._id;
                return (
                  <div
                    key={msg._id}
                    className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar — only for others */}
                    {!isOwn ? (
                      <ChatAvatar
                        name={msg.sender.userName}
                        id={msg.sender._id}
                        imageUrl={msg.sender.image?.secure_url}
                      />
                    ) : (
                      <div className="w-8 flex-shrink-0" />
                    )}

                    <div className={`flex flex-col gap-0.5 max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}>
                      {/* Sender name — only for others */}
                      {!isOwn && (
                        <span className="text-[11px] font-semibold text-gray-500 px-1">
                          {msg.sender.userName}
                        </span>
                      )}

                      {/* Bubble */}
                      <div
                        className={`relative px-3.5 py-2 rounded-2xl text-sm leading-relaxed break-words
                          ${isOwn
                            ? `bg-[#1a6b5a] text-white rounded-br-sm ${msg.isOptimistic ? "opacity-70" : ""}`
                            : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100"
                          }`}
                      >
                        {msg.content}
                        {msg.isOptimistic && (
                          <span className="ml-2 text-[10px] opacity-70 italic">sending…</span>
                        )}
                      </div>

                      {/* Timestamp */}
                      <span className={`text-[10px] text-gray-400 px-1 ${isOwn ? "text-right" : "text-left"}`}>
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <TypingBubble names={typingUsers.map((u) => u.userName.split(" ")[0])} />
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input Area ── */}
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <div
          className={`flex items-end gap-2 rounded-2xl border-2 transition-colors px-3 py-2
            ${isConnected
              ? "border-gray-200 focus-within:border-[#1a6b5a] bg-white"
              : "border-gray-100 bg-gray-50"
            }`}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            disabled={!isConnected}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isConnected ? "Type a message… (Enter to send)" : "Connecting to chat…"}
            className="flex-1 resize-none bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 max-h-[120px] leading-relaxed py-0.5 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200
              ${canSend
                ? "bg-[#1a6b5a] text-white hover:bg-[#135244] active:scale-95 shadow-sm"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
              }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 text-center">
          Press <kbd className="bg-gray-100 rounded px-1 py-0.5 font-mono">Enter</kbd> to send ·{" "}
          <kbd className="bg-gray-100 rounded px-1 py-0.5 font-mono">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
};

export default TaskChatPanel;

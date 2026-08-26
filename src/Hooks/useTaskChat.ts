import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { ChatMessage, TypingUser } from "../Interfaces/IChat";
import { useAppSelector } from "../Store/store";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";
const TYPING_DEBOUNCE_MS = 1500;

interface UseTaskChatReturn {
  messages: ChatMessage[];
  typingUsers: TypingUser[];
  isConnected: boolean;
  isLoadingHistory: boolean;
  sendMessage: (content: string) => void;
  notifyTyping: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export function useTaskChat(taskId: string): UseTaskChatReturn {
  const { token, user } = useAppSelector((state) => state.auth);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const socketRef = useRef<Socket | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!token || !taskId) return;

    // Connect socket with JWT auth
    const socket = io(SOCKET_URL, {
      auth: { token: `bearer ${token}` },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      setIsLoadingHistory(true);
      socket.emit("join_task", { taskId });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("message_history", (history: ChatMessage[]) => {
      setMessages(history);
      setIsLoadingHistory(false);
    });

    socket.on("new_message", (message: ChatMessage) => {
      setMessages((prev) => {
        // Replace optimistic message if it belongs to current user
        if (message.sender._id === user?._id) {
          const optimisticIdx = prev.findIndex((m) => m.isOptimistic);
          if (optimisticIdx !== -1) {
            const next = [...prev];
            next[optimisticIdx] = message;
            return next;
          }
        }
        // Avoid duplicate messages
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    socket.on("user_typing", (data: TypingUser) => {
      setTypingUsers((prev) =>
        prev.some((u) => u.userId === data.userId) ? prev : [...prev, data]
      );
    });

    socket.on("user_stop_typing", ({ userId }: { userId: string }) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
    });

    socket.on("error", (err: { message: string }) => {
      console.error("[Socket Chat Error]", err.message);
      setIsLoadingHistory(false);
    });

    return () => {
      // Clear typing timer
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      // Notify stop typing before disconnect
      if (isTypingRef.current) {
        socket.emit("stop_typing", { taskId });
      }
      socket.disconnect();
      socketRef.current = null;
      setMessages([]);
      setTypingUsers([]);
      setIsConnected(false);
    };
  }, [taskId, token, user?._id]);

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !socketRef.current || !user) return;

      // Optimistic UI: add message locally before server confirms
      const optimisticMessage: ChatMessage = {
        _id: `optimistic-${Date.now()}`,
        task: taskId,
        project: "",
        sender: {
          _id: user._id,
          userName: user.userName,
          email: user.email,
          role: user.role,
          image: user.image,
        },
        content: trimmed,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isOptimistic: true,
      };

      setMessages((prev) => [...prev, optimisticMessage]);

      // Stop typing before sending
      if (isTypingRef.current) {
        socketRef.current.emit("stop_typing", { taskId });
        isTypingRef.current = false;
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      }

      socketRef.current.emit("send_message", { taskId, content: trimmed });
    },
    [taskId, user]
  );

  const notifyTyping = useCallback(() => {
    if (!socketRef.current) return;

    // Emit typing start only once until the debounce fires
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketRef.current.emit("typing", { taskId });
    }

    // Reset the debounce timer
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.emit("stop_typing", { taskId });
      }
      isTypingRef.current = false;
    }, TYPING_DEBOUNCE_MS);
  }, [taskId]);

  return {
    messages,
    typingUsers,
    isConnected,
    isLoadingHistory,
    sendMessage,
    notifyTyping,
    messagesEndRef,
  };
}

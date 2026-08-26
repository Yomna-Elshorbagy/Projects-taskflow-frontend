export interface ChatSender {
  _id: string;
  userName: string;
  email: string;
  role: string;
  image?: {
    secure_url: string;
    public_id: string;
  };
}

export interface ChatMessage {
  _id: string;
  task: string;
  project: string;
  sender: ChatSender;
  content: string;
  createdAt: string;
  updatedAt: string;
  /** True for optimistic (locally-created, not yet confirmed by server) messages */
  isOptimistic?: boolean;
}

export interface TypingUser {
  userId: string;
  userName: string;
}

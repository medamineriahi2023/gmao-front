export interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface ChatMessage extends Message {
  senderName: string;
  isCurrentUser: boolean;
}
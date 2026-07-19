import type { UserDetails } from "./authApi";
import { fetchWithRetry, postPutRequests } from "./baseApi";

export interface ConversationListItem {
  conversation_id: string;
  other_user: UserDetails;
  unread_count: number;
  last_message?: string;
  last_message_at?: string;
}

export interface ConversationsList {
  conversations: ConversationListItem[];
  next_cursor: string;
}

export interface MessageList {
  items: Message[];
  next_cursor: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: number;
  content: string;
  created_at: string;
  updated_at: string | null;
  is_deleted: boolean;
  message_type: string;
}

export const getConversations = async (
  cursor: string = "",
  limit: number = 20,
): Promise<ConversationsList> => {
  return await fetchWithRetry(`conversations/list?limit=${limit}&cursor=${cursor}`);
};

export const getConversationMessages = async (conversation_id: string): Promise<MessageList> => {
  return await fetchWithRetry(`conversations/${conversation_id}/messages`);
};

export const markConversationRead = async (
  conversation_id: string,
  last_read_message_id: string,
): Promise<void> => {
  await postPutRequests(`conversations/${conversation_id}/read`, { last_read_message_id });
};

export const sendMessage = async (conversation_id: string, content: string) => {
  await postPutRequests(`conversations/${conversation_id}/message`, { content });
};

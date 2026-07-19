import { fetchWithRetry, postPutRequests } from "./baseApi";

export interface UserPublic {
  id: number;
  username: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  profile: string | null;
}

export interface UserSearchResult {
  items: UserPublic[];
}

export interface ConversationListItem {
  conversation_id: string;
  other_user: UserPublic;
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

export const searchUsers = async (q: string, limit: number = 10): Promise<UserSearchResult> => {
  return await fetchWithRetry(`users/search?q=${encodeURIComponent(q)}&limit=${limit}`);
};

export const createConversation = async (
  targetUserId: number,
): Promise<{ conversation_id: string; created: boolean }> => {
  return await postPutRequests("conversations/create", { target_user_id: targetUserId });
};

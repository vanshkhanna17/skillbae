export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: number;
  content: string;
  created_at: string;
  updated_at: string | null;
  is_deleted: boolean;
  message_type: MessageType;
}

export interface ConversationMember {
  conversation_id: string;
  user_id: number;
  joined_at: string;
  last_read_at: string | null;
  last_read_message_id: string | null;
}

export interface Conversation {
  id: string;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  full_name: string;
}

// Current logged-in user
export const CURRENT_USER: User = {
  id: 1,
  username: "VKhanna",
  full_name: "Vansh Khanna",
};

export const MOCK_USERS: User[] = [
  CURRENT_USER,
  { id: 2, username: "priya_s", full_name: "Priya Sharma" },
  { id: 3, username: "arjun.m", full_name: "Arjun Mehta" },
  { id: 4, username: "sneha_r", full_name: "Sneha Reddy" },
  { id: 5, username: "karan99", full_name: "Karan Singh" },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  { id: "c1a2b3c4-d5e6-7f89-0a1b-c2d3e4f5a6b7", created_at: "2026-06-18T09:00:00Z" },
  { id: "d2b3c4d5-e6f7-8901-a2b3-c4d5e6f7b8c9", created_at: "2026-06-17T14:30:00Z" },
  { id: "e3c4d5e6-f789-0123-b3c4-d5e6f7a8c9d0", created_at: "2026-06-19T11:00:00Z" },
];

export const MOCK_CONVERSATION_MEMBERS: ConversationMember[] = [
  // Conversation 1: Vansh & Priya
  {
    conversation_id: "c1a2b3c4-d5e6-7f89-0a1b-c2d3e4f5a6b7",
    user_id: 1,
    joined_at: "2026-06-18T09:00:00Z",
    last_read_at: "2026-06-20T10:05:00Z",
    last_read_message_id: "m8",
  },
  {
    conversation_id: "c1a2b3c4-d5e6-7f89-0a1b-c2d3e4f5a6b7",
    user_id: 2,
    joined_at: "2026-06-18T09:00:00Z",
    last_read_at: "2026-06-20T10:03:00Z",
    last_read_message_id: "m7",
  },
  // Conversation 2: Vansh & Arjun
  {
    conversation_id: "d2b3c4d5-e6f7-8901-a2b3-c4d5e6f7b8c9",
    user_id: 1,
    joined_at: "2026-06-17T14:30:00Z",
    last_read_at: "2026-06-19T18:00:00Z",
    last_read_message_id: "m14",
  },
  {
    conversation_id: "d2b3c4d5-e6f7-8901-a2b3-c4d5e6f7b8c9",
    user_id: 3,
    joined_at: "2026-06-17T14:30:00Z",
    last_read_at: "2026-06-19T17:55:00Z",
    last_read_message_id: "m13",
  },
  // Conversation 3: Vansh, Sneha & Karan (group)
  {
    conversation_id: "e3c4d5e6-f789-0123-b3c4-d5e6f7a8c9d0",
    user_id: 1,
    joined_at: "2026-06-19T11:00:00Z",
    last_read_at: "2026-06-20T09:00:00Z",
    last_read_message_id: "m20",
  },
  {
    conversation_id: "e3c4d5e6-f789-0123-b3c4-d5e6f7a8c9d0",
    user_id: 4,
    joined_at: "2026-06-19T11:00:00Z",
    last_read_at: "2026-06-20T08:50:00Z",
    last_read_message_id: "m19",
  },
  {
    conversation_id: "e3c4d5e6-f789-0123-b3c4-d5e6f7a8c9d0",
    user_id: 5,
    joined_at: "2026-06-19T11:00:00Z",
    last_read_at: "2026-06-20T08:45:00Z",
    last_read_message_id: "m18",
  },
];

export const MOCK_MESSAGES: Message[] = [
  // Conversation 1: Vansh & Priya — project discussion
  {
    id: "m1",
    conversation_id: "c1a2b3c4-d5e6-7f89-0a1b-c2d3e4f5a6b7",
    sender_id: 1,
    content: "Hey Priya! Have you started on the chat feature yet?",
    created_at: "2026-06-18T09:05:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m2",
    conversation_id: "c1a2b3c4-d5e6-7f89-0a1b-c2d3e4f5a6b7",
    sender_id: 2,
    content: "Yeah, I set up the WebSocket handlers yesterday. Need to wire up the frontend still.",
    created_at: "2026-06-18T09:07:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m3",
    conversation_id: "c1a2b3c4-d5e6-7f89-0a1b-c2d3e4f5a6b7",
    sender_id: 1,
    content: "Nice. I'm working on the UI right now. Should we sync later today?",
    created_at: "2026-06-18T09:10:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m4",
    conversation_id: "c1a2b3c4-d5e6-7f89-0a1b-c2d3e4f5a6b7",
    sender_id: 2,
    content: "Sure, let's do 4pm?",
    created_at: "2026-06-18T09:12:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m5",
    conversation_id: "c1a2b3c4-d5e6-7f89-0a1b-c2d3e4f5a6b7",
    sender_id: 1,
    content: "Works for me 👍",
    created_at: "2026-06-18T09:13:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m6",
    conversation_id: "c1a2b3c4-d5e6-7f89-0a1b-c2d3e4f5a6b7",
    sender_id: 2,
    content:
      "Quick update — the message persistence layer is done. Messages are stored with UUID primary keys and we support soft deletes.",
    created_at: "2026-06-20T10:00:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m7",
    conversation_id: "c1a2b3c4-d5e6-7f89-0a1b-c2d3e4f5a6b7",
    sender_id: 1,
    content: "That's great! I'll integrate the message list component with the API today.",
    created_at: "2026-06-20T10:02:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m8",
    conversation_id: "c1a2b3c4-d5e6-7f89-0a1b-c2d3e4f5a6b7",
    sender_id: 2,
    content:
      "Sounds good. Let me know if you need the response schema — I can share the Swagger docs.",
    created_at: "2026-06-20T10:05:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },

  // Conversation 2: Vansh & Arjun — casual + code
  {
    id: "m9",
    conversation_id: "d2b3c4d5-e6f7-8901-a2b3-c4d5e6f7b8c9",
    sender_id: 3,
    content: "Bro did you see the new MUI update? They finally fixed the DatePicker.",
    created_at: "2026-06-17T14:35:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m10",
    conversation_id: "d2b3c4d5-e6f7-8901-a2b3-c4d5e6f7b8c9",
    sender_id: 1,
    content: "No way, about time lol. We were using that hacky workaround for months.",
    created_at: "2026-06-17T14:37:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m11",
    conversation_id: "d2b3c4d5-e6f7-8901-a2b3-c4d5e6f7b8c9",
    sender_id: 3,
    content: "Yeah I already upgraded in my branch. Zero breaking changes surprisingly.",
    created_at: "2026-06-17T14:40:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m12",
    conversation_id: "d2b3c4d5-e6f7-8901-a2b3-c4d5e6f7b8c9",
    sender_id: 1,
    content:
      "Let me pull that in. Also, I'm thinking of adding image support to the chat. What do you think?",
    created_at: "2026-06-19T17:45:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m13",
    conversation_id: "d2b3c4d5-e6f7-8901-a2b3-c4d5e6f7b8c9",
    sender_id: 3,
    content:
      "Definitely. We could use S3 pre-signed URLs for uploads and just store the key in the message content.",
    created_at: "2026-06-19T17:50:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m14",
    conversation_id: "d2b3c4d5-e6f7-8901-a2b3-c4d5e6f7b8c9",
    sender_id: 1,
    content:
      "That's exactly what I was thinking. I'll add a message_type field — TEXT and IMAGE for now.",
    created_at: "2026-06-19T17:55:00Z",
    updated_at: "2026-06-19T18:00:00Z",
    is_deleted: false,
    message_type: MessageType.TEXT,
  },

  // Conversation 3: Group chat — Vansh, Sneha & Karan
  {
    id: "m15",
    conversation_id: "e3c4d5e6-f789-0123-b3c4-d5e6f7a8c9d0",
    sender_id: 4,
    content: "Hey guys, are we still doing the hackathon this weekend?",
    created_at: "2026-06-19T11:05:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m16",
    conversation_id: "e3c4d5e6-f789-0123-b3c4-d5e6f7a8c9d0",
    sender_id: 5,
    content: "I'm in! What are we building?",
    created_at: "2026-06-19T11:08:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m17",
    conversation_id: "e3c4d5e6-f789-0123-b3c4-d5e6f7a8c9d0",
    sender_id: 1,
    content:
      "How about a real-time collaboration tool? We can use WebSockets since I've been working with them.",
    created_at: "2026-06-19T11:12:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m18",
    conversation_id: "e3c4d5e6-f789-0123-b3c4-d5e6f7a8c9d0",
    sender_id: 4,
    content: "Love it. I can handle the backend and database schema.",
    created_at: "2026-06-19T11:15:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m19",
    conversation_id: "e3c4d5e6-f789-0123-b3c4-d5e6f7a8c9d0",
    sender_id: 5,
    content: "I'll take the frontend then. React + MUI like we're using here?",
    created_at: "2026-06-19T11:18:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m20",
    conversation_id: "e3c4d5e6-f789-0123-b3c4-d5e6f7a8c9d0",
    sender_id: 1,
    content:
      "Yeah, let's keep the stack consistent. I'll set up the repo tonight and share the link.",
    created_at: "2026-06-20T08:30:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m21",
    conversation_id: "e3c4d5e6-f789-0123-b3c4-d5e6f7a8c9d0",
    sender_id: 4,
    content: "Perfect. Also adding a deleted message so we can test that UI case.",
    created_at: "2026-06-20T08:35:00Z",
    updated_at: null,
    is_deleted: true,
    message_type: MessageType.TEXT,
  },
  {
    id: "m22",
    conversation_id: "e3c4d5e6-f789-0123-b3c4-d5e6f7a8c9d0",
    sender_id: 5,
    content: "Can someone share the Figma link?",
    created_at: "2026-06-20T08:40:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m24",
    conversation_id: "e3c4d5e6-f789-0123-b3c4-d5e6f7a8c9d0",
    sender_id: 1,
    content: "Yes",
    created_at: "2026-06-20T08:40:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m25",
    conversation_id: "e3c4d5e6-f789-0123-b3c4-d5e6f7a8c9d0",
    sender_id: 1,
    content: "Give me one min. I am on it.",
    created_at: "2026-06-20T08:40:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.TEXT,
  },
  {
    id: "m23",
    conversation_id: "e3c4d5e6-f789-0123-b3c4-d5e6f7a8c9d0",
    sender_id: 1,
    content: "https://cdn.example.com/images/hackathon-wireframe.png",
    created_at: "2026-06-20T08:45:00Z",
    updated_at: null,
    is_deleted: false,
    message_type: MessageType.IMAGE,
  },
];

export function getMessagesForConversation(conversationId: string): Message[] {
  return MOCK_MESSAGES.filter((m) => m.conversation_id === conversationId);
}

export function getMembersForConversation(conversationId: string): ConversationMember[] {
  return MOCK_CONVERSATION_MEMBERS.filter((m) => m.conversation_id === conversationId);
}

export function getUserById(userId: number): User | undefined {
  return MOCK_USERS.find((u) => u.id === userId);
}

export function getOtherMembers(conversationId: string, currentUserId: number): User[] {
  return getMembersForConversation(conversationId)
    .filter((m) => m.user_id !== currentUserId)
    .map((m) => getUserById(m.user_id))
    .filter((u): u is User => u !== undefined);
}

export interface ConversationListItem {
  conversation: Conversation;
  otherMembers: User[];
  lastMessage: Message | null;
  unreadCount: number;
}

export function getConversationList(currentUserId: number): ConversationListItem[] {
  return MOCK_CONVERSATIONS.map((conversation) => {
    const messages = getMessagesForConversation(conversation.id);
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;

    const membership = MOCK_CONVERSATION_MEMBERS.find(
      (m) => m.conversation_id === conversation.id && m.user_id === currentUserId,
    );
    const unreadCount = membership?.last_read_at
      ? messages.filter(
          (m) => m.created_at > membership.last_read_at! && m.sender_id !== currentUserId,
        ).length
      : 0;

    return {
      conversation,
      otherMembers: getOtherMembers(conversation.id, currentUserId),
      lastMessage,
      unreadCount,
    };
  }).sort((a, b) => {
    const aTime = a.lastMessage?.created_at ?? a.conversation.created_at;
    const bTime = b.lastMessage?.created_at ?? b.conversation.created_at;
    return bTime.localeCompare(aTime);
  });
}

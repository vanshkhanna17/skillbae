import type { UserDetails } from "@/api/authApi";
import {
  getConversationMessages,
  markConversationRead,
  sendMessage,
  type Message,
} from "@/api/chatApi";
import { useAuth } from "@/context/AuthProvider";
import useWS from "@/hooks/useWS";
import { stringAvatar } from "@/utils/avatarUtils";
import { NearMeRounded } from "@mui/icons-material";
import { Avatar, Box, Container, Skeleton, TextField, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

function formatTime(dateString: Date | string): string {
  return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const MessageBubbles = ({ msg, otherMember }: { msg: Message; otherMember: UserDetails }) => {
  const isSent = msg.sender_id !== otherMember.id;
  const [showTime, setShowTime] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBubbleClick = () => {
    setShowTime(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowTime(false), 1000);
  };

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  if (msg.is_deleted) {
    return (
      <Box sx={{ display: "flex", justifyContent: isSent ? "flex-end" : "flex-start" }}>
        <Box sx={{ maxWidth: "70%" }}>
          <Typography
            variant="body2"
            sx={{
              px: 2,
              py: 1,
              borderRadius: 5,
              fontStyle: "italic",
              color: "var(--color-gray-500)",
              bgcolor: "var(--color-gray-50)",
            }}
          >
            {msg.content}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: isSent ? "flex-end" : "flex-start",
        width: "100%",
        gap: 1,
      }}
    >
      {showTime && isSent && (
        <Typography variant="caption" sx={{ color: "var(--color-gray-500)", whiteSpace: "nowrap" }}>
          {formatTime(msg.created_at)}
        </Typography>
      )}
      <Box
        onClick={handleBubbleClick}
        sx={{
          maxWidth: "70%",
          px: 2,
          py: 1,
          borderRadius: 5,
          bgcolor: isSent ? "var(--color-text-primary)" : "var(--color-gray-200)",
          color: isSent ? "#fff" : "var(--color-black)",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        {msg.message_type === "image" ? (
          <Typography variant="body2" sx={{ fontStyle: "italic", opacity: 0.85 }}>
            [Image]
          </Typography>
        ) : (
          <Typography variant="body2">{msg.content}</Typography>
        )}
      </Box>
      {showTime && !isSent && (
        <Typography variant="caption" sx={{ color: "var(--color-gray-500)", whiteSpace: "nowrap" }}>
          {formatTime(msg.created_at)}
        </Typography>
      )}
    </Box>
  );
};

const Chat = ({
  activeConversation,
  otherMember,
}: {
  activeConversation: string;
  otherMember: UserDetails | undefined;
}) => {
  const { isAuthenticated } = useAuth();
  const { subscribe } = useWS();
  const [messages, setMessages] = useState<Message[]>([]);

  const conversationMessagesQuery = useQuery({
    queryKey: ["messages", activeConversation],
    queryFn: async () => await getConversationMessages(activeConversation),
    enabled: isAuthenticated && !!activeConversation,
  });
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || !activeConversation) return;
    setMessage("");
    await sendMessage(activeConversation, trimmed);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // seed from query result
  useEffect(() => {
    if (conversationMessagesQuery.data?.items) {
      setMessages(conversationMessagesQuery.data.items);
    }
  }, [conversationMessagesQuery.data]);

  useEffect(() => {
    return subscribe<Message>("new_message", (payload) => {
      if (payload.conversation_id !== activeConversation) return;
      setMessages((prev) => [...prev, payload]);
      markConversationRead(activeConversation, payload.id).catch(() => {});
    });
  }, [subscribe, activeConversation]);

  useEffect(() => {
    const items = conversationMessagesQuery.data?.items;
    if (!items?.length || !activeConversation) return;
    const lastId = items[items.length - 1].id;
    markConversationRead(activeConversation, lastId).catch(() => {});
  }, [conversationMessagesQuery.data, activeConversation]);

  return (
    <Container sx={{ width: "100%", padding: "0px !important" }}>
      {activeConversation && otherMember ? (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              gap: "var(--size)",
              alignItems: "center",
              borderBottom: "1px solid var(--color-gray-200)",
              padding: "var(--size)",
              flex: "0 0 auto",
            }}
          >
            <Avatar {...stringAvatar(otherMember.full_name)} />
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              {
                <>
                  <Typography variant="h6">{otherMember.full_name}</Typography>
                  <Typography>@{otherMember.username}</Typography>
                </>
              }
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              overflowY: "auto",
              padding: "var(--size)",
              flex: "1 1 0",
            }}
          >
            {conversationMessagesQuery.isLoading ? (
              <>
                {[
                  { width: "45%", sent: false },
                  { width: "60%", sent: true },
                  { width: "35%", sent: false },
                  { width: "55%", sent: true },
                  { width: "40%", sent: false },
                ].map((s, i) => (
                  <Box
                    key={i}
                    sx={{ display: "flex", justifyContent: s.sent ? "flex-end" : "flex-start" }}
                  >
                    <Skeleton
                      variant="rounded"
                      width={s.width}
                      height={36}
                      sx={{ borderRadius: 5 }}
                    />
                  </Box>
                ))}
              </>
            ) : (
              messages.map((msg: Message) => (
                <MessageBubbles key={msg.id} msg={msg} otherMember={otherMember} />
              ))
            )}
            <div ref={messagesEndRef} />
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: "var(--size)",
              alignItems: "center",
              borderTop: "1px solid var(--color-gray-200)",
              padding: "var(--size)",
              flex: "0 0 auto",
            }}
          >
            <TextField
              value={message}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              onChange={(event) => setMessage(event.target.value)}
              fullWidth
              placeholder="Type a message..."
              slotProps={{
                input: {
                  endAdornment: (
                    <NearMeRounded
                      onClick={() => handleSend()}
                      sx={{
                        width: "var(--size-xl) !important",
                        padding: 0,
                        color: "var(--color-primary)",
                        cursor: "pointer",
                      }}
                    />
                  ),
                },
              }}
            />
          </Box>
        </Box>
      ) : (
        ""
      )}
    </Container>
  );
};

export default Chat;

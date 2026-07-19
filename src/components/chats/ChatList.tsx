import {
  createConversation,
  getConversations,
  searchUsers,
  type ConversationListItem,
  type UserPublic,
} from "@/api/chatApi";
import { useAuth } from "@/context/AuthProvider";
import { useDebounce } from "@/hooks/useDebounce";
import useWS from "@/hooks/useWS";
import { stringAvatar } from "@/utils/avatarUtils";
import { CloseRounded } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface ChatListProps {
  activeConversation: string;
  setActiveConversation: (conversationId: string) => void;
  setOtherMember: (member: UserPublic) => void;
}

const byRecent = (a: ConversationListItem, b: ConversationListItem) =>
  new Date(b.last_message_at ?? 0).getTime() - new Date(a.last_message_at ?? 0).getTime();

const ChatList = ({ activeConversation, setActiveConversation, setOtherMember }: ChatListProps) => {
  const { isAuthenticated, user } = useAuth();
  const { subscribe } = useWS();
  const [listCursor, setListCursor] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<Map<string, boolean>>(new Map());
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const searchActive = search.trim().length >= 3;

  const conversationsQuery = useQuery({
    queryKey: ["conversations", "list", listCursor],
    placeholderData: keepPreviousData,
    queryFn: async () => await getConversations(listCursor),
    enabled: isAuthenticated,
  });

  const userSearchQuery = useQuery({
    queryKey: ["users", "search", debouncedSearch],
    queryFn: async () => await searchUsers(debouncedSearch),
    enabled: isAuthenticated && debouncedSearch.trim().length >= 3,
  });

  const startConversation = useMutation({
    mutationFn: async (target: UserPublic) => await createConversation(target.id),
    onSuccess: (data, target) => {
      setActiveConversation(data.conversation_id);
      setOtherMember(target);
      setSearch("");
      setConversations((prev) => {
        if (prev.some((c) => c.conversation_id === data.conversation_id)) {
          return prev.map((c) =>
            c.conversation_id === data.conversation_id ? { ...c, unread_count: 0 } : c,
          );
        }
        return [
          {
            conversation_id: data.conversation_id,
            other_user: target,
            unread_count: 0,
            last_message_at: new Date().toISOString(),
          },
          ...prev,
        ];
      });
    },
  });

  const handleSelect = (conv: ConversationListItem) => {
    setActiveConversation(conv.conversation_id);
    setOtherMember(conv.other_user);
    setConversations((prev) =>
      prev.map((c) => (c.conversation_id === conv.conversation_id ? { ...c, unread_count: 0 } : c)),
    );
  };

  useEffect(() => {
    if (conversationsQuery.data?.conversations) {
      setConversations((prev) => {
        const existingIds = new Set(prev.map((c) => c.conversation_id));
        const newOnes = conversationsQuery.data!.conversations.filter(
          (c: ConversationListItem) => !existingIds.has(c.conversation_id),
        );
        return [...prev, ...newOnes].sort(byRecent);
      });
    }
  }, [conversationsQuery.data]);

  // new_message
  useEffect(() => {
    return subscribe<{ conversation_id: string; content: string; created_at: string }>(
      "new_message",
      (payload) => {
        setConversations((prev) => {
          const patched = prev.map((c) =>
            c.conversation_id === payload.conversation_id
              ? {
                  ...c,
                  last_message: payload.content,
                  last_message_at: payload.created_at,
                  unread_count:
                    payload.conversation_id === activeConversation ? 0 : c.unread_count + 1,
                }
              : c,
          );
          return [...patched].sort(byRecent);
        });
      },
    );
  }, [subscribe, activeConversation]);

  // read_receipt
  useEffect(() => {
    return subscribe("read_receipt", (payload: { conversation_id: string; reader_id: number }) => {
      if (payload.reader_id !== user?.id) return;
      setConversations((prev) =>
        prev.map((c) =>
          c.conversation_id === payload.conversation_id ? { ...c, unread_count: 0 } : c,
        ),
      );
    });
  }, [subscribe, user?.id]);

  // presence_change (wire up now, will fire once backend implements it)
  useEffect(() => {
    return subscribe("presence_change", (payload: { user_id: string; online: boolean }) => {
      setOnlineUsers((prev) => new Map(prev).set(payload.user_id, payload.online));
    });
  }, [subscribe]);

  return (
    <Container
      sx={{
        width: "40%",
        padding: "0px !important",
        borderRight: "1px solid var(--color-gray-200)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "var(--size)",
          borderBottom: "1px solid var(--color-gray-200)",
        }}
      >
        <Typography variant="h6" align="left">
          Messages
        </Typography>
        <TextField
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search users..."
          sx={{ mt: 1 }}
          slotProps={{
            input: {
              endAdornment: search ? (
                <CloseRounded
                  onClick={() => setSearch("")}
                  sx={{ color: "var(--color-gray-500)", cursor: "pointer" }}
                />
              ) : undefined,
            },
          }}
        />
      </Box>
      <List disablePadding sx={{ flex: 1, overflowY: "auto" }}>
        {searchActive ? (
          userSearchQuery.data?.items.length === 0 ? (
            <Typography
              variant="subtitle2"
              sx={{ padding: "var(--size)", color: "var(--color-gray-500)" }}
            >
              No users found
            </Typography>
          ) : (
            (userSearchQuery.data?.items ?? []).map((u, i) => (
              <Box key={u.id}>
                <ListItemButton onClick={() => startConversation.mutate(u)}>
                  <ListItemAvatar>
                    <Avatar {...stringAvatar(u.full_name ?? u.username)} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={u.full_name ?? u.username}
                    secondary={`@${u.username}`}
                    primaryTypographyProps={{ variant: "subtitle1", noWrap: true }}
                    secondaryTypographyProps={{ variant: "subtitle2", noWrap: true }}
                  />
                </ListItemButton>
                {i < (userSearchQuery.data?.items.length ?? 0) - 1 && <Divider />}
              </Box>
            ))
          )
        ) : conversationsQuery.isLoading ? (
          Array(5)
            .fill(null)
            .map((_, i) => (
              <ListItem key={i}>
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton width="55%" />}
                  secondary={<Skeleton width="80%" />}
                />
              </ListItem>
            ))
        ) : (
          conversations.map((conv, i) => (
            <Box key={conv.conversation_id}>
              <ListItemButton
                selected={conv.conversation_id === activeConversation}
                onClick={() => handleSelect(conv)}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    variant="dot"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    sx={{
                      "& .MuiBadge-dot": {
                        bgcolor: onlineUsers.get(String(conv.other_user.id))
                          ? "#3DD68C"
                          : "#9E9E9E",
                        boxShadow: "0 0 0 2px #fff",
                      },
                    }}
                  >
                    <Avatar
                      {...stringAvatar(conv.other_user.full_name ?? conv.other_user.username)}
                    />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={conv.other_user.full_name ?? conv.other_user.username}
                  secondary={
                    (conv.last_message?.length ?? 0) > 53
                      ? conv.last_message!.substring(0, 53) + "..."
                      : conv.last_message
                  }
                  primaryTypographyProps={{ variant: "subtitle1", noWrap: true }}
                  secondaryTypographyProps={{ variant: "subtitle2", noWrap: true }}
                />
                {conv.unread_count > 0 && (
                  <Badge badgeContent={conv.unread_count} color="primary" sx={{ ml: 1, mr: 0.5 }} />
                )}
              </ListItemButton>
              {i < conversations.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </List>

      {conversationsQuery.data?.next_cursor && (
        <Box sx={{ padding: "var(--size)", borderTop: "1px solid var(--color-gray-200)" }}>
          <Button
            fullWidth
            size="small"
            onClick={() => setListCursor(conversationsQuery.data!.next_cursor)}
          >
            Load more
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default ChatList;

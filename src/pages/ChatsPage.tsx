import type { UserPublic } from "@/api/chatApi";
import Chat from "@/components/chats/Chat";
import ChatList from "@/components/chats/ChatList";
import { Container } from "@mui/material";
import { useState } from "react";

export default function ChatsPage() {
  const [activeConversation, setActiveConversation] = useState("");
  const [otherMember, setOtherMember] = useState<UserPublic | undefined>();
  return (
    <Container
      sx={{
        display: "flex",
        maxWidth: "100% !important",
        width: "100%",
        margin: "0 auto !important",
        gap: "0px",
        padding: "0px !important",
        background: "#fff",
        height: "100vh",
      }}
    >
      <ChatList
        activeConversation={activeConversation}
        setActiveConversation={setActiveConversation}
        setOtherMember={setOtherMember}
      />
      <Chat activeConversation={activeConversation} otherMember={otherMember} />
    </Container>
  );
}

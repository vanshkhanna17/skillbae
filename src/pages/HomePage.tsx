import { getPosts, getUserCategories } from "@/api/feedApi.ts";
import { getAccessToken } from "@/api/tokenStore.ts";
import Card from "@/components/Card.tsx";
import FeedFilter from "@/components/FeedFilter.tsx";
import ModalDialog from "@/components/ModalDialog.tsx";
import PostTextField from "@/components/formFields/PostTextField.tsx";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import { Avatar, Box, Button, Container, Divider, Skeleton, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

export interface Post {
  user?: string;
  username?: string;
  post?: string;
  date?: string;
}

const HomePage = () => {
  const [userCategories, setUserCategories] = useState<number[]>([]);
  const getPostsQuery = useQuery({
    queryKey: ["feed", "posts"],
    queryFn: getPosts,
    enabled: !!getAccessToken(),
    retry: false,
  });

  const getUserCategoriesQuery = useQuery({
    queryKey: ["feed", "user", "categories"],
    queryFn: getUserCategories,
    enabled: !!getAccessToken(),
    retry: false,
  });

  console.warn(getUserCategoriesQuery.data);

  useEffect(() => {
    if (getUserCategoriesQuery.data) {
      setUserCategories(getUserCategoriesQuery.data);
    }
  }, [getUserCategoriesQuery.data]);

  console.log(userCategories);

  const postList = getPostsQuery.data ?? [
    {},
    {
      user: "Vohn Koe",
      username: "john21",
      post: "<p>Need user for following requirements:</p><ul><li><p>React</p></li><li><p>Python</p></li><li><p>SQL</p></li></ul><p></p>",
      date: "20-01-2026",
    },
    {
      user: "Kohn Poe",
      username: "john21",
      post: "<p>Need user for following requirements:</p><ul><li><p>React</p></li><li><p>Python</p></li><li><p>SQL</p></li></ul><p></p>",
      date: "20-01-2026",
    },
    {
      user: "Tohn Doe",
      username: "john21",
      post: "<p>Need user for following requirements:</p><ul><li><p>React</p></li><li><p>Python</p></li><li><p>SQL</p></li></ul><p></p>",
      date: "20-01-2026",
    },
    {
      user: "Bohn Doe",
      username: "john21",
      post: "<p>Need user for following requirements:</p><ul><li><p>React</p></li><li><p>Python</p></li><li><p>SQL</p></li></ul><p></p>",
      date: "20-01-2026",
    },
    {
      user: "Lohn Koe",
      username: "john21",
      post: "<p>Need user for following requirements:</p><ul><li><p>React</p></li><li><p>Python</p></li><li><p>SQL</p></li></ul><p></p>",
      date: "20-01-2026",
    },
    {
      user: "Rohn Toe",
      username: "john21",
      post: "<p>Need user for following requirements:</p><ul><li><p>React</p></li><li><p>Python</p></li><li><p>SQL</p></li></ul><p></p>",
      date: "20-01-2026",
    },
  ];
  const [open, setOpen] = useState<boolean>(false);
  const [post, setPost] = useState<Post>();
  const handleClose = () => setOpen(false);
  const [caption, setCaption] = useState<string>("");
  const handleSubmit = () => {
    console.log("Saved HTML:", caption);
  };
  function stringToColor(string: string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  }

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }
  return (
    <>
      <Container
        sx={{
          maxWidth: "var(--container-size) !important",
          margin: "0 auto !important",
          display: "flex",
          flexDirection: "column",
          gap: "var(--size-l)",
        }}
      >
        <FeedFilter categories={userCategories} setCategories={setUserCategories} />
        {postList.map((post: Post, index: number) =>
          post.user ? (
            <Card key={`post-${index}`}>
              <Box sx={{ display: "flex", gap: "var(--size)", alignItems: "center" }}>
                {post ? (
                  <Avatar {...stringAvatar(post.user ?? "")} />
                ) : (
                  <Skeleton variant="circular" />
                )}
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6">{post.user}</Typography>
                  <Box sx={{ display: "flex" }}>
                    <Typography>@{post.username}</Typography>{" "}
                    <Box component="span" sx={{ mx: 1, opacity: 0.5 }}>
                      •
                    </Box>{" "}
                    <Typography>{post.date}</Typography>
                  </Box>
                </Box>
              </Box>
              <Box dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.post ?? "") }} />
              <Divider />
              <Button
                variant="text"
                onClick={() => {
                  setOpen(true);
                  setPost(post);
                }}
                sx={{
                  width: "fit-content",
                  gap: "5px",
                  alignItems: "flex-end",
                  color: "var(--color-black)",
                  ":hover": {
                    background: "none",
                    color: "var(--color-text-secondary)",
                  },
                }}
              >
                <ChatBubbleOutlineOutlinedIcon /> 23
              </Button>
            </Card>
          ) : (
            <Card key={`post-${index}`}>
              <Box sx={{ display: "flex", gap: "var(--size)", alignItems: "center" }}>
                <Skeleton variant="circular" width={40} height={40} />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={32} width={105} />
                  <Box sx={{ display: "flex" }}>
                    <Skeleton variant="text" height={24} width={60} />
                    <Box component="span" sx={{ mx: 1, opacity: 0.5 }}>
                      •
                    </Box>{" "}
                    <Skeleton variant="text" height={24} width={60} />
                  </Box>
                </Box>
              </Box>
              <Skeleton variant="rounded" height={200} />
              <Divider />
              <Skeleton variant="text" width={64} height={40} />
            </Card>
          ),
        )}
      </Container>
      <ModalDialog handleClose={handleClose} open={open}>
        <Box sx={{ display: "flex", width: "100%", gap: "var(--size)" }}>
          <Box dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post?.post || "") }}></Box>
          <Box sx={{ flex: "1", display: "flex", flexDirection: "column", gap: "var(--size-xs)" }}>
            <PostTextField value={caption} onChange={setCaption} />
            <Button variant="contained" onClick={handleSubmit}>
              Send
            </Button>
          </Box>
        </Box>
      </ModalDialog>
    </>
  );
};

export default HomePage;

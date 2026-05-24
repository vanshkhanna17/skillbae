import { getPostComments, getPosts, getUserCategories, saveUserCategories } from "@/api/feedApi.ts";
import Card from "@/components/Card.tsx";
import FeedFilter from "@/components/FeedFilter.tsx";
import ModalDialog from "@/components/ModalDialog.tsx";
import { useAuth } from "@/context/AuthProvider.tsx";
import { stringAvatar } from "@/utils/avatarUtils.ts";
import { NearMeRounded } from "@mui/icons-material";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow, parseISO } from "date-fns";
import DOMPurify from "dompurify";
import { useEffect, useMemo, useState } from "react";

export interface Post {
  safePost?: string | TrustedHTML;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
    avatar_url: string;
    profile: string;
    experience: number;
    full_name: string;
  };
  username?: string;
  content: string;
  publish_date: string;
  category: { id: number; category: string };
  comments?: [];
  id: number;
}

const SKELETON_COUNT = 4;

const PostSkeleton = () => {
  return (
    <Card>
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
  );
};

const HomePage = () => {
  const [userCategories, setUserCategories] = useState<number[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [post, setPost] = useState<Post>();
  const [caption, setCaption] = useState<string>("");
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const handleClose = () => setOpen(false);

  const getPostsQuery = useQuery({
    queryKey: ["feed", "posts"],
    queryFn: getPosts,
    enabled: isAuthenticated,
  });

  const getUserCategoriesQuery = useQuery({
    queryKey: ["feed", "user", "categories"],
    queryFn: getUserCategories,
    enabled: isAuthenticated,
  });

  const getCommentsQuery = useQuery({
    queryKey: ["feed", "post", "comments", post?.id],
    queryFn: () => getPostComments(post!.id),
    enabled: isAuthenticated && !!post?.id,
  });

  const saveUserCategoriesMutation = useMutation({
    mutationFn: (data: number[]) => saveUserCategories(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["feed", "posts"] }),
  });

  const handleCategoriesChange = (categories: number[]) => {
    if (JSON.stringify(categories) === JSON.stringify(userCategories)) return;

    setUserCategories(categories);
    saveUserCategoriesMutation.mutate(categories);
  };

  useEffect(() => {
    if (getUserCategoriesQuery.data) {
      setUserCategories(getUserCategoriesQuery.data);
    }
  }, [getUserCategoriesQuery.data]);

  const postList = useMemo(() => getPostsQuery.data, [getPostsQuery.data]);

  const sanitizedPosts = useMemo(() => {
    return postList?.map((p: Post) => ({
      ...p,
      safePost: DOMPurify.sanitize(p.content ?? ""),
    }));
  }, [postList]);

  const handleCommentSubmit = () => {
    console.log("Saved HTML:", caption);
  };

  function formatPostTime(timestamp: string) {
    if (!timestamp) return "";
    try {
      return formatDistanceToNow(parseISO(`${timestamp}Z`), { addSuffix: true });
    } catch {
      return "";
    }
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
        <FeedFilter categories={userCategories} setCategories={handleCategoriesChange} />
        {getPostsQuery.isLoading
          ? Array.from({ length: SKELETON_COUNT }).map((_, i) => <PostSkeleton key={i} />)
          : sanitizedPosts.map((post: Post, index: number) => (
              <Card key={`post-${index}`}>
                <Box sx={{ display: "flex", gap: "var(--size)", alignItems: "center" }}>
                  {post ? (
                    <Avatar {...stringAvatar(post.user.full_name ?? "")} />
                  ) : (
                    <Skeleton variant="circular" />
                  )}
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="h6">{post.user.full_name}</Typography>
                    <Box sx={{ display: "flex" }}>
                      <Typography>@{post.username}</Typography>{" "}
                      <Box component="span" sx={{ mx: 1, opacity: 0.5 }}>
                        •
                      </Box>{" "}
                      <Typography>{formatPostTime(post.publish_date)}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box dangerouslySetInnerHTML={{ __html: post.safePost ?? "" }} />
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
                  <ChatBubbleOutlineOutlinedIcon /> {post.comments?.length}
                </Button>
              </Card>
            ))}
      </Container>
      <ModalDialog handleClose={handleClose} open={open}>
        <Box
          sx={{
            display: "flex",
            padding: "0px",
            width: "100%",
            height: "60vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: "1",
              width: "100%",
              gap: "var(--size)",
              padding: "32px 0 32px 32px",
            }}
          >
            <Box sx={{ display: "flex", gap: "var(--size)", alignItems: "center" }}>
              {post ? (
                <Avatar {...stringAvatar(post.user.full_name ?? "")} />
              ) : (
                <Skeleton variant="circular" />
              )}
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ fontWeight: "bold" }}>{post?.user.full_name}</Typography>
                <Box sx={{ display: "flex" }}>
                  <Typography>@{post?.username}</Typography>{" "}
                  <Box component="span" sx={{ mx: 1, opacity: 0.5 }}>
                    •
                  </Box>{" "}
                  <Typography>{formatPostTime(post?.publish_date ?? "")}</Typography>
                </Box>
              </Box>
            </Box>
            <Box dangerouslySetInnerHTML={{ __html: post?.safePost ?? "" }}></Box>
          </Box>
          <Divider orientation="vertical" />
          <Box
            sx={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              paddingTop: "var(--size)",
              paddingBottom: "var(--size)",
            }}
          >
            <Box>Comments ({getCommentsQuery.data?.length})</Box>
            <Box sx={{ flex: 1, background: "var(--color-gray-200)" }}></Box>
            <TextField
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder="Write a comment"
              slotProps={{
                input: {
                  endAdornment: (
                    <NearMeRounded
                      onClick={handleCommentSubmit}
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
      </ModalDialog>
    </>
  );
};

export default HomePage;

import {
  createComment,
  getPostComments,
  getPosts,
  getUserCategories,
  saveUserCategories,
} from "@/api/feedApi.ts";
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

interface Comment {
  id: number;
  comment_text: string;
  publish_date: string;
  user: Post["user"];
}
import { formatDistanceToNow, parseISO } from "date-fns";
import DOMPurify from "dompurify";
import { useEffect, useMemo, useState } from "react";

export interface Post {
  safePost?: string | TrustedHTML;
  user: {
    id: number;
    email: string;
    username: string;
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

  const createCommentMutation = useMutation({
    mutationFn: (text: string) => createComment({ comment_text: text, post_id: post!.id }),
    onSuccess: () => {
      setCaption("");
      queryClient.invalidateQueries({ queryKey: ["feed", "post", "comments", post?.id] });
      queryClient.invalidateQueries({ queryKey: ["feed", "posts"] });
    },
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
    const trimmed = caption.trim();
    if (!trimmed || !post?.id) return;
    createCommentMutation.mutate(trimmed);
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
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          padding: "var(--size)",
        }}
      >
        <Container
          sx={{
            maxWidth: "var(--container-size) !important",
            margin: "0 auto !important",
            display: "flex",
            flexDirection: "column",
            gap: "var(--size-l)",
          }}
        >
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
                        <Typography>@{post.user.username}</Typography>{" "}
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
        <Box
          sx={{
            position: "sticky",
            top: 0,
            height: "100vh",
            flexShrink: 0,
            maxWidth: "280px",
            width: "100%",
          }}
        >
          <FeedFilter categories={userCategories} setCategories={handleCategoriesChange} />
        </Box>
      </Box>

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
                  <Typography>@{post?.user?.username}</Typography>{" "}
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
            <Box sx={{ px: 2, pt: 1 }}>
              Comments ({getCommentsQuery.data?.length ?? post?.comments?.length ?? 0})
            </Box>
            <Box
              sx={{ flex: 1, overflowY: "auto", px: 2, py: 1, display: "flex", flexDirection: "column", gap: 1.5 }}
            >
              {getCommentsQuery.isLoading
                ? Array(3)
                    .fill(null)
                    .map((_,  i) => (
                      <Box key={`comment-skeleton-${i}`} sx={{ display: "flex", gap: 1 }}>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton width="40%" height={20} />
                          <Skeleton width="80%" height={20} />
                        </Box>
                      </Box>
                    ))
                : getCommentsQuery.data?.map((c: Comment) => (
                    <Box key={c.id} sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                      <Avatar
                        {...stringAvatar(c.user.full_name)}
                        sx={{ width: 32, height: 32, fontSize: "0.75rem" }}
                      />
                      <Box>
                        <Typography variant="subtitle2">{c.user.full_name}</Typography>
                        <Typography variant="body2">{c.comment_text}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatPostTime(c.publish_date)}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
            </Box>
            <TextField
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleCommentSubmit();
                }
              }}
              placeholder="Write a comment"
              sx={{ px: 2, pb: 1 }}
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

import { Avatar, Box, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import Card from "./Card.tsx";

const FeedPosts = () => {
  const postList = [
    {
      user: "John Doe",
      username: "john21",
      post: "<p>Need user for following requirements:</p><ul><li><p>React</p></li><li><p>Python</p></li><li><p>SQL</p></li></ul><p></p>",
      date: "20-01-2026",
    },
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
      {postList.map((post, index) => (
        <Card key={`post-${index}`}>
          <Box sx={{ display: "flex", gap: "var(--size)", alignItems: "center" }}>
            <Avatar {...stringAvatar(post.user)} />
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
          <Box dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.post) }} />
        </Card>
      ))}
    </>
  );
};

export default FeedPosts;

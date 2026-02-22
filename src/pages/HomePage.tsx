import FeedPosts from "@/components/FeedPosts.tsx";
import { Container } from "@mui/material";
const HomePage = () => {
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
        <FeedPosts />
      </Container>
    </>
  );
};

export default HomePage;

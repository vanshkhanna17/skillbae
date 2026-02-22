import { CopyrightOutlined } from "@mui/icons-material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import { Container, Grid, Typography } from "@mui/material";
import LoginForm from "../components/auth/LoginForm.tsx";
import RegisterForm from "../components/auth/RegisterForm.tsx";
import "./login-page.css";

const LoginPage = ({ register }: { register: boolean }) => {
  return (
    <Container className="landing-conatiner" maxWidth={false}>
      <Grid container spacing={3} sx={{ height: "100vh" }}>
        <Grid size={{ xs: 12, md: 6 }} className="text-content" container direction={"column"}>
          <Grid>
            <Typography variant="h3">SkillBae</Typography>
            <Typography variant="h5">Connect and collab with the world around you.</Typography>
          </Grid>
          <Grid>
            <Grid container className="bullets-container">
              <div className="icon-container">
                <PeopleOutlineIcon fontSize="medium" />
              </div>
              <Grid>
                <Typography variant="h6">Connect with Friends</Typography>
                <Typography variant="subtitle1">
                  Connect and collab with the world around you.
                </Typography>
              </Grid>
            </Grid>
            <Grid container className="bullets-container">
              <div className="icon-container">
                <PhotoOutlinedIcon fontSize="medium" />
              </div>
              <Grid>
                <Typography variant="h6">Share your story.</Typography>
                <Typography variant="subtitle1">
                  Post, photos, videos and updates about your life.
                </Typography>
              </Grid>
            </Grid>
            <Grid container className="bullets-container">
              <div className="icon-container">
                <ChatOutlinedIcon fontSize="medium" />
              </div>
              <Grid>
                <Typography variant="h6">Chat with connections</Typography>
                <Typography variant="subtitle1">
                  Get real time updates from your network.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid container sx={{ gap: "5px", alignItems: "center" }}>
            <CopyrightOutlined />
            <Typography variant="subtitle2"> 2026 SkillBae. All rights reserved.</Typography>
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} className="form-content">
          {register ? <RegisterForm /> : <LoginForm />}
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;

import "@/components/nav/navigation-bar.css";
import { useAuth } from "@/context/AuthProvider.tsx";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import PostCreate from "../PostCreate.tsx";

const NavigationBar = () => {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Typography
        variant="h4"
        color="var(--color-text-secondary)"
        textAlign="left"
        className="logo-nav"
      >
        SkillBae
      </Typography>
      <div className="nav-link-container">
        <Grid direction="column" container>
          <Grid className="nav-item">
            <NavLink to="/">
              <HomeOutlinedIcon className="nav-icons" />
              Home
            </NavLink>
          </Grid>
          <Grid className="nav-item">
            <NavLink to="/chats">
              <ChatOutlinedIcon className="nav-icons" />
              Messages
            </NavLink>
          </Grid>
          <Grid className="nav-item">
            <NavLink to="/notifications">
              <NotificationsOutlinedIcon className="nav-icons" />
              Notifications
            </NavLink>
          </Grid>
          <Grid className="nav-item">
            <Button onClick={() => setOpen(true)} className="nav-button">
              <CreateOutlinedIcon className="nav-icons" />
              Create
            </Button>
          </Grid>
          <Grid className="nav-item">
            <NavLink to="/profile">
              <PersonOutlinedIcon className="nav-icons" />
              Profile
            </NavLink>
          </Grid>
          <Grid className="nav-item">
            <NavLink to="/settings">
              <SettingsOutlinedIcon className="nav-icons" />
              Settings
            </NavLink>
          </Grid>
        </Grid>
        <Box className="nav-item">
          <Button onClick={() => logout()} className="nav-button">
            <LogoutOutlinedIcon className="nav-icons" /> Logout
          </Button>
        </Box>
      </div>
      <PostCreate open={open} setOpen={setOpen} />
    </>
  );
};
export default NavigationBar;

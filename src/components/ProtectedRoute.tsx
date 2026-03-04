import "@/components/nav/navigation-bar.css";
import { useAuth } from "@/context/AuthProvider.tsx";
import { Container, Grid } from "@mui/material";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import NavigationBar from "./nav/NavigationBar.tsx";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <>
      <Container maxWidth={false} disableGutters>
        <Grid container className="parent-container">
          <Grid size={2} className="nav-container">
            <NavigationBar />
          </Grid>
          <Grid size={10} className="content-container">
            {children}
          </Grid>
        </Grid>
      </Container>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;

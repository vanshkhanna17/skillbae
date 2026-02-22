import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import HomePage from "@/pages/HomePage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chats"
        element={
          <ProtectedRoute>
            <p>Coming Soon</p>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <p>Coming Soon</p>
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <p>Coming Soon</p>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <p>Coming Soon</p>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <p>Coming Soon</p>
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginPage register={false} />} />
      <Route path="/register" element={<LoginPage register={true} />} />
    </Routes>
  );
};

export default AppRoutes;

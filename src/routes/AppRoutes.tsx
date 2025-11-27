import ProtectedRoute from "@/components/ProtectedRoute";
import General from "@/pages/General";
import LoginForm from "@/pages/LoginForm";
import RegisterForm from "@/pages/RegisterForm";
import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <General />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
    </Routes>
  );
};

export default AppRoutes;

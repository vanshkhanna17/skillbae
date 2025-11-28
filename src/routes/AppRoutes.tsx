import ProtectedRoute from "@/components/ProtectedRoute.tsx";
import General from "@/pages/General.tsx";
import LoginForm from "@/pages/LoginForm.tsx";
import RegisterForm from "@/pages/RegisterForm.tsx";
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

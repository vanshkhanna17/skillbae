import LoginForm from "@/components/auth/login/LoginForm";
import General from "@/components/General";
import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
  const loggedIn = false;
  return (
    <Routes>
      {!loggedIn ? (
        <Route path="/" element={<LoginForm />} />
      ) : (
        <Route path="/" element={<General />} />
      )}
    </Routes>
  );
};

export default AppRoutes;

import RHFTextField from "@/components/formFields/RHFTextField";
import { useAuth } from "@/context/AuthProvider";
import type { LoginSchemaType } from "@/schemas/loginScema";
import { loginSchema } from "@/schemas/loginScema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate } from "react-router-dom";

const LoginForm = () => {
  const { login, isAuthenticated } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [redirect, setRedirect] = useState<boolean>(false);
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = async (data: LoginSchemaType) => {
    setLoginError(null);
    try {
      await login(data.username, data.password);
      setRedirect(true);
    } catch (err) {
      setLoginError("Invalid request" + err);
    }
  };
  if (isAuthenticated || redirect) {
    <Navigate to="/" replace />;
  }
  return (
    <Box
      className="container"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      autoComplete="off"
    >
      <Typography>Login</Typography>
      <RHFTextField
        control={control}
        name="username"
        required
        label="Username/Email"
        placeholder="abc@xyz.com"
        fullWidth={true}
      />
      <RHFTextField
        control={control}
        name="password"
        required
        label="Password"
        type="password"
        fullWidth={true}
      />
      <Button type="submit" variant="contained" disabled={isSubmitting}>
        Login
      </Button>
      <p>
        New User?{" "}
        <Button component={Link} variant="text" to="/register">
          Sign Up
        </Button>
      </p>
      {loginError && <Typography color="error">{loginError}</Typography>}
    </Box>
  );
};

export default LoginForm;

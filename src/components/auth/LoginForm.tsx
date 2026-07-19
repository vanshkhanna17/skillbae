import RHFTextField from "@/components/formFields/RHFTextField.tsx";
import { useAuth } from "@/context/AuthProvider.tsx";
import "@/pages/login-page.css";
import { loginSchema, type LoginSchemaType } from "@/schemas/loginScema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockOutline, MailOutline } from "@mui/icons-material";
import { Box, Button, Grid, InputAdornment, Typography } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { login, isAuthenticated } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const { state } = useLocation();
  const navigate = useNavigate();
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
      navigate("/", { replace: true });
    } catch (err) {
      setLoginError("Invalid request" + err);
    }
  };
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <Box
      className="container"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      autoComplete="off"
    >
      {state?.register && (
        <Typography>Registration Successful. Please login to continue</Typography>
      )}
      <Grid container direction="column" spacing={1} sx={{ marginBottom: "32px" }}>
        <Typography variant="h5">Welcome Back</Typography>
        <Typography variant="subtitle1">Sign in to continue to SkillBae</Typography>
      </Grid>
      <Grid container direction="column" spacing={3.5}>
        <RHFTextField
          control={control}
          name="username"
          required
          label="Username/Email"
          placeholder="abc@xyz.com"
          fullWidth={true}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutline />
                </InputAdornment>
              ),
            },
          }}
        />
        <RHFTextField
          control={control}
          name="password"
          required
          label="Password"
          type="password"
          fullWidth={true}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutline />
                </InputAdornment>
              ),
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting}
          sx={{ backgroundColor: "oklch(48.8% 0.243 264.376)" }}
        >
          Sign In
        </Button>
      </Grid>
      <p>
        Don't have an account?&nbsp;&nbsp;
        <Button component={Link} variant="text" to="/register" sx={{ display: "contents" }}>
          Sign Up
        </Button>
      </p>
      {loginError && <Typography color="error">{loginError}</Typography>}
      {/* <Divider sx={{ margin: "10px 0px" }}>
        <Typography variant="body2">Or continue with</Typography>
      </Divider>
      <Grid container justifyContent="center" spacing={2}>
        <Button variant="outlined" sx={{ borderColor: "oklch(87.2% 0.01 258.338)" }}>
          <GoogleIcon />
        </Button>
        <Button variant="outlined" sx={{ borderColor: "oklch(87.2% 0.01 258.338)" }}>
          <FacebookSharpIcon />
        </Button>
      </Grid> */}
    </Box>
  );
};

export default LoginForm;

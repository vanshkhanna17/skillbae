import { registerRequest, type RegisterFormInterface } from "@/api/authApi.ts";
import RHFTextField from "@/components/formFields/RHFTextField.tsx";
import { useAuth } from "@/context/AuthProvider.tsx";
import { registerSchema, type RegisterSchemaType } from "@/schemas/registerSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import RHFUsernameField from "../formFields/RHFUsernameField";

const RegisterForm = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [registerError, setRegisterError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      profile: "",
      experience: null,
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormInterface) => registerRequest(data),
    onSuccess: () => {
      navigate("/login", { state: { register: true }, replace: true });
    },
    onError: (error: Error) => {
      setRegisterError(error.message ?? "Registration failed. Please try again.");
    },
  });

  const onSubmit = (data: RegisterSchemaType) => {
    setRegisterError(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword: _, ...payload } = data;
    registerMutation.mutateAsync(payload as RegisterFormInterface);
  };

  if (isAuthenticated) {
    <Navigate to="/" replace />;
  }

  return (
    <>
      <Box
        className="container"
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
      >
        <Grid container direction="column" spacing={1} sx={{ marginBottom: "32px" }}>
          <Typography variant="h5">Create Account</Typography>
          <Typography variant="subtitle1">Sign up to get started with SocialHub</Typography>
        </Grid>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--size)" }}>
          <RHFTextField
            name="first_name"
            control={control}
            label="First Name"
            placeholder="John"
            required
          />
          <RHFTextField
            name="last_name"
            control={control}
            label="Last Name"
            placeholder="Doe"
            required
          />
          <RHFUsernameField name="username" control={control} />
          <RHFTextField
            name="email"
            control={control}
            type="email"
            label="Email"
            placeholder="abc@xyz.com"
            required
          />
          <RHFTextField
            name="password"
            control={control}
            type="password"
            label="Password"
            required
          />
          <RHFTextField
            name="confirmPassword"
            control={control}
            type="password"
            label="Confirm Password"
            required
          />
          <RHFTextField
            name="profile"
            control={control}
            label="Profile"
            placeholder="Wedding Photogropher"
          />
          <RHFTextField
            name="experience"
            control={control}
            label="Experience (in years)"
            type="number"
            placeholder="5.5"
          />
        </Box>
        {registerError && (
          <Typography color="error" sx={{ mt: 1 }}>
            {registerError}
          </Typography>
        )}
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          Sing Up
        </Button>
        <p>
          Already have an account?&nbsp;&nbsp;
          <Button component={Link} variant="text" to="/login" sx={{ display: "contents" }}>
            Sign In
          </Button>
        </p>
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
    </>
  );
};
export default RegisterForm;

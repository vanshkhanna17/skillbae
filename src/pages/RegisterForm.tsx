import { registerRequest, type RegisterFormInterface } from "@/auth/authApi.ts";
import RHFTextField from "@/components/formFields/RHFTextField.tsx";
import { useAuth } from "@/context/AuthProvider.tsx";
import { registerSchema, type RegisterSchemaType } from "@/schemas/registerSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
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
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });

  const onSubmit = (data: RegisterSchemaType) => {
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
        <Typography>Register</Typography>
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
        <RHFTextField
          name="email"
          control={control}
          type="email"
          label="Email"
          placeholder="abc@xyz.com"
          required
        />
        <RHFTextField name="password" control={control} type="password" label="Password" required />
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
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          Submit
        </Button>
      </Box>
    </>
  );
};
export default RegisterForm;

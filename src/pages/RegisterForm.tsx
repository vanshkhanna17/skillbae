import RHFTextField from "@/components/formFields/RHFTextField";
import { registerSchema, type RegisterSchemaType } from "@/schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

const RegisterForm = () => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
      profile: "",
      experience: null,
    },
  });
  const onSubmit = (data: RegisterSchemaType) => {
    console.log("register data:", data);
  };
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
          name="firstname"
          control={control}
          label="First Name"
          placeholder="John"
          required
        />
        <RHFTextField
          name="lastname"
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

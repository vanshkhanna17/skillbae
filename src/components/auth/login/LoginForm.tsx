import { Box, Button, TextField } from "@mui/material";

const LoginForm = () => {
  return (
    <Box className="container" component="form" noValidate autoComplete="off">
      <TextField required label="Username/Email" placeholder="abc@xyz.com" />
      <TextField required label="Password" type="Password" />
      <Button variant="contained">Login</Button>
      <p>
        New User? <Button variant="text">Sign Up</Button>
      </p>
    </Box>
  );
};

export default LoginForm;

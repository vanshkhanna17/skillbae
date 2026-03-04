import { createTheme } from "@mui/material/styles";
import colors from "./colors.ts";

const theme = createTheme({
  palette: {
    primary: { main: colors.primary.main },
    secondary: { main: colors.secondary.main },
  },
  typography: {
    // Default font family for body text
    fontFamily: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif',

    // Headings use Poppins
    h1: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },

    // Body text uses Lato
    body1: {
      fontFamily: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
    },
    subtitle1: {
      fontFamily: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
    },

    // Buttons and other components
    button: {
      fontFamily: '"Lato", "Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
      textTransform: "none", // Disable uppercase transformation
      fontSize: "1rem",
      // display: "contents",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.secondary.main,
            borderWidth: 2,
          },
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&.Mui-focused": {
            color: theme.palette.secondary.main,
          },
        }),
      },
    },
  },
});

export default theme;

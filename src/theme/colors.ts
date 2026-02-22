// Shared color constants for both MUI theme and CSS
export const colors = {
  primary: {
    main: "#2B85D9",
    light: "rgba(43, 133, 217, 0.08)",
    hover: "rgba(43, 133, 217, 0.12)",
    mainText: "oklch(48.8% 0.243 264.376)",
  },
  secondary: {
    main: "#535bf2",
    light: "rgba(83, 91, 242, 0.08)",
    hover: "rgba(83, 91, 242, 0.12)",
    mainText: "oklch(54.6% 0.245 262.881)",
  },
  gray: {
    50: "oklch(98.5% 0.002 247.839)",
    200: "#e5e7eb",
    700: "#374151",
  },
} as const;

export default colors;

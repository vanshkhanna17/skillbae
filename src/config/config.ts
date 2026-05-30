// ---------------------------------------------------------------
// This module centralizes all environment variables used in the app.
// Instead of accessing import.meta.env everywhere (fragile & error-prone),
// we read the values ONCE, validate them, and expose a clean `config` object.
//
// Benefits:
//  - Central config source
//  - Type-safe access to environment variables
//  - Immediate runtime errors if required env variables are missing
//  - Cleaner code and better developer experience
// ---------------------------------------------------------------

const env = import.meta.env;

// ---------------------------------------------------------------
// Utility function: ensures a required environment variable exists.
// If the variable is missing, the app will throw a clear error rather than failing silently.
//
// Why? Because missing API URLs or keys cause confusing runtime errors later.
// Better to fail EARLY with a meaningful message.
// ---------------------------------------------------------------
function required(name: keyof ImportMetaEnv): string {
  if (!env[name]) {
    throw new Error(`❌ Missing required environment variable: ${name}`);
  }
  return env[name];
}

export const config = {
  // Required environment variable (throws error if missing)
  apiBaseUrl: required("VITE_API_BASE_URL"),
  wsURL: required("VITE_API_WS_URL"),
  // Optional environment variables with defaults
  appName: env.VITE_APP_NAME ?? "SkillBae",
  environment: env.VITE_ENV ?? "development",
} as const;

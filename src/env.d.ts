/// <reference types="vite/client" />

declare module "*.svg" {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_ENV?: "development" | "staging" | "production";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

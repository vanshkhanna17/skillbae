import { clearAccessToken, setAccessToken } from "../lib/tokenStore.ts";
import { fetchWithRetry, postPutRequests } from "./baseApi.ts";

export interface RegisterFormInterface {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  profile?: string;
  experience?: number;
}

export async function registerRequest(payload: RegisterFormInterface) {
  const data = await postPutRequests("auth/register", payload);
  return data;
}

export async function loginRequest(username: string, password: string) {
  const data = await postPutRequests(
    "auth/login",
    username.includes("@")
      ? {
          email: username,
          password: password,
        }
      : {
          password: password,
          username: username,
        },
  );
  setAccessToken(data?.access_token);
  return data;
}

export async function refreshTokenRequest() {
  try {
    const data = await postPutRequests("auth/refresh", {}, "post", true);
    setAccessToken(data?.access_token);
    return data;
  } catch {
    clearAccessToken();
    throw new Error("Refresh failed");
  }
}

export async function getUser() {
  return await fetchWithRetry("users/details");
}

export async function logoutRequest() {
  await postPutRequests("auth/logout", undefined);
  clearAccessToken();
}

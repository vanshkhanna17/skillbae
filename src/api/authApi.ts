import { fetchWithRetry, postPutRequests } from "./baseApi.ts";
import { clearAccessToken, setAccessToken } from "./tokenStore.ts";

export interface RegisterFormInterface {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  profile?: string;
  experience?: number;
}

export async function registerRequest(payload: RegisterFormInterface) {
  const data = await postPutRequests("auth/register", payload, false, false);
  return data;
}

export async function loginRequest(username: string, password: string) {
  const data = await postPutRequests(
    "auth/login",
    { email: username, password: password },
    false,
    true,
  );
  setAccessToken(data?.access_token);
  return data;
}

export async function refreshTokenRequest() {
  try {
    const data = await postPutRequests("auth/refresh", {}, false, true);
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
  await postPutRequests("auth/logout", undefined, true, true);
  clearAccessToken();
}

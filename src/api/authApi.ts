import { baseUrl, getHeaders, postRequests } from "./baseApi.ts";
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
  const data = await postRequests("auth/register", payload, false, false);
  return data;
}

export async function loginRequest(username: string, password: string) {
  const data = await postRequests(
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
    const data = await postRequests("auth/refresh", {}, false, true);
    setAccessToken(data?.access_token);
  } catch {
    clearAccessToken();
    throw new Error("Refresh failed");
  }
}

export async function getUser() {
  let response = await fetch(`${baseUrl}/users/details`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...getHeaders(true),
    },
  });
  if (response.status === 401) {
    try {
      await refreshTokenRequest();
      response = await fetch(`${baseUrl}/users/user-details`, {
        method: "GET",
        credentials: "include",
        headers: {
          ...getHeaders(true),
        },
      });
    } catch {
      throw new Error("Unauthorised");
    }
  }
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return await response.json();
}

export async function logoutRequest() {
  await postRequests("auth/logout", undefined, true, true);
  clearAccessToken();
}

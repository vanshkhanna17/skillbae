import { config } from "@/config/config";
import { clearAccessToken, getAccessToken, setAccessToken } from "./tokenStore";

const baseUrl = config.apiBaseUrl;

const getHeaders = (authorization: boolean = false) => {
  const authToken = authorization ? getAccessToken() : null;
  return {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };
};

const postRequests = async (
  url: string,
  payload?: object,
  auth: boolean = false,
  cookies: boolean = false,
) => {
  const requestOptions: RequestInit = {
    method: "POST",
    credentials: cookies ? "include" : "same-origin",
    headers: {
      ...getHeaders(auth),
    },
    body: payload ? JSON.stringify(payload) : undefined,
  };
  const response = await fetch(`${baseUrl}/${url}`, requestOptions);
  if (!response?.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

export async function loginRequest(username: string, password: string) {
  const data = await postRequests("auth/login", { username, password }, false, true);
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
  let response = await fetch(`${baseUrl}/users/user-details`, {
    method: "GET",
    headers: {
      ...getHeaders(true),
    },
  });
  if (response.status === 401) {
    try {
      await refreshTokenRequest();
      response = await fetch(`${baseUrl}/users/user-details`, {
        method: "GET",
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
  await postRequests("auth/logout", undefined, false, true);
  clearAccessToken();
}

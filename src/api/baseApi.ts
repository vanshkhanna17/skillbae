import { config } from "@/config/config.ts";
import { getAccessToken } from "./tokenStore.ts";

export const baseUrl = config.apiBaseUrl;

export const getHeaders = (authorization: boolean = false) => {
  const authToken = authorization ? getAccessToken() : null;
  return {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };
};

export const postRequests = async (
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
  if (response.status === 204) return null;
  return await response.json();
};

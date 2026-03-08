import { config } from "@/config/config.ts";
import { refreshTokenRequest } from "./authApi.ts";
import { getAccessToken } from "./tokenStore.ts";

export const baseUrl = config.apiBaseUrl;

export const getHeaders = (authorization: boolean = false) => {
  const authToken = authorization ? getAccessToken() : null;
  return {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };
};

export const postPutRequests = async (
  url: string,
  payload?: object,
  authRequired: boolean = false,
  cookiesRequired: boolean = false,
  isPutRequest: boolean = false,
) => {
  const requestOptions: RequestInit = {
    method: isPutRequest ? "PUT" : "POST",
    credentials: cookiesRequired ? "include" : "same-origin",
    headers: {
      ...getHeaders(authRequired),
    },
    body: payload ? JSON.stringify(payload) : undefined,
  };

  let response = await fetch(`${baseUrl}/${url}`, requestOptions);

  // If 401 and auth is required, try refreshing token and retry once
  if (response.status === 401 && authRequired) {
    try {
      await refreshTokenRequest();
      // Retry the request with new token
      requestOptions.headers = {
        ...getHeaders(authRequired),
      };
      response = await fetch(`${baseUrl}/${url}`, requestOptions);
    } catch {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  if (!response?.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  if (response.status === 204) return null;
  return await response.json();
};

export const fetchWithRetry = async (url: string) => {
  let response = await fetch(`${baseUrl}/${url}`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...getHeaders(true),
    },
  });

  if (response.status === 401) {
    try {
      await refreshTokenRequest();
      response = await fetch(`${baseUrl}/${url}`, {
        method: "GET",
        credentials: "include",
        headers: {
          ...getHeaders(true),
        },
      });
    } catch {
      throw new Error("Failed to refresh token");
    }
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  return await response.json();
};

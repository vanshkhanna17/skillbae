import { config } from "@/config/config.ts";
import { refreshTokenRequest } from "./authApi.ts";

export const baseUrl = config.apiBaseUrl;

export const getHeaders = () => {
  return {
    "Content-Type": "application/json",
  };
};

export const postPutRequests = async (
  url: string,
  payload?: object,
  isPutRequest: "post" | "put" = "post",
) => {
  const requestOptions: RequestInit = {
    method: isPutRequest == "put" ? "PUT" : "POST",
    credentials: "include",
    headers: {
      ...getHeaders(),
    },
    body: payload ? JSON.stringify(payload) : undefined,
  };

  let response = await fetch(`${baseUrl}/${url}`, requestOptions);

  // If 401 and auth is required, try refreshing token and retry once
  if (response.status === 401) {
    try {
      await refreshTokenRequest();
      // Retry the request with new token
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
      ...getHeaders(),
    },
  });

  if (response.status === 401) {
    try {
      await refreshTokenRequest();
      response = await fetch(`${baseUrl}/${url}`, {
        method: "GET",
        credentials: "include",
        headers: {
          ...getHeaders(),
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

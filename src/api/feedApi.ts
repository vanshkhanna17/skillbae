import { baseUrl, getHeaders, postRequests } from "./baseApi.ts";

interface PostCreate {
  content: string;
  category_id: number;
}

interface CommentCreate {
  comment_text: string;
  post_id: number;
}

export const getPosts = async () => {
  const response = await fetch(`${baseUrl}/feed/posts`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...getHeaders(true),
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return await response.json();
};

export const getAllCategories = async () => {
  const response = await fetch(`${baseUrl}/feed/categories`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...getHeaders(true),
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return await response.json();
};

export const getUserCategories = async () => {
  const response = await fetch(`${baseUrl}/users/user-categories`, {
    method: "GET",
    credentials: "include",
    headers: {
      ...getHeaders(true),
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return await response.json();
};

export const createPost = async (data: PostCreate) => {
  const response = await postRequests("/feed/posts", data, false, true);
  return response;
};

export const createComment = async (data: CommentCreate) => {
  const response = await postRequests("/feed/comment", data, false, true);
  return response;
};

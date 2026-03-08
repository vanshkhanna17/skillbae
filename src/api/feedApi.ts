import { fetchWithRetry, postPutRequests } from "./baseApi.ts";

export interface PostCreateInterface {
  content: string;
  category_id: number;
}

interface CommentCreate {
  comment_text: string;
  post_id: number;
}

export const getPosts = async () => {
  return await fetchWithRetry("feed/posts");
};

export const getAllCategories = async () => {
  return await fetchWithRetry("feed/categories");
};

export const getUserCategories = async () => {
  return await fetchWithRetry("users/user-categories");
};

export const saveUserCategories = async (data: number[]) => {
  const response = await postPutRequests("users/categories-update", data, true, true, true);
  return response;
};

export const createPost = async (data: PostCreateInterface) => {
  const response = await postPutRequests("feed/posts", data, true, true);
  return response;
};

export const createComment = async (data: CommentCreate) => {
  const response = await postPutRequests("feed/comment", data, true, true);
  return response;
};

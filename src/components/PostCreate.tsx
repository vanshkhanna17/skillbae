import { createPost, getAllCategories, type PostCreateInterface } from "@/api/feedApi.ts";
import { getAccessToken } from "@/api/tokenStore.ts";
import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import type { Category } from "./FeedFilter.tsx";
import PostTextField from "./formFields/PostTextField.tsx";
import ModalDialog from "./ModalDialog.tsx";

interface PostCreateForm {
  category_id: string;
  content: string;
}

const PostCreate = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit: handleFormSubmit,
    reset,
  } = useForm<PostCreateForm>({
    defaultValues: {
      category_id: "",
      content: "",
    },
  });

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = (data: PostCreateForm) => {
    createPostMutation.mutateAsync({
      category_id: Number(data.category_id),
      content: data.content,
    });
  };

  const getCategoriesQuery = useQuery({
    queryKey: ["feed", "categories"],
    queryFn: getAllCategories,
    enabled: !!getAccessToken(),
    retry: false,
  });

  const createPostMutation = useMutation({
    mutationFn: (data: PostCreateInterface) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed", "posts"] });
      handleClose();
    },
  });

  const categoriesList = useMemo(() => {
    return getCategoriesQuery.data || [];
  }, [getCategoriesQuery.data]);

  return (
    <ModalDialog handleClose={handleClose} open={open}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        What would you like to post?
      </Typography>
      <Controller
        name="category_id"
        control={control}
        rules={{ required: "Category is required" }}
        render={({ field }) => (
          <FormControl sx={{ minWidth: "calc(10 * var(--size-l))" }}>
            <InputLabel>Categories</InputLabel>
            <Select {...field} label="Categories">
              {categoriesList.map((category: Category) => {
                return (
                  <MenuItem key={category.id} value={category.id}>
                    {category.category}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        )}
      />
      <Controller
        name="content"
        control={control}
        rules={{ required: "Post content is required" }}
        render={({ field }) => <PostTextField value={field.value} onChange={field.onChange} />}
      />
      <Button variant="contained" onClick={handleFormSubmit(onSubmit)}>
        Post
      </Button>
    </ModalDialog>
  );
};

export default PostCreate;

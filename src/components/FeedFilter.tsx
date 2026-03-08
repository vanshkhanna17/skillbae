import { getAllCategories } from "@/api/feedApi.ts";
import { getAccessToken } from "@/api/tokenStore.ts";

import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import Card from "./Card.tsx";
interface FeedFilterProps {
  categories: number[];
  setCategories: (categories: number[]) => void;
}

export interface Category {
  id: number;
  category: string;
}

const FeedFilter = ({ categories, setCategories }: FeedFilterProps) => {
  const [filterValues, setFilterValues] = useState<number[]>([]);

  const getCategoriesQuery = useQuery({
    queryKey: ["feed", "categories"],
    queryFn: getAllCategories,
    enabled: !!getAccessToken(),
    retry: false,
  });

  const categoriesList = useMemo(() => {
    return getCategoriesQuery.data || [];
  }, [getCategoriesQuery.data]);

  useEffect(() => {
    setFilterValues(categories);
  }, [categories]);

  const handleChange = (event: SelectChangeEvent<number[]>) => {
    const values = event.target.value as number[];
    setFilterValues(values);
  };

  const handleFiltersSave = () => {
    setCategories(filterValues);
  };

  const handleDelete = (categoryId: number) => {
    setFilterValues((prev) => prev.filter((id) => id !== categoryId));
  };

  const chipValues = useMemo(() => {
    return categoriesList.filter((category: Category) => filterValues.includes(category.id));
  }, [filterValues, categoriesList]);

  function arraysDifferent(a: number[], b: number[]) {
    return !(a.length === b.length && a.every((val: number) => b.includes(val)));
  }

  const filtersUpdated = useMemo(() => {
    return arraysDifferent(categories, filterValues);
  }, [categories, filterValues]);

  return (
    <Card>
      <Box sx={{ display: "flex", alignItems: "center", gap: "var(--size-s)" }}>
        <FilterAltOutlinedIcon fontSize="large" sx={{ color: "var(--color-gray-500)" }} />
        <FormControl sx={{ minWidth: "calc(10 * var(--size-l))" }}>
          <InputLabel>Categories</InputLabel>
          <Select
            multiple
            value={filterValues}
            label="Categories"
            onChange={handleChange}
            renderValue={(selected) => {
              const selectedArray = selected as number[];
              return selectedArray.length > 1
                ? `${selectedArray.length} categories selected`
                : `${selectedArray.length} category selected`;
            }}
          >
            {categoriesList.map((category: Category) => {
              const selected = filterValues?.includes(category.id);
              const SelectionIcon = selected ? CheckBoxIcon : CheckBoxOutlineBlankIcon;
              return (
                <MenuItem key={category.id} value={category.id}>
                  <SelectionIcon
                    fontSize="small"
                    style={{ marginRight: 8, padding: 9, boxSizing: "content-box" }}
                  />
                  <ListItemText primary={category.category} />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        {filtersUpdated && (
          <Button variant="outlined" onClick={handleFiltersSave}>
            Save
          </Button>
        )}
      </Box>
      {chipValues.length > 0 && (
        <>
          <Divider />
          <Box sx={{ display: "flex", gap: "var(--size-s)", flexWrap: "wrap" }}>
            {chipValues.map((category: { id: number; category: string }) => (
              <Chip
                key={category.id}
                label={category.category}
                onDelete={() => handleDelete(category.id)}
              />
            ))}
          </Box>
        </>
      )}
    </Card>
  );
};

export default FeedFilter;

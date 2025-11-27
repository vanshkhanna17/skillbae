import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField, type TextFieldProps } from "@mui/material";
import { useState } from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

type RHFTextFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
} & TextFieldProps;

function RHFTextField<T extends FieldValues>({
  name,
  control,
  type,
  ...textFieldProps
}: RHFTextFieldProps<T>) {
  const isNumberField = type === "number";
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePasswrodVisibility = () => setShowPassword((prev) => !prev);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...textFieldProps}
          type={isPassword ? (showPassword ? "text" : "password") : (type ?? "text")}
          value={isNumberField ? (field.value ?? "") : field.value}
          onChange={(event) => {
            const val = event.target.value;
            if (isNumberField) {
              field.onChange(val == "" ? null : Number(val));
            } else {
              field.onChange(val);
            }
          }}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          slotProps={
            isPassword
              ? {
                  input: {
                    ...(textFieldProps.slotProps?.input ?? {}),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswrodVisibility}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }
              : textFieldProps.slotProps
          }
        />
      )}
    />
  );
}

export default RHFTextField;

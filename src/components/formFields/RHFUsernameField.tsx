import { fetchWithRetry } from "@/api/baseApi";
import { useDebounce } from "@/hooks/useDebounce";
import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";
import { CircularProgress, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

// ─── Types ───────────────────────────────────────────────────────────────────

type AvailabilityStatus = "idle" | "checking" | "available" | "taken" | "invalid";

type RHFUsernameFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  onAvailabilityChange?: (available: boolean) => void;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getHelperText(status: AvailabilityStatus, rhfError?: string): string {
  if (rhfError) return rhfError; // Zod errors take priority
  if (status === "available") return "✓ Username is available!";
  if (status === "taken") return "This username is already taken.";
  if (status === "invalid") return "Invalid username format.";
  if (status === "checking") return "Checking availability...";
  return "3–30 chars. Letters, numbers, _ and . only.";
}

function getColor(status: AvailabilityStatus): "success" | "error" | "primary" {
  if (status === "available") return "success";
  if (status === "taken" || status === "invalid") return "error";
  return "primary";
}

// ─── Inner Component (hooks must live in a real component) ───────────────────

type UsernameInputProps = {
  field: {
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    name: string;
    ref: React.Ref<HTMLInputElement>;
  };
  fieldState: { error?: { message?: string } };
  onAvailabilityChange?: (available: boolean) => void;
};

function UsernameInput({ field, fieldState, onAvailabilityChange }: UsernameInputProps) {
  const [status, setStatus] = useState<AvailabilityStatus>("idle");
  const debouncedValue = useDebounce(field.value ?? "", 500);

  useEffect(() => {
    if (!debouncedValue || debouncedValue.length < 3) {
      setStatus("idle");
      onAvailabilityChange?.(false);
      return;
    }

    let cancelled = false;

    const check = async () => {
      setStatus("checking");
      try {
        const data = await fetchWithRetry(
          `users/check-username?username=${encodeURIComponent(debouncedValue)}`,
        );

        if (cancelled) return;

        if (data.available) {
          setStatus("available");
          onAvailabilityChange?.(true);
        } else {
          setStatus(data.reason ? "invalid" : "taken");
          onAvailabilityChange?.(false);
        }
      } catch {
        if (!cancelled) setStatus("idle");
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [debouncedValue, onAvailabilityChange]);

  return (
    <TextField
      {...field}
      label="Username"
      placeholder="john_doe"
      fullWidth
      color={getColor(status)}
      error={!!fieldState.error || status === "taken" || status === "invalid"}
      helperText={getHelperText(status, fieldState.error?.message)}
      onChange={(e) => field.onChange(e.target.value.toLowerCase())}
      slotProps={{
        input: {
          startAdornment: <InputAdornment position="start">@</InputAdornment>,
          endAdornment: (
            <InputAdornment position="end">
              {status === "checking" && <CircularProgress size={18} />}
              {status === "available" && <CheckCircleOutline color="success" />}
              {(status === "taken" || status === "invalid") && <ErrorOutline color="error" />}
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

function RHFUsernameField<T extends FieldValues>({
  name,
  control,
  onAvailabilityChange,
}: RHFUsernameFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <UsernameInput
          field={field}
          fieldState={fieldState}
          onAvailabilityChange={onAvailabilityChange}
        />
      )}
    />
  );
}

export default RHFUsernameField;

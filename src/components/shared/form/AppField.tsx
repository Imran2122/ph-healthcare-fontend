import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnyFieldApi } from "@tanstack/react-form";
import { cn } from "cn";
import React from "react";
type AppFieldProps = {
  field: AnyFieldApi;
  label: string;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const getErrroMessage = (error: unknown): string => {
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }
  return String(error);
};

const AppField = ({
  field,
  label,
  type = "text",
  placeholder,
  append,
  prepend,
  disabled = false,
}: AppFieldProps) => {
  const firstError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0
      ? getErrroMessage(field.state.meta.errors[0])
      : null;

  const hasError = !!firstError;

  return (
    <div className={cn("space-y-1.5")}>
      <Label
        htmlFor={field.name}
        className={cn(hasError && "text-destructive")}
      >
        {label}
      </Label>
      <div className="relative">
        {prepend && (
          <div className="absolute inset-y-0 left-0 items-center pl-3 pointer-events-none z-10">
            {prepend}
          </div>
        )}
        <Input
          id={field.name}
          name={field.name}
          type={type}
          value={field.state.value}
          placeholder={placeholder}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${field.name}-error` : undefined}
          className={cn(
            prepend && "pl-10",
            append && "pr-10",
            hasError && "border-destructive focus:ring-destructive",
            // disabled && "cursor-not-allowed opacity-50",
          )}
        ></Input>

        {append && (
          <div className="absolute inset-y-0 right-0 items-center pr-3 pointer-events-none z-10">
            {append}
          </div>
        )}

        {hasError && (
          <p
            id={`${field.name}-error`}
            role="alert"
            className="text-sm text-destructive"
          >
            {firstError}
          </p>
        )}
      </div>
    </div>
  );
};

export default AppField;

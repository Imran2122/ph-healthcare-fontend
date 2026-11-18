"use client";
import { registerAction } from "@/app/(commonLayout)/(authRouteGroup)/register/_action";
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IRegisterPayload, IRegisterZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const RegisterForm = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: IRegisterPayload) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validators: {
      onSubmit: IRegisterZodSchema,
    },

    onSubmit: async ({ value }) => {
      setServerError(null);

      try {
        const result = (await mutateAsync(value)) as any;

        if (!result.success) {
          setServerError(result.message || "Registration failed");
          return;
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Something went wrong";

        console.error("Registration failed:", message);
        setServerError(`Registration failed: ${message}`);
      }
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>

        <CardDescription>
          Please enter your information to create an account.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Name Field */}
          <form.Field
            name="name"
            validators={{
              onChange: IRegisterZodSchema.shape.name,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
              />
            )}
          </form.Field>

          {/* Email Field */}
          <form.Field
            name="email"
            validators={{
              onChange: IRegisterZodSchema.shape.email,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Email"
                type="email"
                placeholder="Enter your email"
              />
            )}
          </form.Field>

          {/* Password Field */}
          <form.Field
            name="password"
            validators={{
              onChange: IRegisterZodSchema.shape.password,
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                append={
                  <Button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    variant="ghost"
                    size="icon"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </Button>
                }
              />
            )}
          </form.Field>

          {/* Confirm Password Field */}
          <form.Field
            name="confirmPassword"
            validators={{
              onChange: ({ value }) => {
                if (!value) return "Confirm Password is required";

                if (value !== form.getFieldValue("password")) {
                  return "Passwords do not match";
                }

                return undefined;
              },
            }}
          >
            {(field) => (
              <AppField
                field={field}
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                append={
                  <Button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    variant="ghost"
                    size="icon"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </Button>
                }
              />
            )}
          </form.Field>

          {/* Server Error */}
          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Creating Account..."
                disabled={!canSubmit}
              >
                Create Account
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;

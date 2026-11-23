"use server";

import {
  getDefaultDashboard,
  isValideRedicrectForRole,
  UserRole,
} from "@/lib/authUtils";
import { httpClient } from "@/lib/axois/httpClient";
import { setTokenCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.type";
import { ILoginResponse } from "@/types/auth.type";
import { ILoginPayload, ILoginZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const loginAction = async (
  payload: ILoginPayload,
  redirectPath?: string,
): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsePayload = ILoginZodSchema.safeParse(payload);

  if (!parsePayload.success) {
    return {
      success: false,
      message: parsePayload.error.issues[0].message || "Invalid Input",
    };
  }

  let response: ILoginResponse;

  try {
    const result = await httpClient.post<ILoginResponse>(
      "/auth/login",
      parsePayload.data,
    );

    response = result.data;

    const { accessToken, refreshToken, token, user } = response;

    if (!accessToken || !refreshToken || !token || !user) {
      throw new Error("Invalid login response from server");
    }

    await setTokenCookies("accessToken", accessToken);
    await setTokenCookies("refreshToken", refreshToken);
    await setTokenCookies("better_auth.session_token", token, 24 * 60 * 60);
  } catch (error: unknown) {
    console.error("LOGIN ACTION ERROR:", error);

    const errorBody =
      isRecord(error) && isRecord(error.body)
        ? error.body
        : isRecord(error) &&
            isRecord(error.response) &&
            isRecord(error.response.data)
          ? error.response.data
          : undefined;

    if (
      errorBody?.code === "EMAIL_NOT_VERIFIED" ||
      errorBody?.message === "Email not verified"
    ) {
      redirect(`/verify-email?email=${encodeURIComponent(payload.email)}`);
    }

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
    };
  }

  const { user } = response;
  const { role, emailVerified, needpasswordChange, email } = user;

  if (needpasswordChange) {
    redirect(`/reset-password?email=${encodeURIComponent(email)}`);
  }

  const targetPath =
    redirectPath && isValideRedicrectForRole(redirectPath, role as UserRole)
      ? redirectPath
      : getDefaultDashboard(role as UserRole);

  redirect(targetPath);
};

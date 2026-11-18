"use server";
import { httpClient } from "@/lib/axois/httpClient";
import { setTokenCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse, ApiResponse } from "@/types/api.type";
import { ILoginResponse } from "@/types/auth.type";
import { ILoginPayload, ILoginZodSchema } from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const loginAction = async (
  payload: ILoginPayload,
): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsePayload = ILoginZodSchema.safeParse(payload);
  if (!parsePayload.success) {
    const firstError = parsePayload.error.issues[0].message || "Invalide Input";
    return {
      success: false,
      message: firstError,
    };
  }

  try {
    const response = await httpClient.post<ILoginResponse>(
      "/auth/login",
      parsePayload.data,
    );
    const { accessToken, refreshToken, token } = response.data;
    setTokenCookies("accessToken", accessToken);
    setTokenCookies("refreshToken", refreshToken);
    setTokenCookies("better_auth.session_token", token, 24 * 60 * 60);

    redirect("/dashboard");

    return response.data;
  } catch (error: any) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }

    return {
      success: false,
      message: `LoginFailed ${error.message}`,
    };
  }
};

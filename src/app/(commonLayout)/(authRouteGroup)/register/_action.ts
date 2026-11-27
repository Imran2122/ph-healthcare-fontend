
"use server";

import { httpClient } from "@/lib/axois/httpClient";
import { setTokenCookies } from "@/lib/tokenUtils";
import { ApiErrorResponse } from "@/types/api.type";
import { ILoginResponse } from "@/types/auth.type";
import {
  IRegisterPayload,
  IRegisterZodSchema,
} from "@/zod/auth.validation";
import { redirect } from "next/navigation";

export const registerAction = async (
  payload: IRegisterPayload,
): Promise<ILoginResponse | ApiErrorResponse> => {
  const parsePayload = IRegisterZodSchema.safeParse(payload);

  if (!parsePayload.success) {
    return {
      success: false,
      message:
        parsePayload.error.issues[0].message || "Invalid Input",
    };
  }

  try {
    // confirmPassword backend-এ পাঠানোর প্রয়োজন নেই
    const { confirmPassword, ...registerData } = parsePayload.data;

    const response = await httpClient.post<ILoginResponse>(
      "/auth/register",
      registerData,
    );

    const { accessToken, refreshToken, token } = response.data;

    await setTokenCookies("accessToken", accessToken);
    await setTokenCookies("refreshToken", refreshToken);
    await setTokenCookies(
      "better-auth.session_token",
      token,
      24 * 60 * 60,
    );

  } catch (error: unknown) {
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
      message:
        error instanceof Error
          ? `Registration Failed: ${error.message}`
          : "Registration Failed",
    };
  }

  redirect("/dashboard");
};

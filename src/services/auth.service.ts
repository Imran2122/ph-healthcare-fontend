"use server";

import { setTokenCookies } from "@/lib/tokenUtils";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_API_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not Define");
}

export async function getNewTokensWithfreshToken(refreshToken: string) {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Types": "applicataion/json",
        Cookier: `refreshToken=${refreshToken}`,
      },
    });

    if (!res.ok) {
      return false;
    }

    const data = await res.json();
    const { accessToken, refreshToken: newResreshToken, token } = data;
    if (accessToken) {
      await setTokenCookies("accessToken", accessToken);
    }
    if (newResreshToken) {
      await setTokenCookies("refreshToken", newResreshToken);
    }
    if (token) {
      await setTokenCookies("better_auth.session_token", token, 24 * 60 * 60);
    }
    return true;
  } catch (error: any) {
    console.error("Error refreshtoken", error);
    return false;
  }
}

export async function getUserInfo() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return {
      id:"",
      email:"",
      role:"",
      needpasswordChange:false
    };
  }

  const res = await fetch(`${BASE_API_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `accessToken=${accessToken}`,
    },
  });
  if (!res.ok) {
    return null;
  }

  const { data } = await res.json();
  return data;
}

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
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
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
      await setTokenCookies("better-auth.session_token", token, 24 * 60 * 60);
    }
    return true;
  } catch (error: any) {
    console.error("Error refreshtoken", error);
    return false;
  }
}

export async function getUserInfo() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken =
      cookieStore.get("better-auth.session_token")?.value ??
      cookieStore.get("better_auth.session_token")?.value;

    if (!accessToken) {
      return null;
    }

    const res = await fetch(`${BASE_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: [
          `accessToken=${accessToken}`,
          sessionToken && `better-auth.session_token=${sessionToken}`,
        ]
          .filter(Boolean)
          .join("; "),
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch user info:", res.status, res.statusText);
      return null;
    }

    const { data } = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}

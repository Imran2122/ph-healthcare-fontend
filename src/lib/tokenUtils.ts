"use server";

import jwt, { JwtPayload } from "jsonwebtoken";
import { setCookie } from "./cookieUtils";

const getTokenSecondRemaining = (token: string): number => {
  if (!token) return 0;

  try {
    const tokenPayload = jwt.decode(token) as JwtPayload | null;

    // Token valid JWT format না হলে
    if (!tokenPayload || typeof tokenPayload !== "object") {
      return 0;
    }

    // Token-এর expiry না থাকলে
    if (typeof tokenPayload.exp !== "number") {
      return 0;
    }

    const remainingSecond = tokenPayload.exp - Math.floor(Date.now() / 1000);

    return remainingSecond > 0 ? remainingSecond : 0;
  } catch (error) {
    console.error("Error Decoding Token:", error);
    return 0;
  }
};

export const setTokenCookies = async (
  name: string,
  token: string,
  fallbackMaxAgeInSeconds = 60 * 60 * 24,
) => {
  const maxAgeInSecond = getTokenSecondRemaining(token);

  await setCookie(name, token, maxAgeInSecond || fallbackMaxAgeInSeconds);
};

export async function isTokenExpiringSoon(
  token: string,
  thresholdInSecond = 300,
): Promise<boolean> {
  const remainingSecond = getTokenSecondRemaining(token);
  return remainingSecond > 0 && remainingSecond <= thresholdInSecond;
}
export async function isTokenExpire(token: string): Promise<boolean> {
  const remainingSecond = getTokenSecondRemaining(token);
  return remainingSecond === 0;
}

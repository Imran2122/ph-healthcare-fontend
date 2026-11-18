"use server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { setCookie } from "./cookieUtils";
const JWT_ACCSS_TOKEN = process.env.JWT_ACCSS_TOKEN;

const getTokenSecondRemaining = (token: string) => {
  if (!token) return 0;

  try {
    const tokenPayload = JWT_ACCSS_TOKEN
      ? (jwt.verify(token, JWT_ACCSS_TOKEN as string) as JwtPayload)
      : (jwt.decode(token) as JwtPayload);

    if (tokenPayload && !tokenPayload.exp) {
      return 0;
    }

    const remainingSecond =
      (tokenPayload.exp as number) - Math.floor(Date.now() / 1000);
    return remainingSecond > 0 ? remainingSecond : 0;
  } catch (error) {
    console.log("Error DEcoding Token:", error);
    return 0;
  }
};

export const setTokenCookies = async (
  name: string,
  token: string,
  fallbackMaxAgeInSeconds = 60 * 60 * 24,
) => {
  const maxAgeInSecond = getTokenSecondRemaining(token);
  await setCookie(name, token, maxAgeInSecond || fallbackMaxAgeInSeconds || 0);
};

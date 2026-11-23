import { NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "./lib/axois/jwtUtils";
import {
  getDefaultDashboard,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/authUtils";
import { redirect } from "next/dist/server/api-utils";
import {
  getNewTokensWithfreshToken,
  getUserInfo,
} from "./services/auth.service";
import { isTokenExpiringSoon } from "./lib/tokenUtils";
import { refresh } from "next/cache";
import { Rethink_Sans } from "next/font/google";

async function refreshTokenMiddleware(refreshToken: string): Promise<boolean> {
  try {
    const refresh = await getNewTokensWithfreshToken(refreshToken);
    if (!refresh) {
      return false;
    }
    return true;
  } catch (error) {}
  return false;
}

export async function proxy(request: NextRequest) {
  try {
    console.log(request);
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    const docodedAccessToken =
      accessToken &&
      jwtUtils.verifyToken(accessToken, process.env.JWT_ACCSS_SECRET as string)
        .data;

    const isValideAccessToken =
      accessToken &&
      jwtUtils.verifyToken(accessToken, process.env.JWT_ACCSS_SECRET as string)
        .success;

    let userRole: UserRole | null = null;
    if (docodedAccessToken) {
      userRole = docodedAccessToken.role as UserRole;
    }

    const routeOwner = getRouteOwner(pathname);
    const unifySupperAdminAndAdminRole =
      userRole === "SUPPER_ADMIN" ? "ADMIN" : userRole;
    userRole = unifySupperAdminAndAdminRole;
    const isAuth = isAuthRoute(pathname);

    if (
      isValideAccessToken &&
      refreshToken &&
      (await isTokenExpiringSoon(accessToken))
    ) {
      const requestHeader = new Headers(request.headers);

      const response = NextResponse.next({
        request: {
          headers: requestHeader,
        },
      });

      try {
        const refresh = await refreshTokenMiddleware(refreshToken);
        if (refresh) {
          requestHeader.set("x-token-resresh", "1");
        }
        return NextResponse.next({
          request: {
            headers: requestHeader,
          },
          headers: response.headers,
        });
      } catch (error) {
        console.error("error resresh token", error);
      }

      return response;
    }
    if (isAuth) {
      if (isValideAccessToken && userRole) {
        return NextResponse.redirect(
          new URL(getDefaultDashboard(userRole), request.url),
        );
      }

      return NextResponse.next();
    }

    if (pathname === "/reset-password") {
      const email = request.nextUrl.searchParams.get("email");
      // case -1 user has needPasswordChange True
      if (accessToken && email) {
        const userInfo = await getUserInfo();
        if (userInfo.needPasswordChange) {
          return NextResponse.next();
        }
      } else {
        return NextResponse.redirect(
          new URL(getDefaultDashboard(userRole as UserRole)),
        );
      }

      // case -2 cumming from froget password
      if (email) {
        return NextResponse.next();
      }

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);

      return NextResponse.redirect(loginUrl);
    }

    if (routeOwner === null) {
      // set 2-user try to acces public route

      return NextResponse.next();
    }
    // role user in login in but login protected
    if (!accessToken || !isValideAccessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("/redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // rule -Enforching user to user reset passsword or verify email page is their
    // passwordor is emailVerified are not satisfied respectively
    if (accessToken) {
      const userInfo = await getUserInfo();
      // email verified
      if (userInfo?.emailVerified === false) {
        if (pathname !== "/verify-email") {
          const verifyEmail = new URL("/verify-email", request.url);
          verifyEmail.searchParams.set("email", userInfo.email);
          return NextResponse.redirect(verifyEmail);
        }
        return NextResponse.next();
      }

      if (userInfo && userInfo.emailVerified && pathname === "/verify-email") {
        return NextResponse.redirect(
          new URL(getDefaultDashboard(userRole as UserRole), request.url),
        );
      }

      // need password change
      if (userInfo.needPasswordChange) {
        if (pathname !== "/reset-passwqord") {
          const resetpasswordUrl = new URL("/reset-password", request.url);
          resetpasswordUrl.searchParams.set("email", userInfo.email);
          return NextResponse.redirect(resetpasswordUrl);
        }

        return NextResponse.next();
      }

      if (
        userInfo &&
        !userInfo.needPasswordChange &&
        pathname === "/reset-password"
      ) {
        return NextResponse.redirect(
          new URL(getDefaultDashboard(userRole as UserRole)),
        );
      }
    }

    //  role 4 user try to commonroute protected route
    if (routeOwner === "COMMON") {
      return NextResponse.next();
    }

    // 5 user trying to visite role base protectred route but doxes not have required role
    if (
      routeOwner === "ADMIN" ||
      routeOwner === "DOCTOR" ||
      routeOwner === "PATIENT"
    ) {
      if (routeOwner !== userRole) {
        return NextResponse.redirect(
          new URL(getDefaultDashboard(userRole as UserRole), request.url),
        );
      }
    }
    return NextResponse.next();
  } catch (error: any) {
    console.log(error.message);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};

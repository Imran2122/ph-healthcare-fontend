import { redirect } from "next/dist/server/api-utils";

export type UserRole = "SUPPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";

export const authRoute = [
  "/login",
  "/register",
  "/forget-password",
  "/reset-password",
  "/verify-email",
];

export const isAuthRoute = (pathname: string) => {
  return authRoute.some((routes: string) => routes === pathname);
};

export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

export const commonProtectedRoute: RouteConfig = {
  exact: ["/my-profile", "/change-password"],
  pattern: [],
};
export const doctorProtectedRoute: RouteConfig = {
  pattern: [/^\/doctor\/dashboard/],
  exact: [],
};
export const adminProtectedRoute: RouteConfig = {
  pattern: [/^\/admin\/dashboard/],
  exact: [],
};


export const patientProtectedRoutes: RouteConfig = {
  pattern: [/^\/dashboard/],
  exact: ["/payment/success"],
};

export const isRoutematch = (pathname: string, routes: RouteConfig) => {
  if (routes.exact.includes(pathname)) {
    return true;
  }
  return routes.pattern.some((pattern) => pattern.test(pathname));
};

export const getRouteOwner = (
  pathname: string,
): "SUPPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT" | "COMMON" | null => {
  if (isRoutematch(pathname, doctorProtectedRoute)) {
    return "DOCTOR";
  }

  //   if (isRoutematch(pathname,supperAdminProtectedRoute)) {
  //     return "SUPER_ADMIN";
  //   }

  if (isRoutematch(pathname, adminProtectedRoute)) {
    return "ADMIN";
  }

  if (isRoutematch(pathname, patientProtectedRoutes)) {
    return "PATIENT";
  }
  if (isRoutematch(pathname, commonProtectedRoute)) {
    return "COMMON";
  }
  return null;
};

export const getDefaultDashboard = (role: UserRole) => {
  if (role === "ADMIN" || role === "SUPPER_ADMIN") {
    return "/admin/dashboard";
  }
  if (role === "PATIENT") {
    return "/dashboard";
  }
  if (role === "DOCTOR") {
    return "/doctor/dashboard";
  }

  return "/";
};

export const isValideRedicrectForRole = (
  redirectPath: string,
  role: UserRole,
) => {
  const unifySupperAdminAndAdminRole = role === "SUPPER_ADMIN" ? "ADMIN" : role;
  role = unifySupperAdminAndAdminRole;
  const routeOwner = getRouteOwner(redirectPath);
  if (routeOwner === null || routeOwner === "COMMON") {
    return true;
  }
  if (routeOwner === role) {
    return true;
  }

  return false;
};

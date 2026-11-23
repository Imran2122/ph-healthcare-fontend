import { ApiResponse } from "@/types/api.type";
import axios from "axios";
import { isTokenExpiringSoon } from "../tokenUtils";
import { cookies, headers } from "next/headers";
import { getNewTokensWithfreshToken } from "@/services/auth.service";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API URL not defined");
}

async function tryRefreshToken(refreshToken: string): Promise<void> {
  if (!isTokenExpiringSoon(refreshToken)) {
    return;
  }
  const requestHeader = await headers();

  if (requestHeader.get("x-token-resresh") === "1") {
    return;
  }

  try {
    await getNewTokensWithfreshToken(refreshToken);
  } catch (error: any) {
    console.error("error refressing token in http client", error);
  }
}

const axiosInstance = async () => {
  const cookiesStore = await cookies();

  const accessToken = cookiesStore.get("accessToken")?.value;
  const refreshToken = cookiesStore.get("refreshToken")?.value;

  if (accessToken && refreshToken) {
    await tryRefreshToken(accessToken);
  }

  const cookieHeader = cookiesStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
  });
};

export interface APiRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

// GET Request
const httpGet = async <TData>(
  endpoint: string,
  options?: APiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
    const instance = await axiosInstance();
    const response =await instance.get<ApiResponse<TData>>(endpoint, {
      params: options?.params,
      headers: options?.headers,
    });

    return response.data;
  } catch (error) {
    console.error(`GET Request to ${endpoint} failed`, error);
    throw error;
  }
};

// POST Request
const httpPost = async <TData>(
  endpoint: string,
  data: unknown,
  options?: APiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
      const instance = await axiosInstance();
    const response = await instance.post<ApiResponse<TData>>(
      endpoint,
      data,
      {
        params: options?.params,
        headers: options?.headers,
      },
    );

    return response.data;
  } catch (error) {
    console.error(`POST Request to ${endpoint} failed`, error);
    throw error;
  }
};

// PUT Request
const httpPut = async <TData>(
  endpoint: string,
  data: unknown,
  options?: APiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
      const instance = await axiosInstance();
    const response = await instance.put<ApiResponse<TData>>(
      endpoint,
      data,
      {
        params: options?.params,
        headers: options?.headers,
      },
    );

    return response.data;
  } catch (error) {
    console.error(`PUT Request to ${endpoint} failed`, error);
    throw error;
  }
};

// PATCH Request
const httpPatch = async <TData>(
  endpoint: string,
  data: unknown,
  options?: APiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
      const isntance = await axiosInstance();
    const response = await isntance.patch<ApiResponse<TData>>(
      endpoint,
      data,
      {
        params: options?.params,
        headers: options?.headers,
      },
    );

    return response.data;
  } catch (error) {
    console.error(`PATCH Request to ${endpoint} failed`, error);
    throw error;
  }
};

// DELETE Request
const httpDelete = async <TData>(
  endpoint: string,
  options?: APiRequestOptions,
): Promise<ApiResponse<TData>> => {
  try {
      const instance = await axiosInstance();
    const response = await instance.delete<ApiResponse<TData>>(
      endpoint,
      {
        params: options?.params,
        headers: options?.headers,
      },
    );

    return response.data;
  } catch (error) {
    console.error(`DELETE Request to ${endpoint} failed`, error);
    throw error;
  }
};

export const httpClient = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  patch: httpPatch,
  delete: httpDelete,
};

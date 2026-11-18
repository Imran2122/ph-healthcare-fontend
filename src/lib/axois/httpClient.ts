
import { ApiResponse } from "@/types/api.type";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("API URL not defined");
}

const axiosInstance = () => {
  return axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
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
    const response = await axiosInstance().get<ApiResponse<TData>>(
      endpoint,
      {
        params: options?.params,
        headers: options?.headers,
      },
    );

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
    const response = await axiosInstance().post<ApiResponse<TData>>(
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
    const response = await axiosInstance().put<ApiResponse<TData>>(
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
    const response = await axiosInstance().patch<ApiResponse<TData>>(
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
    const response = await axiosInstance().delete<ApiResponse<TData>>(
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

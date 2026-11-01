/* ================================================
   API Client
   Typed fetch wrapper for frontend → backend API calls.
   ================================================ */

import type { ApiSuccessResponse, ApiErrorResponse } from "@/lib/errors";

class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const defaultHeaders: Record<string, string> = {};
  if (!isFormData) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include",
  });

  const json = await response.json();

  if (!response.ok) {
    const errorBody = json as ApiErrorResponse;
    throw new ApiError(
      response.status,
      errorBody.error?.code || "UNKNOWN",
      errorBody.error?.message || "Something went wrong",
      errorBody.error?.errors
    );
  }

  return (json as ApiSuccessResponse<T>).data;
}

export const api = {
  get<T>(url: string): Promise<T> {
    return request<T>(url, { method: "GET" });
  },

  post<T>(url: string, body?: unknown): Promise<T> {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return request<T>(url, {
      method: "POST",
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(url: string, body?: unknown): Promise<T> {
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    return request<T>(url, {
      method: "PUT",
      body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(url: string, body?: unknown): Promise<T> {
    return request<T>(url, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(url: string): Promise<T> {
    return request<T>(url, { method: "DELETE" });
  },
};

export { ApiError };

export const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  status: number;
  code?: string;
  email?: string;

  constructor(message: string, status: number, code?: string, email?: string) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.email = email;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export async function authFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      data?.message || "Something went wrong",
      response.status,
      data?.code,
      data?.email,
    );
  }

  return data;
}

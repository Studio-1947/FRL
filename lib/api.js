export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://frl-backend.vercel.app/api";

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  return response;
}

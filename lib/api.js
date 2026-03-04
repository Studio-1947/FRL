export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8000/v1"
    : "https://frl-backend.vercel.app/v1");

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

  // Transparently unwrap standard API responses { statusCode, message, data }
  const originalJson = response.json.bind(response);
  response.json = async () => {
    const json = await originalJson();
    if (
      json &&
      typeof json === "object" &&
      "data" in json &&
      "statusCode" in json
    ) {
      return json.data;
    }
    return json;
  };

  return response;
}

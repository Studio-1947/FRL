const rawBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://frl-backend.vercel.app");

export const API_BASE_URL = rawBaseUrl
  .replace(/\/v1\/?$/, "")
  .replace(/\/$/, "");

export async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Get token from cookies
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config = {
    ...options,
    credentials: "include", // Ensure cookies are sent
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Centralized 401 Unauthorized handling
    if (response.status === 401 && typeof window !== "undefined") {
      // Clear invalid token if necessary (backend usually handles this via cookie,
      // but we can ensure client-side state is clean)
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      // Redirect to login if we're not already there
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = `/login?message=session_expired&callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      }
    }

    // Transparently unwrap standard API responses { statusCode, message, data }
    const originalJson = response.json.bind(response);
    response.json = async () => {
      try {
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
      } catch (err) {
        return null;
      }
    };

    return response;
  } catch (error) {
    console.error("API Request Failed:", error);
    // Return a mock response object to prevent caller crashes
    return {
      ok: false,
      status: 500,
      json: async () => ({ message: "Network error or server unreachable" }),
    };
  }
}

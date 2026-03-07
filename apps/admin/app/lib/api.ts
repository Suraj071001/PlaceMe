export const API_BASE =
  process.env.NEXT_PUBLIC_API_V1_URL?.replace(/\/$/, "") ||
  "http://localhost:5501/api/v1";

export function getAuthHeaders(contentType: boolean = true): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return {
    ...(contentType ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}


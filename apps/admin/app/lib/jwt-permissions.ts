"use client";

type TokenPayload = {
  permissions?: string[];
};

const decodeBase64Url = (value: string) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return atob(padded);
};

export const getPermissionsFromToken = (token: string | null): string[] => {
  if (!token) return [];

  try {
    const parts = token.split(".");
    if (parts.length < 2 || !parts[1]) return [];
    const payloadJson = decodeBase64Url(parts[1]);
    const payload = JSON.parse(payloadJson) as TokenPayload;
    return Array.isArray(payload.permissions) ? payload.permissions : [];
  } catch {
    return [];
  }
};

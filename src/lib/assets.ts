export const API_BASE = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8011";

export function assetUrl(value: string) {
  return value.startsWith("/uploads/") ? `${API_BASE}${value}` : value;
}

export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function absoluteSiteUrl(path = "") {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${path}`;
}

export function publicPdfUrl(token: string) {
  return absoluteSiteUrl(`/pdf/${token}`);
}

export function formatDate(value?: string | null) {
  if (!value) return "Без срока";
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" }).format(new Date(value));
}

export function formatDateTime(value?: string | null) {
  if (!value) return "Нет данных";
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function safeFileName(name: string) {
  const cleaned = name.replace(/[^\p{L}\p{N}._-]+/gu, "-").replace(/-+/g, "-");
  return cleaned || "document.pdf";
}

export function deriveStatus(status: string, expiresAt?: string | null) {
  if (status === "disabled") return "disabled";
  if (expiresAt && new Date(expiresAt).getTime() < Date.now()) return "expired";
  return "active";
}

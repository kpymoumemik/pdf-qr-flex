export const PDF_BUCKET = "pdf-documents";
export const MAX_PDF_SIZE_BYTES = 25 * 1024 * 1024;
export const SIGNED_URL_TTL_SECONDS = 60 * 10;

export const EXPIRATION_OPTIONS = [
  { label: "7 дней", value: "7" },
  { label: "14 дней", value: "14" },
  { label: "30 дней", value: "30" },
  { label: "Без срока", value: "never" },
] as const;

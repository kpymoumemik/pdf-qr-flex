import { z } from "zod";
import { MAX_PDF_SIZE_BYTES } from "@/lib/constants";
import { FRAME_STYLES, PATTERN_STYLES } from "@/lib/qr-style";

export const pdfQrSchema = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  expires_in_days: z.enum(["7", "14", "30", "never"]).default("never"),
  password: z.string().optional(),
  qr_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#000000"),
  qr_background: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#ffffff"),
  qr_size: z.coerce.number().int().min(192).max(1024).default(512),
  frame_style: z.enum(FRAME_STYLES).default("Без рамки"),
  pattern_style: z.enum(PATTERN_STYLES).default("Квадрат"),
});

export function ensurePdfFile(file: File) {
  if (!file || file.size === 0) {
    throw new Error("PDF-файл обязателен.");
  }

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    throw new Error("Можно загружать только PDF-файлы.");
  }

  if (file.size > MAX_PDF_SIZE_BYTES) {
    throw new Error("Размер PDF-файла не должен превышать 25 MB.");
  }
}

"use client";

import { Download } from "lucide-react";
import { generateStyledQrPngDataUrl } from "@/lib/qr-style";

export function DownloadQrButton({
  url,
  title,
  color,
  background,
  size,
  frameStyle,
  patternStyle,
}: {
  url: string;
  title: string;
  color: string;
  background: string;
  size: number;
  frameStyle?: string | null;
  patternStyle?: string | null;
}) {
  async function download() {
    const dataUrl = await generateStyledQrPngDataUrl(url, { color, background, size, frameStyle, patternStyle });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${title.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
    link.click();
  }

  return (
    <button
      type="button"
      onClick={download}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-sky-500 px-3 text-sm font-semibold text-white hover:bg-sky-600"
    >
      <Download size={16} />
      Скачать QR
    </button>
  );
}

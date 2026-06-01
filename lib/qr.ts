import QRCode from "qrcode";
import { publicPdfUrl } from "@/lib/utils";

export async function generateQrDataUrl(
  token: string,
  options?: { color?: string; background?: string; size?: number },
) {
  return QRCode.toDataURL(publicPdfUrl(token), {
    errorCorrectionLevel: "M",
    margin: 2,
    width: options?.size ?? 512,
    color: {
      dark: options?.color ?? "#000000",
      light: options?.background ?? "#ffffff",
    },
  });
}

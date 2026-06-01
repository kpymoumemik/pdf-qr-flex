import { generateStyledQrSvgDataUrl, type StyledQrOptions } from "@/lib/qr-style";
import { publicPdfUrl } from "@/lib/utils";

export async function generateQrDataUrl(
  token: string,
  options?: StyledQrOptions,
) {
  return generateStyledQrSvgDataUrl(publicPdfUrl(token), options);
}

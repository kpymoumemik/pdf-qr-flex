import Image from "next/image";
import { generateQrDataUrl } from "@/lib/qr";
import { publicPdfUrl } from "@/lib/utils";
import { CopyButton } from "@/components/CopyButton";
import { DownloadQrButton } from "@/components/DownloadQrButton";

export async function QrCodeCard({
  token,
  title,
  color,
  background,
  size,
  frameStyle,
  patternStyle,
}: {
  token: string;
  title: string;
  color: string;
  background: string;
  size: number;
  frameStyle?: string | null;
  patternStyle?: string | null;
}) {
  const dataUrl = await generateQrDataUrl(token, { color, background, size, frameStyle, patternStyle });
  const url = publicPdfUrl(token);

  return (
    <div className="rounded-md border border-white/10 bg-white/8 p-5 shadow-lg shadow-slate-950/20">
      <div className="mx-auto flex max-w-[340px] justify-center rounded-md border border-slate-200 bg-white p-4">
        <Image src={dataUrl} alt={`QR ${title}`} width={size} height={size} unoptimized className="h-auto w-full" />
      </div>
      <p className="mt-4 break-all rounded-md border border-white/10 bg-slate-950/45 p-3 font-mono text-xs text-slate-300">{url}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <DownloadQrButton url={url} title={title} color={color} background={background} size={size} frameStyle={frameStyle} patternStyle={patternStyle} />
        <CopyButton value={url} />
      </div>
    </div>
  );
}

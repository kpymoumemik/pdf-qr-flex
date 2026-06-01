import { NextResponse } from "next/server";
import { generateSignedPdfUrls, getPublicPdfQrByToken, logPdfQrAccess } from "@/lib/actions";
import { deriveStatus } from "@/lib/utils";

type Context = {
  params: Promise<{ token: string }>;
};

export async function GET(_request: Request, context: Context) {
  const { token } = await context.params;
  const qrCode = await getPublicPdfQrByToken(token);

  if (!qrCode) {
    return NextResponse.json({ error: "PDF-документы не найдены" }, { status: 404 });
  }

  const status = deriveStatus(qrCode.status, qrCode.expires_at);
  if (status === "disabled") {
    return NextResponse.json({ error: "Доступ к документам отключен" }, { status: 403 });
  }
  if (status === "expired") {
    return NextResponse.json({ error: "Срок действия ссылки истек" }, { status: 410 });
  }
  if (qrCode.password_hash) {
    return NextResponse.json({ requires_password: true, title: qrCode.title });
  }

  const documents = await generateSignedPdfUrls(qrCode.documents || []);
  await logPdfQrAccess(qrCode.id);

  return NextResponse.json({
    qr_code: { ...qrCode, password_hash: null },
    documents,
  });
}

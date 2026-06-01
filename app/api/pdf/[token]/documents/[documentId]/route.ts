import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { PDF_BUCKET, SIGNED_URL_TTL_SECONDS } from "@/lib/constants";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { deriveStatus } from "@/lib/utils";

type Context = {
  params: Promise<{ token: string; documentId: string }>;
};

function contentDisposition(fileName: string, download: boolean) {
  const fallback = fileName.replace(/[^\w.-]+/g, "_") || "document.pdf";
  const encoded = encodeURIComponent(fileName);
  const disposition = download ? "attachment" : "inline";
  return `${disposition}; filename="${fallback}"; filename*=UTF-8''${encoded}`;
}

export async function GET(request: NextRequest, context: Context) {
  const { token, documentId } = await context.params;
  const download = request.nextUrl.searchParams.get("download") === "1";
  const supabase = createSupabaseAdminClient();

  const { data: qrCode, error: qrError } = await supabase
    .from("pdf_qr_codes")
    .select("id, token, status, expires_at, password_hash")
    .eq("token", token)
    .maybeSingle();

  if (qrError) {
    return NextResponse.json({ error: qrError.message }, { status: 500 });
  }
  if (!qrCode) {
    return NextResponse.json({ error: "PDF-файл не найден" }, { status: 404 });
  }

  const status = deriveStatus(qrCode.status, qrCode.expires_at);
  if (status === "disabled") {
    return NextResponse.json({ error: "Доступ к PDF отключен" }, { status: 403 });
  }
  if (status === "expired") {
    return NextResponse.json({ error: "Срок действия ссылки истек" }, { status: 410 });
  }

  if (qrCode.password_hash) {
    const cookieStore = await cookies();
    const hasAccess = cookieStore.get(`pdf_access_${token}`)?.value === "1";
    if (!hasAccess) {
      return NextResponse.json({ error: "Нужен пароль" }, { status: 401 });
    }
  }

  const { data: document, error: documentError } = await supabase
    .from("documents")
    .select("id, qr_code_id, file_name, file_path, file_type")
    .eq("id", documentId)
    .eq("qr_code_id", qrCode.id)
    .maybeSingle();

  if (documentError) {
    return NextResponse.json({ error: documentError.message }, { status: 500 });
  }
  if (!document) {
    return NextResponse.json({ error: "PDF-файл не найден" }, { status: 404 });
  }

  const { data: signed, error: signedError } = await supabase.storage
    .from(PDF_BUCKET)
    .createSignedUrl(document.file_path, SIGNED_URL_TTL_SECONDS);

  if (signedError || !signed?.signedUrl) {
    return NextResponse.json({ error: signedError?.message || "Не удалось открыть PDF" }, { status: 500 });
  }

  const pdfResponse = await fetch(signed.signedUrl);
  if (!pdfResponse.ok || !pdfResponse.body) {
    return NextResponse.json({ error: "Не удалось загрузить PDF" }, { status: 502 });
  }

  return new Response(pdfResponse.body, {
    headers: {
      "Content-Type": document.file_type || "application/pdf",
      "Content-Disposition": contentDisposition(document.file_name, download),
      "Cache-Control": "private, no-store",
    },
  });
}

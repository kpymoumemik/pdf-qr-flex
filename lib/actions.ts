"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { PDF_BUCKET } from "@/lib/constants";
import { requireUser } from "@/lib/auth";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";
import { generateSignedPdfUrl, uploadPdfDocuments } from "@/lib/storage";
import { ensurePdfFile, pdfQrSchema } from "@/lib/validation";
import type { PdfDocument, PdfQrWithDocuments } from "@/lib/types";

export type ActionState = {
  ok: boolean;
  message: string;
  data?: unknown;
};

function optionalText(value: FormDataEntryValue | null) {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length ? text : null;
}

function expirationFromDays(days: string) {
  if (days === "never") return null;
  const date = new Date();
  date.setDate(date.getDate() + Number(days));
  return date.toISOString();
}

function filesFromFormData(formData: FormData, field = "documents") {
  return formData.getAll(field).filter((file): file is File => file instanceof File && file.size > 0);
}

function titleFromFile(file: File) {
  return file.name.replace(/\.pdf$/i, "").trim() || "PDF QR";
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function createPdfQrCode(_state: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = pdfQrSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message || "Проверьте форму." };
  }

  const files = filesFromFormData(formData);
  try {
    if (files.length !== 1) {
      throw new Error("Загрузите один PDF-файл.");
    }
    files.forEach(ensurePdfFile);
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Ошибка PDF-файла." };
  }

  const supabase = createSupabaseAdminClient();
  const token = randomBytes(24).toString("base64url");
  const password = parsed.data.password?.trim();
  const passwordHash = password ? await bcrypt.hash(password, 12) : null;

  const { data: qrCode, error: insertError } = await supabase
    .from("pdf_qr_codes")
    .insert({
      user_id: user.id,
      token,
      title: parsed.data.title?.trim() || titleFromFile(files[0]),
      description: optionalText(formData.get("description")),
      expires_at: expirationFromDays(parsed.data.expires_in_days),
      password_hash: passwordHash,
      qr_color: parsed.data.qr_color,
      qr_background: parsed.data.qr_background,
      qr_size: parsed.data.qr_size,
    })
    .select("id")
    .single();

  if (insertError || !qrCode) {
    return { ok: false, message: insertError?.message || "Не удалось создать QR-код." };
  }

  try {
    const documents = await uploadPdfDocuments({ userId: user.id, qrCodeId: qrCode.id, files });
    const { error: docsError } = await supabase
      .from("documents")
      .insert(documents.map((document) => ({ ...document, qr_code_id: qrCode.id })));

    if (docsError) throw new Error(docsError.message);
  } catch (error) {
    await supabase.from("pdf_qr_codes").delete().eq("id", qrCode.id);
    return { ok: false, message: error instanceof Error ? error.message : "Не удалось загрузить PDF." };
  }

  revalidatePath("/dashboard");
  redirect(`/dashboard/${qrCode.id}`);
}

export async function getPdfQrCodesForCurrentUser() {
  const user = await requireUser();
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("pdf_qr_codes")
    .select("*, documents(id), access_logs(created_at)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data || []).map((row) => ({
    ...row,
    documents: row.documents || [],
    total_scans: row.access_logs?.length || 0,
    last_scan_at: row.access_logs?.[0]?.created_at || null,
  })) as PdfQrWithDocuments[];
}

export async function getPdfQrCodeById(id: string) {
  const user = await requireUser();
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("pdf_qr_codes")
    .select("*, documents(*), access_logs(created_at)")
    .eq("id", id)
    .eq("user_id", user.id)
    .order("sort_order", { referencedTable: "documents", ascending: true })
    .single();

  if (error) throw new Error(error.message);

  return {
    ...data,
    total_scans: data.access_logs?.length || 0,
    last_scan_at: data.access_logs?.[0]?.created_at || null,
  } as PdfQrWithDocuments;
}

export async function getPublicPdfQrByToken(token: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("pdf_qr_codes")
    .select("*, documents(*)")
    .eq("token", token)
    .order("sort_order", { referencedTable: "documents", ascending: true })
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as PdfQrWithDocuments | null;
}

export async function replacePdfDocument(formData: FormData) {
  const user = await requireUser();
  const documentId = String(formData.get("document_id") || "");
  const qrCodeId = String(formData.get("qr_code_id") || "");
  const file = formData.get("replacement");
  if (!(file instanceof File)) throw new Error("Выберите PDF-файл.");
  ensurePdfFile(file);

  const supabase = createSupabaseAdminClient();
  const { data: existing, error: existingError } = await supabase
    .from("documents")
    .select("*, pdf_qr_codes!inner(user_id)")
    .eq("id", documentId)
    .single();

  if (existingError || existing?.pdf_qr_codes?.user_id !== user.id) throw new Error("Документ не найден.");

  const [uploaded] = await uploadPdfDocuments({ userId: user.id, qrCodeId, files: [file] });
  const { error: updateError } = await supabase.from("documents").update(uploaded).eq("id", documentId);
  if (updateError) throw new Error(updateError.message);

  await supabase.storage.from(PDF_BUCKET).remove([existing.file_path]);
  revalidatePath(`/dashboard/${qrCodeId}`);
}

export async function deletePdfDocument(formData: FormData) {
  const user = await requireUser();
  const documentId = String(formData.get("document_id") || "");
  const qrCodeId = String(formData.get("qr_code_id") || "");
  const supabase = createSupabaseAdminClient();

  const { data: existing, error: existingError } = await supabase
    .from("documents")
    .select("*, pdf_qr_codes!inner(user_id)")
    .eq("id", documentId)
    .single();

  if (existingError || existing?.pdf_qr_codes?.user_id !== user.id) throw new Error("Документ не найден.");

  await supabase.from("documents").delete().eq("id", documentId);
  await supabase.storage.from(PDF_BUCKET).remove([existing.file_path]);
  revalidatePath(`/dashboard/${qrCodeId}`);
}

export async function disablePdfQrCode(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("qr_code_id") || "");
  const supabase = createSupabaseAdminClient();
  await supabase.from("pdf_qr_codes").update({ status: "disabled" }).eq("id", id).eq("user_id", user.id);
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${id}`);
}

export async function generateSignedPdfUrls(documents: PdfDocument[]) {
  return Promise.all(
    documents.map(async (document) => ({
      ...document,
      signed_url: await generateSignedPdfUrl(document.file_path),
    })),
  );
}

export async function logPdfQrAccess(qrCodeId: string) {
  const headerStore = await headers();
  const supabase = createSupabaseAdminClient();
  await supabase.from("access_logs").insert({
    qr_code_id: qrCodeId,
    ip_address: headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
    user_agent: headerStore.get("user-agent"),
  });
}

export async function verifyPdfQrPassword(_state: ActionState, formData: FormData): Promise<ActionState> {
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  const qrCode = await getPublicPdfQrByToken(token);

  if (!qrCode?.password_hash) return { ok: false, message: "Пароль не требуется или ссылка не найдена." };

  const valid = await bcrypt.compare(password, qrCode.password_hash);
  if (!valid) return { ok: false, message: "Неверный пароль." };

  const documents = await generateSignedPdfUrls(qrCode.documents || []);
  await logPdfQrAccess(qrCode.id);
  return { ok: true, message: "Доступ открыт.", data: { qrCode: { ...qrCode, password_hash: null }, documents } };
}

import { PDF_BUCKET, SIGNED_URL_TTL_SECONDS } from "@/lib/constants";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { safeFileName } from "@/lib/utils";

export async function uploadPdfDocuments(params: {
  userId: string;
  qrCodeId: string;
  files: File[];
}) {
  const supabase = createSupabaseAdminClient();

  return Promise.all(
    params.files.map(async (file, index) => {
      const fileName = safeFileName(file.name);
      const path = `${params.userId}/${params.qrCodeId}/${Date.now()}-${index}-${fileName}`;
      const { error } = await supabase.storage.from(PDF_BUCKET).upload(path, file, {
        contentType: "application/pdf",
        upsert: false,
      });

      if (error) throw new Error(error.message);

      return {
        file_name: fileName,
        file_path: path,
        file_type: "application/pdf",
        file_size: file.size,
        sort_order: index,
      };
    }),
  );
}

export async function generateSignedPdfUrl(filePath: string) {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase.storage
    .from(PDF_BUCKET)
    .createSignedUrl(filePath, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    throw new Error(error?.message || "Не удалось создать signed URL.");
  }

  return data.signedUrl;
}

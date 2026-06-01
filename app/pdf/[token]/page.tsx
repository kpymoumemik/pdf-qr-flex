import { PasswordGate } from "@/components/PasswordGate";
import { PublicPdfViewer } from "@/components/PublicPdfViewer";
import { getPublicPdfQrByToken, logPdfQrAccess } from "@/lib/actions";
import { deriveStatus } from "@/lib/utils";

type Props = {
  params: Promise<{ token: string }>;
};

export default async function PublicPdfPage({ params }: Props) {
  const { token } = await params;
  const qrCode = await getPublicPdfQrByToken(token);

  if (!qrCode) return <StatePage title="PDF-файл не найден" />;

  const status = deriveStatus(qrCode.status, qrCode.expires_at);
  if (status === "disabled") return <StatePage title="Доступ к PDF отключен" />;
  if (status === "expired") return <StatePage title="Срок действия ссылки истек" />;

  const needsPassword = Boolean(qrCode.password_hash);
  if (!needsPassword) await logPdfQrAccess(qrCode.id);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-4xl px-5 py-8">
        <div className="mb-5 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-950">{qrCode.title}</h1>
          <p className="mt-3 text-lg leading-7 text-slate-600">{qrCode.description || "Откройте или скачайте PDF-файл."}</p>
        </div>
        {needsPassword ? (
          <PasswordGate token={token} />
        ) : (
          <PublicPdfViewer token={token} documents={qrCode.documents || []} />
        )}
      </section>
    </main>
  );
}

function StatePage({ title }: { title: string }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-3xl px-5 py-16 text-center">
        <div className="rounded-md border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
        </div>
      </section>
    </main>
  );
}

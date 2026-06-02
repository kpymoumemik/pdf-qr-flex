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
    <main className="min-h-screen">
      <section className="mx-auto max-w-4xl px-4 py-5 sm:px-5 sm:py-8">
        <div className="mb-5 rounded-md border border-white/10 bg-white/8 p-4 shadow-lg shadow-slate-950/20 sm:p-5">
          <h1 className="break-words text-2xl font-semibold text-white sm:text-3xl">{qrCode.title}</h1>
          <p className="mt-3 text-base leading-7 text-slate-300 sm:text-lg">{qrCode.description || "Откройте или скачайте PDF-файл."}</p>
        </div>
        {needsPassword ? <PasswordGate token={token} /> : <PublicPdfViewer token={token} documents={qrCode.documents || []} />}
      </section>
    </main>
  );
}

function StatePage({ title }: { title: string }) {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-5 sm:py-16">
        <div className="rounded-md border border-white/10 bg-white/8 p-8 shadow-lg shadow-slate-950/20">
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
        </div>
      </section>
    </main>
  );
}

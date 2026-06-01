import { deriveStatus } from "@/lib/utils";

const styles = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  disabled: "bg-slate-100 text-slate-600 ring-slate-200",
  expired: "bg-red-50 text-red-700 ring-red-200",
};

const labels = {
  active: "Активно",
  disabled: "Отключено",
  expired: "Истекло",
};

export function StatusBadge({ status, expiresAt }: { status: string; expiresAt?: string | null }) {
  const derived = deriveStatus(status, expiresAt) as keyof typeof styles;
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${styles[derived]}`}>
      {labels[derived]}
    </span>
  );
}

import Link from "next/link";
import { LogOut, Plus, QrCode, Rows3 } from "lucide-react";
import { signOut } from "@/lib/actions";

export function Header({ authenticated = false }: { authenticated?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/78 backdrop-blur-xl">
      <div className="mx-auto flex min-h-18 max-w-6xl flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-3 font-semibold text-white">
          <span className="flex size-10 items-center justify-center rounded-md bg-sky-500 text-white shadow-lg shadow-sky-950/40">
            <QrCode size={22} />
          </span>
          <span className="text-base tracking-tight">PDF QR</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          {authenticated ? (
            <>
              <Link
                href="/dashboard/new"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-sky-500 px-4 text-sm font-semibold text-white shadow-lg shadow-sky-950/30 transition hover:bg-sky-400"
              >
                <Plus size={16} />
                Создать QR
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 bg-white/8 px-4 text-sm font-semibold text-slate-100 transition hover:bg-white/12"
              >
                <Rows3 size={16} />
                Мои QR
              </Link>
              <form action={signOut}>
                <button className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 bg-white/8 px-4 text-sm font-semibold text-slate-100 transition hover:border-red-400/40 hover:bg-red-500/12 hover:text-red-200">
                  <LogOut size={16} />
                  Выйти
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-10 items-center rounded-md bg-sky-500 px-4 text-sm font-semibold text-white shadow-lg shadow-sky-950/30 transition hover:bg-sky-400"
            >
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

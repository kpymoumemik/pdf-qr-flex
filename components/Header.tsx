import Link from "next/link";
import { LogOut, Plus, QrCode, Rows3 } from "lucide-react";
import { signOut } from "@/lib/actions";

export function Header({ authenticated = false }: { authenticated?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/78 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:min-h-18 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <Link href="/" className="flex items-center gap-3 font-semibold text-white">
          <span className="flex size-10 items-center justify-center rounded-md bg-sky-500 text-white shadow-lg shadow-sky-950/40">
            <QrCode size={22} />
          </span>
          <span className="text-base tracking-tight">PDF QR</span>
        </Link>

        <nav className="grid w-full grid-cols-3 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
          {authenticated ? (
            <>
              <Link
                href="/dashboard/new"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-sky-500 px-2 text-sm font-semibold text-white shadow-lg shadow-sky-950/30 transition hover:bg-sky-400 sm:px-4"
              >
                <Plus size={16} />
                <span className="hidden min-[390px]:inline">Создать QR</span>
                <span className="min-[390px]:hidden">Создать</span>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/8 px-2 text-sm font-semibold text-slate-100 transition hover:bg-white/12 sm:px-4"
              >
                <Rows3 size={16} />
                Мои QR
              </Link>
              <form action={signOut}>
                <button className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/8 px-2 text-sm font-semibold text-slate-100 transition hover:border-red-400/40 hover:bg-red-500/12 hover:text-red-200 sm:w-auto sm:px-4">
                  <LogOut size={16} />
                  Выйти
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="col-span-3 inline-flex h-10 items-center justify-center rounded-md bg-sky-500 px-4 text-sm font-semibold text-white shadow-lg shadow-sky-950/30 transition hover:bg-sky-400 sm:col-span-1"
            >
              Войти
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

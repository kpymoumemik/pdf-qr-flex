"use client";

import { useActionState } from "react";
import { verifyPdfQrPassword, type ActionState } from "@/lib/actions";
import { PublicPdfViewer, type PublicPdfDocument } from "@/components/PublicPdfViewer";

const initialState: ActionState = { ok: false, message: "" };

export function PasswordGate({ token }: { token: string }) {
  const [state, action] = useActionState(verifyPdfQrPassword, initialState);
  const payload = state.data as { documents?: PublicPdfDocument[] } | undefined;

  if (state.ok && payload?.documents) {
    return <PublicPdfViewer token={token} documents={payload.documents} />;
  }

  return (
    <form action={action} className="rounded-md border border-white/10 bg-white/8 p-5 shadow-lg shadow-slate-950/20">
      <input type="hidden" name="token" value={token} />
      <h2 className="text-lg font-semibold text-white">Введите пароль</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <input name="password" type="password" required className="h-11 rounded-md border border-white/10 bg-slate-950/55 px-3 text-slate-100 outline-none focus:border-sky-400" />
        <button className="h-11 rounded-md bg-sky-500 px-5 font-semibold text-white hover:bg-sky-400">Открыть</button>
      </div>
      {state.message ? <p className="mt-3 text-sm text-red-300">{state.message}</p> : null}
    </form>
  );
}

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
    <form action={action} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
      <input type="hidden" name="token" value={token} />
      <h2 className="text-lg font-semibold text-slate-950">Введите пароль</h2>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input name="password" type="password" required className="h-11 flex-1 rounded-md border border-slate-300 px-3 outline-none focus:border-sky-500" />
        <button className="h-11 rounded-md bg-sky-500 px-5 font-semibold text-white hover:bg-sky-600">Открыть</button>
      </div>
      {state.message ? <p className="mt-3 text-sm text-red-700">{state.message}</p> : null}
    </form>
  );
}

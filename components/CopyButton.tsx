"use client";

import { useState } from "react";
import { Copy } from "lucide-react";

export function CopyButton({ value, label = "Скопировать ссылку" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm font-semibold hover:border-slate-400"
    >
      <Copy size={16} />
      {copied ? "Скопировано" : label}
    </button>
  );
}

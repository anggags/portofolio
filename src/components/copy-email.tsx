"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type CopyEmailProps = {
  email: string;
  className?: string;
};

export function CopyEmail({ email, className }: CopyEmailProps) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeout.current) clearTimeout(timeout.current);
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // Clipboard API needs a secure context; fall back to a temporary textarea.
      const textarea = document.createElement("textarea");
      textarea.value = email;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn("relative inline-flex flex-col items-center gap-2", className)}>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${email} to clipboard`}
        className="group inline-flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-2.5 font-mono text-sm transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:border-border-strong"
      >
        <span
          className={cn(
            "flex size-4 items-center justify-center transition-colors duration-300",
            copied ? "text-emerald-500" : "text-muted-foreground group-hover:text-foreground",
          )}
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </span>
        {email}
      </button>

      {/* Tooltip */}
      <span
        role="status"
        aria-live="polite"
        className={cn(
          "pointer-events-none absolute -top-1 left-1/2 -translate-x-1/2 -translate-y-full rounded-md border border-border bg-background px-2 py-1 font-mono text-[10px] whitespace-nowrap text-muted shadow-lg transition-all duration-300 ease-out-expo",
          copied ? "translate-y-[-130%] opacity-100" : "translate-y-[-100%] opacity-0",
        )}
      >
        Copied to clipboard
      </span>
    </div>
  );
}

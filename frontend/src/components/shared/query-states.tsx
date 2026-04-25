import type { ReactNode } from "react";
import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";

export function LoadingState({ lines = 4 }: { lines?: number }) {
  return (
    <div className="surface-card rounded-[20px] px-6 py-6">
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`skeleton-line h-4 rounded-full ${
              index === 0 ? "w-1/3" : index === lines - 1 ? "w-2/3" : "w-full"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function ErrorState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="surface-card rounded-[20px] border-[#fecaca] bg-[#fffafa] px-6 py-6">
      <div className="flex items-start gap-4">
        <div className="rounded-[14px] bg-[#fee2e2] p-3 text-[#ef4444]">
          <AlertTriangle className="h-5 w-5" strokeWidth={1.9} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-[18px] font-semibold text-[#111827]">{title}</h3>
          <p className="mt-2 text-[15px] leading-7 text-[#6b7280]">
            {description}
          </p>
          {action ? <div className="mt-5">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="surface-card rounded-[20px] px-6 py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#eef2ff] text-[#4338ca]">
        <Inbox className="h-6 w-6" strokeWidth={1.9} />
      </div>
      <h3 className="mt-5 text-[20px] font-semibold text-[#111827]">{title}</h3>
      <p className="mx-auto mt-3 max-w-[540px] text-[15px] leading-7 text-[#6b7280]">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function RetryButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="button-secondary inline-flex items-center gap-2" onClick={onClick}>
      <RefreshCw className="h-4 w-4" strokeWidth={1.9} />
      <span>Try Again</span>
    </button>
  );
}

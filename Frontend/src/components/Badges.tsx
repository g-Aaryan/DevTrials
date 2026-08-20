import React from "react";

export const DifficultyBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const norm = difficulty.toLowerCase();
  if (norm === "easy") {
    return (
      <span className="inline-flex items-center rounded bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
        Easy
      </span>
    );
  } else if (norm === "medium") {
    return (
      <span className="inline-flex items-center rounded bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 ring-1 ring-inset ring-amber-500/20">
        Medium
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center rounded bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-400 ring-1 ring-inset ring-rose-500/20">
        Hard
      </span>
    );
  }
};

export const VerdictBadge: React.FC<{ verdict: string }> = ({ verdict }) => {
  const v = verdict.toUpperCase();
  switch (v) {
    case "ACCEPTED":
      return (
        <span className="inline-flex items-center rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-bold tracking-wide text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
          ACCEPTED
        </span>
      );
    case "WRONG_ANSWER":
      return (
        <span className="inline-flex items-center rounded bg-rose-500/10 px-2.5 py-1 text-xs font-bold tracking-wide text-rose-400 ring-1 ring-inset ring-rose-500/20">
          WRONG ANSWER
        </span>
      );
    case "TIME_LIMIT_EXCEEDED":
      return (
        <span className="inline-flex items-center rounded bg-amber-500/10 px-2.5 py-1 text-xs font-bold tracking-wide text-amber-400 ring-1 ring-inset ring-amber-500/20">
          TIME LIMIT EXCEEDED
        </span>
      );
    case "MEMORY_LIMIT_EXCEEDED":
      return (
        <span className="inline-flex items-center rounded bg-amber-500/10 px-2.5 py-1 text-xs font-bold tracking-wide text-amber-400 ring-1 ring-inset ring-amber-500/20">
          MEMORY LIMIT EXCEEDED
        </span>
      );
    case "RUNTIME_ERROR":
      return (
        <span className="inline-flex items-center rounded bg-rose-500/10 px-2.5 py-1 text-xs font-bold tracking-wide text-rose-400 ring-1 ring-inset ring-rose-500/20">
          RUNTIME ERROR
        </span>
      );
    case "COMPILATION_ERROR":
      return (
        <span className="inline-flex items-center rounded bg-zinc-500/10 px-2.5 py-1 text-xs font-bold tracking-wide text-zinc-400 ring-1 ring-inset ring-zinc-500/20">
          COMPILATION ERROR
        </span>
      );
    case "PENDING":
    case "QUEUED":
    case "RUNNING":
      return (
        <span className="inline-flex items-center rounded bg-zinc-500/10 px-2.5 py-1 text-xs font-bold tracking-wide text-zinc-400 ring-1 ring-inset ring-zinc-500/20 animate-pulse">
          {v}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded bg-zinc-500/10 px-2.5 py-1 text-xs font-bold tracking-wide text-zinc-400 ring-1 ring-inset ring-zinc-500/20">
          {v}
        </span>
      );
  }
};

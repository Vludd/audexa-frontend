import type { LogEntry } from "@/types"

interface Props {
  logs: LogEntry[]
}

const LEVEL_CLASS: Record<string, string> = {
  INFO: "bg-blue-500/10 text-blue-400",
  WARNING: "bg-amber-500/10 text-amber-400",
  ERROR: "bg-red-500/10 text-red-400",
}

const MESSAGE_CLASS: Record<string, string> = {
  INFO: "text-slate-300",
  WARNING: "text-amber-400",
  ERROR: "text-red-400",
}

export default function LogViewer({ logs }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-700 bg-[#0f1b2e] font-mono">
      <div className="grid grid-cols-[90px_80px_1fr] bg-[#1e2d42] px-4 py-2 text-[11px] font-bold tracking-wider text-[#8fa8c8]">
        <span>ВРЕМЯ</span>
        <span>УРОВЕНЬ</span>
        <span>СООБЩЕНИЕ</span>
      </div>

      {logs.map((entry, index) => (
        <div
          key={entry.id}
          className={[
            "grid grid-cols-[90px_80px_1fr] border-b border-slate-700 px-4 py-1.5 text-[13px]",
            index % 2 === 0 ? "bg-[#0f1b2e]" : "bg-[#111e30]",
          ].join(" ")}
        >
          <span className="tabular-nums text-[#5a7a9a]">
            {entry.time}
          </span>

          <span>
            <span
              className={`rounded px-1.5 py-0.5 text-[11px] font-bold ${
                LEVEL_CLASS[entry.level] ??
                "bg-slate-500/10 text-slate-400"
              }`}
            >
              {entry.level}
            </span>
          </span>

          <span
            className={
              MESSAGE_CLASS[entry.level] ?? "text-slate-300"
            }
          >
            {entry.message}
          </span>
        </div>
      ))}

      {logs.length === 0 && (
        <div className="px-4 py-10 text-center text-[13px] text-[#5a7a9a]">
          Нет записей
        </div>
      )}
    </div>
  )
}
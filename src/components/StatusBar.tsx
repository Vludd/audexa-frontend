import { Settings } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import type { SystemStatus } from "../types"

interface Props {
  status: SystemStatus
}

export default function StatusBar({ status }: Props) {
  return (
    <footer className="flex h-9 shrink-0 items-center gap-0 border-t bg-[#1e2d42] px-5 text-xs text-[#8fa8c8]">
      {/* Audio device */}
      <span>
        Аудиоустройство:{" "}
        <strong className="text-[#c8d8ec]">
          {status.device}
        </strong>
      </span>

      <Separator orientation="vertical" className="mx-3 h-4 bg-[#3a5070]" />

      {/* Connection status */}
      <span className="flex items-center gap-1.5">
        <span
          className={`size-2 rounded-full ${
            status.online ? "bg-[#18B968]" : "bg-[#E53935]"
          }`}
        />

        <strong
          className={
            status.online
              ? "text-[#18B968]"
              : "text-[#E53935]"
          }
        >
          {status.online ? "ONLINE" : "OFFLINE"}
        </strong>
      </span>

      <Separator orientation="vertical" className="mx-3 h-4 bg-[#3a5070]" />

      {/* Outputs */}
      <span>
        Выходы:{" "}
        <strong className="text-[#c8d8ec]">
          {status.outputs} (доступно)
        </strong>
      </span>

      <Separator orientation="vertical" className="mx-3 h-4 bg-[#3a5070]" />

      {/* Sample rate */}
      <span>
        Частота:{" "}
        <strong className="text-[#c8d8ec]">
          {status.sampleRate / 1000} kHz
        </strong>
      </span>

      <Separator orientation="vertical" className="mx-3 h-4 bg-[#3a5070]" />

      {/* Buffer */}
      <span>
        Буфер:{" "}
        <strong className="text-[#c8d8ec]">
          {status.bufferSize} samples
        </strong>
      </span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Audio settings */}
      <button
        type="button"
        className="
          flex items-center gap-1.5
          rounded-md px-2 py-1
          text-xs text-[#8fa8c8]
          transition-colors
          hover:bg-white/5
          hover:text-white
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-ring
        "
      >
        <Settings className="size-[13px]" />
        Настройки аудио
      </button>
    </footer>
  )
}
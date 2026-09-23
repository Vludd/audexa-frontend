import { Settings } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import type { SystemStatus } from "../types"

interface Props { status: SystemStatus }

export default function StatusBar({ status }: Props) {
  return (
    <footer className="flex h-8 shrink-0 items-center border-t bg-[#1d2b3d] px-4 text-[11px] text-[#9db0c8]">
      <span>
        Аудиоустройство: <strong className="text-[#d7e2ef]">{status.device}</strong>
      </span>
      <Separator orientation="vertical" className="mx-3 h-3.5 bg-white/15" />

      <span className="flex items-center gap-1.5">
        <span className={`size-1.5 rounded-full ${status.online ? "bg-emerald-400" : "bg-red-400"}`} />
        <strong className={status.online ? "text-emerald-400" : "text-red-400"}>
          {status.online ? "ONLINE" : "OFFLINE"}
        </strong>
      </span>

      <Separator orientation="vertical" className="mx-3 h-3.5 bg-white/15" />
      <span>Выходы: <strong className="text-[#d7e2ef]">{status.outputs} (доступно)</strong></span>

      <Separator orientation="vertical" className="mx-3 h-3.5 bg-white/15" />
      <span>Частота: <strong className="text-[#d7e2ef]">{status.sampleRate / 1000} kHz</strong></span>

      <Separator orientation="vertical" className="mx-3 h-3.5 bg-white/15" />
      <span>Буфер: <strong className="text-[#d7e2ef]">{status.bufferSize} samples</strong></span>

      <div className="flex-1" />

      <button
        type="button"
        className="flex h-6 items-center gap-1.5 rounded px-2 text-[11px] text-[#9db0c8] transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Settings className="size-3" />
        Настройки аудио
      </button>
    </footer>
  )
}

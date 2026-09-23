import { useEffect, useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"

interface Props {
  title: string
  subtitle?: string
  systemOk?: boolean
}

export default function Header({ title, subtitle, systemOk = true }: Props) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const dateStr = now.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const timeStr = now.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  return (
    <header className="flex min-h-[64px] shrink-0 items-center justify-between border-b bg-card px-5">
      <div className="min-w-0">
        <h1 className="text-[22px] font-bold leading-6 tracking-[-0.02em] text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className="text-right">
          <div className="text-[11px] capitalize leading-4 text-muted-foreground">
            {dateStr}
          </div>
          <div className="text-[22px] font-bold leading-6 tabular-nums text-foreground">
            {timeStr}
          </div>
        </div>

        <Badge
          variant={systemOk ? "success" : "destructive"}
          className="h-auto rounded-md px-2.5 py-1.5"
        >
          {systemOk ? (
            <CheckCircle className="size-3.5 shrink-0" />
          ) : (
            <XCircle className="size-3.5 shrink-0" />
          )}
          <div className="text-left">
            <div className="text-[11px] font-semibold leading-3.5">
              {systemOk ? "Система работает" : "Ошибка системы"}
            </div>
            <div className="text-[10px] font-normal leading-3 opacity-75">
              {systemOk ? "Все линии в норме" : "Проверьте подключение"}
            </div>
          </div>
        </Badge>
      </div>
    </header>
  )
}

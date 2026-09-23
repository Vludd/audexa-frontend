import { useEffect, useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"

interface Props {
  title: string
  subtitle?: string
  systemOk?: boolean
}

export default function Header({
  title,
  subtitle,
  systemOk = true,
}: Props) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date())
    }, 1000)

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
    <header className="flex items-center justify-between border-b bg-card px-6 py-3.5">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold leading-tight text-foreground">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-0.5 text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        {/* Date / time */}
        <div className="text-right">
          <div className="text-xs capitalize text-muted-foreground">
            {dateStr}
          </div>

          <div className="text-2xl font-bold tabular-nums text-foreground">
            {timeStr}
          </div>
        </div>

        {/* System status */}
        <Badge
          variant={systemOk ? "success" : "destructive"}
          className="h-auto gap-2 rounded-md px-3 py-1.5"
        >
          {systemOk ? (
            <CheckCircle className="size-4 shrink-0" />
          ) : (
            <XCircle className="size-4 shrink-0" />
          )}

          <div className="text-left">
            <div className="text-xs font-semibold leading-tight">
              {systemOk ? "Система работает" : "Ошибка системы"}
            </div>

            <div className="mt-0.5 text-[11px] font-normal opacity-80">
              {systemOk
                ? "Все линии в норме"
                : "Проверьте подключение"}
            </div>
          </div>
        </Badge>
      </div>
    </header>
  )
}
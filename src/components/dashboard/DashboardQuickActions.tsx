import { PlayCircle, Radio } from "lucide-react"

import { Button } from "@/components/ui/button"

interface DashboardQuickActionsProps {
  onNavigate: (page: string) => void
}

export default function DashboardQuickActions({
  onNavigate,
}: DashboardQuickActionsProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center border-b px-4 py-3">
        <h3 className="text-sm font-semibold">
          Быстрые действия
        </h3>
      </div>

      <div className="flex flex-col gap-2 p-3.5">
        <Button
          type="button"
          variant="success"
          className="w-full justify-start gap-2.5"
          onClick={() => onNavigate("scenarios")}
        >
          <PlayCircle className="size-4" />
          Запустить сценарий
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2.5"
        >
          <Radio className="size-4" />
          Тест выходов
        </Button>
      </div>
    </div>
  )
}
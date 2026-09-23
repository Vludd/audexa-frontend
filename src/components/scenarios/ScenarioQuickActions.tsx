import {
  Download,
  Headphones,
  Pause,
  Play,
  Square,
  Upload,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import type { Scenario } from "@/types"

interface Props {
  scenario?: Scenario
  onPlay: (id: number) => void
  onStop: (id: number) => void
}

export default function ScenarioQuickActions({
  scenario,
  onPlay,
  onStop,
}: Props) {
  return (
    <aside className="w-[200px] shrink-0 border-l bg-card p-3.5">
      <div className="mb-3 text-sm font-semibold">
        Быстрый запуск
      </div>

      <div className="space-y-2">
        <Button
          type="button"
          variant="success"
          className="w-full justify-start"
          disabled={!scenario}
          onClick={() => scenario && onPlay(scenario.id)}
        >
          <Play className="size-4" fill="currentColor" />
          Запустить сценарий
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
        >
          <Pause className="size-4" />
          Пауза
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full justify-start"
          disabled={!scenario}
          onClick={() => scenario && onStop(scenario.id)}
        >
          <Square className="size-4" />
          Стоп
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          <Headphones className="size-3.5" />
          Тест (первые 10 секунд)
        </Button>
      </div>

      <Separator className="my-4" />

      <div className="mb-3 text-sm font-semibold">
        Экспорт / Импорт
      </div>

      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          <Upload className="size-3.5" />
          Экспортировать
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full justify-start"
        >
          <Download className="size-3.5" />
          Импортировать
        </Button>
      </div>
    </aside>
  )
}
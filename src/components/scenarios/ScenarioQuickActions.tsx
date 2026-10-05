import {
  AlertTriangle,
  Headphones,
  Pause,
  Play,
  Square,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import type { Scenario } from "@/types"
import type { ScenarioValidation } from "@/hooks/useScenarios"

interface Props {
  scenario?: Scenario

  onPlay: (id: number) => void
  onStop: (id: number) => void

  onValidate: (
    scenario: Scenario,
  ) => ScenarioValidation
}

export default function ScenarioQuickActions({
  scenario,
  onPlay,
  onStop,
  onValidate,
}: Props) {
  const validation = scenario
    ? onValidate(scenario)
    : null

  const canRun =
    Boolean(scenario) &&
    Boolean(validation?.valid)

  const handlePlay = () => {
    if (!scenario) return

    if (!validation?.valid) {
      window.alert(
        [
          "Сценарий нельзя запустить:",
          "",
          ...(validation?.errors ?? []),
        ].join("\n"),
      )

      return
    }

    onPlay(scenario.id)
  }

  return (
    <aside className="w-[210px] shrink-0 border-l bg-card p-3.5">
      <div className="mb-3 text-sm font-semibold">
        Быстрый запуск
      </div>

      <div className="space-y-2">
        <Button
          type="button"
          variant="success"
          className="w-full justify-start"
          disabled={!canRun}
          onClick={handlePlay}
        >
          <Play
            className="size-4"
            fill="currentColor"
          />
          Запустить сценарий
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
          disabled={!scenario}
        >
          <Pause className="size-4" />
          Пауза
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full justify-start"
          disabled={!scenario}
          onClick={() =>
            scenario && onStop(scenario.id)
          }
        >
          <Square className="size-4" />
          Стоп
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full justify-start"
          disabled={!canRun}
          onClick={() => {
            if (!scenario) return

            if (!validation?.valid) {
              return
            }

            window.alert(
              `Тестовый запуск сценария «${scenario.name}»`,
            )
          }}
        >
          <Headphones className="size-3.5" />
          Тестовый запуск
        </Button>
      </div>

      {scenario && !validation?.valid && (
        <>
          <Separator className="my-4" />

          <div className="rounded-md border border-destructive/20 bg-destructive/5 p-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-destructive">
              <AlertTriangle className="size-3.5" />
              Сценарий не готов
            </div>

            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Исправьте ошибки перед запуском.
            </p>
          </div>
        </>
      )}
    </aside>
  )
}
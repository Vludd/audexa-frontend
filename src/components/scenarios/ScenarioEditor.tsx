import { ChevronDown, ChevronUp, Edit2, Plus, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import type { Scenario } from "@/types"

import ScenarioSettings from "./ScenarioSettings"
import ScenarioStepsTable from "./ScenarioStepsTable"

interface Props {
  scenario: Scenario
}

function fmtSec(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const sec = seconds % 60

  return `${String(minutes).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

function totalDuration(scenario: Scenario) {
  return scenario.steps.reduce(
    (sum, step) => sum + step.duration + step.delay,
    0,
  )
}

export default function ScenarioEditor({
  scenario,
}: Props) {
  const duration = totalDuration(scenario)

  return (
    <section className="min-w-0 flex-1 overflow-auto p-5">
      {/* Header */}
      <div className="mb-4 flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-xl font-bold">
              {scenario.name}
            </h2>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground"
            >
              <Edit2 className="size-3.5" />
            </Button>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            {scenario.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <InfoPill
            label="Длительность"
            value={fmtSec(duration)}
          />

          <InfoPill
            label="Комнат"
            value={String(scenario.steps.length)}
          />

          <InfoPill
            label="Статус"
            value={
              scenario.status === "active"
                ? "Активный"
                : "Неактивный"
            }
            active={scenario.status === "active"}
          />
        </div>
      </div>

      {/* Steps */}
      <ScenarioStepsTable steps={scenario.steps} />

      {/* Step controls */}
      <div className="my-4 flex items-center gap-2">
        <Button type="button" size="sm">
          <Plus className="size-3.5" />
          Добавить шаг
        </Button>

        <Button
          type="button"
          size="sm"
          variant="outline"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="size-3.5" />
          Удалить шаг
        </Button>

        <Button type="button" size="sm" variant="outline">
          <ChevronUp className="size-3.5" />
          Вверх
        </Button>

        <Button type="button" size="sm" variant="outline">
          <ChevronDown className="size-3.5" />
          Вниз
        </Button>

        <div className="flex-1" />

        <span className="text-xs text-muted-foreground">
          Общая длительность:{" "}
          <strong className="text-foreground">
            {fmtSec(duration)}
          </strong>
        </span>
      </div>

      <ScenarioSettings scenario={scenario} />
    </section>
  )
}

function InfoPill({
  label,
  value,
  active,
}: {
  label: string
  value: string
  active?: boolean
}) {
  return (
    <div className="min-w-[90px] rounded-lg border bg-muted/40 px-3 py-1.5 text-center">
      <div className="text-[10px] text-muted-foreground">
        {label}
      </div>

      <div className="text-sm font-bold">
        {active ? (
          <Badge variant="success" className="mt-0.5">
            {value}
          </Badge>
        ) : (
          value
        )}
      </div>
    </div>
  )
}
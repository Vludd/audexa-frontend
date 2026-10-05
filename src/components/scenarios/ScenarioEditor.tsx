import {
  CheckCircle2,
  Plus,
  TriangleAlert,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import type {
  AudioFile,
  Room,
  Scenario,
  ScenarioStep,
} from "@/types"

import type {
  ScenarioUpdate,
  ScenarioValidation,
} from "@/hooks/useScenarios"

import ScenarioSettings from "./ScenarioSettings"
import ScenarioStepsTable from "./ScenarioStepsTable"

interface Props {
  scenario: Scenario
  rooms: Room[]
  audioFiles: AudioFile[]

  onUpdate: (
    id: number,
    patch: ScenarioUpdate,
  ) => void

  onAddStep: (
    scenarioId: number,
    step?: Partial<ScenarioStep>,
  ) => void

  onUpdateStep: (
    scenarioId: number,
    stepId: number,
    patch: Partial<ScenarioStep>,
  ) => void

  onRemoveStep: (
    scenarioId: number,
    stepId: number,
  ) => void

  onMoveStep: (
    scenarioId: number,
    fromIndex: number,
    toIndex: number,
  ) => void

  onValidate: (
    scenario: Scenario,
  ) => ScenarioValidation
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
  rooms,
  audioFiles,
  onUpdate,
  onAddStep,
  onUpdateStep,
  onRemoveStep,
  onMoveStep,
  onValidate,
}: Props) {
  const duration = totalDuration(scenario)
  const validation = onValidate(scenario)

  const handleAddStep = () => {
    onAddStep(scenario.id, {
      roomId: rooms[0]?.id ?? "",
      roomName: rooms[0]?.name ?? "Не выбрана",
      file: audioFiles[0]?.name ?? "",
      volume: 100,
      delay: 0,
      duration: audioFiles[0]?.duration ?? 0,
    })
  }

  return (
    <section className="min-w-0 flex-1 overflow-auto p-4">
      <div className="mb-4 flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-lg font-bold">
              {scenario.name}
            </h2>

            <Badge
              variant={
                scenario.status === "active"
                  ? "success"
                  : "secondary"
              }
            >
              {scenario.status === "active"
                ? "Активный"
                : "Неактивный"}
            </Badge>
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
            {scenario.description ||
              "Описание сценария не задано"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <InfoPill
            label="Длительность"
            value={fmtSec(duration)}
          />

          <InfoPill
            label="Шагов"
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

      <div
        className={
          validation.valid
            ? "mb-3 flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-3 py-2"
            : "mb-3 rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2"
        }
      >
        {validation.valid ? (
          <>
            <CheckCircle2 className="size-4 text-emerald-500" />

            <span className="text-xs">
              Сценарий готов к запуску.
            </span>
          </>
        ) : (
          <>
            <TriangleAlert className="size-4 text-destructive" />

            <div className="min-w-0">
              <div className="text-xs font-semibold">
                Сценарий требует исправлений
              </div>

              <ul className="mt-1 list-inside list-disc text-[11px] text-muted-foreground">
                {validation.errors.slice(0, 3).map(
                  (error) => (
                    <li key={error}>{error}</li>
                  ),
                )}
              </ul>

              {validation.errors.length > 3 && (
                <div className="mt-1 text-[11px] text-muted-foreground">
                  И ещё {validation.errors.length - 3}...
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <ScenarioStepsTable
        steps={scenario.steps}
        rooms={rooms}
        audioFiles={audioFiles}
        onUpdateStep={(stepId, patch) =>
          onUpdateStep(
            scenario.id,
            stepId,
            patch,
          )
        }
        onRemoveStep={(stepId) =>
          onRemoveStep(scenario.id, stepId)
        }
        onMoveStep={(fromIndex, toIndex) =>
          onMoveStep(
            scenario.id,
            fromIndex,
            toIndex,
          )
        }
      />

      <div className="my-3 flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={handleAddStep}
        >
          <Plus className="size-3.5" />
          Добавить шаг
        </Button>

        <div className="flex-1" />

        <span className="text-xs text-muted-foreground">
          Общая длительность:{" "}
          <strong className="text-foreground">
            {fmtSec(duration)}
          </strong>
        </span>
      </div>

      <ScenarioSettings
        scenario={scenario}
        onUpdate={(patch) =>
          onUpdate(scenario.id, patch)
        }
      />
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
    <div className="min-w-[84px] rounded-md border bg-muted/40 px-2.5 py-1.5 text-center">
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
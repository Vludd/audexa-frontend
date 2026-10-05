import { useMemo, useState } from "react"

import type {
  AudioFile,
  Room,
  Scenario,
  ScenarioStep,
} from "@/types"

import Header from "@/components/Header"
import ScenarioEditor from "@/components/scenarios/ScenarioEditor"
import ScenarioList from "@/components/scenarios/ScenarioList"
import ScenarioQuickActions from "@/components/scenarios/ScenarioQuickActions"
import ScenarioToolbar from "@/components/scenarios/ScenarioToolbar"

import type {
  ScenarioUpdate,
  ScenarioValidation,
} from "@/hooks/useScenarios"

interface Props {
  scenarios: Scenario[]
  rooms: Room[]
  audioFiles: AudioFile[]

  onPlay: (id: number) => void
  onStop: (id: number) => void

  onCreate: () => number
  onUpdate: (id: number, patch: ScenarioUpdate) => void
  onDelete: (id: number) => void
  onDuplicate: (id: number) => number

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

  onValidate: (scenario: Scenario) => ScenarioValidation
}

export default function Scenarios({
  scenarios,
  rooms,
  audioFiles,
  onPlay,
  onStop,
  onCreate,
  onUpdate,
  onDelete,
  onDuplicate,
  onAddStep,
  onUpdateStep,
  onRemoveStep,
  onMoveStep,
  onValidate,
}: Props) {
  const [selected, setSelected] = useState<number | null>(
    scenarios[0]?.id ?? null,
  )

  const [query, setQuery] = useState("")

  const selectedScenario = scenarios.find(
    (item) => item.id === selected,
  )

  const scenario = selectedScenario ?? scenarios[0]

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()

    if (!normalized) {
      return scenarios
    }

    return scenarios.filter(
      (item) =>
        item.name.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized),
    )
  }, [scenarios, query])

  const handleCreate = () => {
    const id = onCreate()
    setSelected(id)
    setQuery("")
  }

  const handleDelete = () => {
    if (!scenario) return

    const confirmed = window.confirm(
      `Удалить сценарий «${scenario.name}»?`,
    )

    if (!confirmed) return

    const currentIndex = scenarios.findIndex(
      (item) => item.id === scenario.id,
    )

    onDelete(scenario.id)

    const next =
      scenarios[currentIndex + 1] ??
      scenarios[currentIndex - 1]

    setSelected(next?.id ?? null)
  }

  const handleDuplicate = () => {
    if (!scenario) return

    const id = onDuplicate(scenario.id)
    setSelected(id)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Header
        title="Сценарии"
        subtitle="Создание и управление аудиосценариями для комнат"
      />

      <ScenarioToolbar
        query={query}
        onQueryChange={setQuery}
        hasSelection={Boolean(scenario)}
        onCreate={handleCreate}
        onDuplicate={handleDuplicate}
        onEdit={() => undefined}
        onDelete={handleDelete}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <ScenarioList
          scenarios={filtered}
          selected={selected}
          onSelect={setSelected}
        />

        {scenario ? (
          <ScenarioEditor
            scenario={scenario}
            rooms={rooms}
            audioFiles={audioFiles}
            onUpdate={onUpdate}
            onAddStep={onAddStep}
            onUpdateStep={onUpdateStep}
            onRemoveStep={onRemoveStep}
            onMoveStep={onMoveStep}
            onValidate={onValidate}
          />
        ) : (
          <div className="flex min-w-0 flex-1 items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-medium">
                Сценариев пока нет
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Создайте первый сценарий, чтобы начать настройку.
              </p>
            </div>
          </div>
        )}

        <ScenarioQuickActions
          scenario={scenario}
          onPlay={onPlay}
          onStop={onStop}
          onValidate={onValidate}
        />
      </div>
    </div>
  )
}
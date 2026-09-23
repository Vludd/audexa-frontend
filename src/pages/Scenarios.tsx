import { useState } from "react"

import type { Scenario } from "@/types"

import Header from "@/components/Header"
import ScenarioEditor from "@/components/scenarios/ScenarioEditor"
import ScenarioList from "@/components/scenarios/ScenarioList"
import ScenarioQuickActions from "@/components/scenarios/ScenarioQuickActions"
import ScenarioToolbar from "@/components/scenarios/ScenarioToolbar"

interface Props {
  scenarios: Scenario[]
  onPlay: (id: number) => void
  onStop: (id: number) => void
}

export default function Scenarios({
  scenarios,
  onPlay,
  onStop,
}: Props) {
  const [selected, setSelected] = useState(
    scenarios[0]?.id ?? 1,
  )

  const [query, setQuery] = useState("")

  const scenario =
    scenarios.find((item) => item.id === selected) ??
    scenarios[0]

  const filtered = scenarios.filter(
    (item) =>
      !query ||
      item.name.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Header
        title="Сценарии"
        subtitle="Создание и управление аудиосценариями для комнат"
      />

      <ScenarioToolbar
        query={query}
        onQueryChange={setQuery}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <ScenarioList
          scenarios={filtered}
          selected={selected}
          onSelect={setSelected}
        />

        {scenario && (
          <ScenarioEditor scenario={scenario} />
        )}

        <ScenarioQuickActions
          scenario={scenario}
          onPlay={onPlay}
          onStop={onStop}
        />
      </div>
    </div>
  )
}
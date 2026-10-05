import type { Scenario } from "@/types"
import { cn } from "cn"

interface Props {
  scenarios: Scenario[]
  selected: number | null
  onSelect: (id: number) => void
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

export default function ScenarioList({
  scenarios,
  selected,
  onSelect,
}: Props) {
  return (
    <aside className="w-[240px] shrink-0 overflow-auto border-r bg-card">
      <div className="border-b px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Список сценариев
      </div>

      {scenarios.length === 0 ? (
        <div className="p-4 text-xs text-muted-foreground">
          Ничего не найдено.
        </div>
      ) : (
        scenarios.map((scenario, index) => {
          const active = selected === scenario.id

          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => onSelect(scenario.id)}
              className={cn(
                "w-full border-l-2 px-3.5 py-3 text-left transition-colors",
                active
                  ? "border-primary bg-primary/10"
                  : "border-transparent hover:bg-muted/60",
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded text-[10px] font-bold",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                  {scenario.name}
                </span>

                <span
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    scenario.status === "active"
                      ? "bg-emerald-500"
                      : "bg-muted-foreground/30",
                  )}
                />
              </div>

              {scenario.description && (
                <div className="ml-8 mt-1 truncate text-[11px] text-muted-foreground">
                  {scenario.description}
                </div>
              )}

              <div className="ml-8 mt-1.5 flex gap-2 text-[11px] text-muted-foreground">
                <span>
                  {scenario.steps.length}{" "}
                  {scenario.steps.length === 1
                    ? "шаг"
                    : "шагов"}
                </span>

                <span>·</span>

                <span>
                  {fmtSec(totalDuration(scenario))}
                </span>
              </div>
            </button>
          )
        })
      )}
    </aside>
  )
}
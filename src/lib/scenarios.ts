import type { Scenario } from "@/types"

export function getScenarioDuration(scenario: Scenario): number {
  return scenario.steps.reduce(
    (duration, step) => duration + step.duration + step.delay,
    0,
  )
}

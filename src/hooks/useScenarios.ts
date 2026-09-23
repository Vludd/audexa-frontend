import { useCallback, useState } from "react"

import { mockScenarios } from "@/data/mock"
import type { Room, Scenario } from "@/types"

interface RoomActions {
  updateRoom: (id: number, patch: Partial<Room>) => void
  stopAllRooms: (options?: {
    resetPosition?: boolean
    includeSyncLine?: boolean
  }) => void
}

export function useScenarios({
  updateRoom,
  stopAllRooms,
}: RoomActions) {
  const [scenarios] = useState<Scenario[]>(mockScenarios)

  const playScenario = useCallback(
    (id: number) => {
      const scenario = scenarios.find((item) => item.id === id)

      if (!scenario) return

      scenario.steps.forEach((step) => {
        updateRoom(step.roomId, {
          status: "playing",
          file: step.file,
          volume: step.volume,
        })
      })
    },
    [scenarios, updateRoom],
  )

  const stopScenario = useCallback(() => {
    stopAllRooms({
      resetPosition: false,
      includeSyncLine: false,
    })
  }, [stopAllRooms])

  return {
    scenarios,
    playScenario,
    stopScenario,
  }
}

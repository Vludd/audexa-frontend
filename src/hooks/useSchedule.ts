import { useCallback, useState } from "react"

import { mockSchedule } from "@/data/mock"

export function useSchedule() {
  const [schedule, setSchedule] = useState(mockSchedule)

  const toggleSchedule = useCallback((id: number) => {
    setSchedule((currentSchedule) =>
      currentSchedule.map((item) =>
        item.id === id
          ? {
              ...item,
              enabled: !item.enabled,
              status: !item.enabled ? "active" : "inactive",
            }
          : item,
      ),
    )
  }, [])

  return {
    schedule,
    toggleSchedule,
  }
}
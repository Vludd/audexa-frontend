import { useCallback, useState } from "react"

import { mockSchedule } from "@/data/mock"
import type {
  ScheduleFormData,
  ScheduleItem,
  Weekday,
} from "@/types"
import { t } from "@/i18n"

const DAY_ORDER: Weekday[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
]

export function useSchedule() {
  const [schedule, setSchedule] =
    useState<ScheduleItem[]>(() =>
      mockSchedule.map((item) => ({
        ...item,
        nextRun: item.enabled
          ? calculateNextRun(item.time, item.days, item.repeat)
          : "—",
      })),
    )

  const toggleSchedule = useCallback((id: number) => {
    setSchedule((currentSchedule) =>
      currentSchedule.map((item) => {
        if (item.id !== id) {
          return item
        }

        const enabled = !item.enabled

        return {
          ...item,
          enabled,
          status: enabled
            ? "active"
            : "inactive",
          nextRun: enabled
            ? calculateNextRun(
                item.time,
                item.days,
                item.repeat,
              )
            : "—",
        }
      }),
    )
  }, [])

  const addSchedule = useCallback(
    (data: ScheduleFormData) => {
      setSchedule((currentSchedule) => {
        const nextId =
          currentSchedule.length === 0
            ? 1
            : Math.max(
                ...currentSchedule.map(
                  (item) => item.id,
                ),
              ) + 1

        const item: ScheduleItem = {
          id: nextId,
          enabled: data.enabled,
          time: data.time,
          scenarioId: data.scenarioId,
          scenarioName: data.scenarioName,
          days: [...data.days],
          repeat: data.repeat,
          nextRun: data.enabled
            ? calculateNextRun(
                data.time,
                data.days,
                data.repeat,
              )
            : "—",
          status: data.enabled
            ? "active"
            : "inactive",
        }

        return [
          ...currentSchedule,
          item,
        ]
      })
    },
    [],
  )

  const updateSchedule = useCallback(
    (
      id: number,
      data: ScheduleFormData,
    ) => {
      setSchedule((currentSchedule) =>
        currentSchedule.map((item) => {
          if (item.id !== id) {
            return item
          }

          return {
            ...item,
            time: data.time,
            scenarioId: data.scenarioId,
            scenarioName: data.scenarioName,
            days: [...data.days],
            repeat: data.repeat,
            enabled: data.enabled,
            status: data.enabled
              ? "active"
              : "inactive",
            nextRun: data.enabled
              ? calculateNextRun(
                  data.time,
                  data.days,
                  data.repeat,
                )
              : "—",
          }
        }),
      )
    },
    [],
  )

  const deleteSchedule = useCallback(
    (id: number) => {
      setSchedule((currentSchedule) =>
        currentSchedule.filter(
          (item) => item.id !== id,
        ),
      )
    },
    [],
  )

  const duplicateSchedule = useCallback(
    (id: number) => {
      setSchedule((currentSchedule) => {
        const source = currentSchedule.find(
          (item) => item.id === id,
        )

        if (!source) {
          return currentSchedule
        }

        const nextId =
          currentSchedule.length === 0
            ? 1
            : Math.max(
                ...currentSchedule.map(
                  (item) => item.id,
                ),
              ) + 1

        const time = getNextTime(source.time)

        const duplicate: ScheduleItem = {
          ...source,
          id: nextId,
          time,
          nextRun: source.enabled
            ? calculateNextRun(
                time,
                source.days,
                source.repeat,
              )
            : "—",
        }

        return [
          ...currentSchedule,
          duplicate,
        ]
      })
    },
    [],
  )

  return {
    schedule,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    duplicateSchedule,
    toggleSchedule,
  }
}

function calculateNextRun(
  time: string,
  days: Weekday[],
  repeat: ScheduleItem["repeat"],
) {
  if (days.length === 0) {
    return "—"
  }

  if (repeat === "once") {
    return t("schedule.nextRun.todayAt", { time })
  }

  const now = new Date()

  const currentDay =
    now.getDay() === 0
      ? 6
      : now.getDay() - 1

  const currentTime =
    `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes(),
    ).padStart(2, "0")}`

  const sortedDays = [...days].sort(
    (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b),
  )

  for (const day of sortedDays) {
    const dayIndex = DAY_ORDER.indexOf(day)
    const localizedDay = t(`schedule.weekdays.${day}`)

    if (dayIndex > currentDay) {
      return t("schedule.nextRun.dayAt", {
        day: localizedDay,
        time,
      })
    }

    if (
      dayIndex === currentDay &&
      time > currentTime
    ) {
      return t("schedule.nextRun.todayAt", { time })
    }
  }

  return t("schedule.nextRun.nextDayAt", {
    day: t(`schedule.weekdays.${sortedDays[0]}`),
    time,
  })
}

function getNextTime(time: string) {
  const [hours, minutes] =
    time.split(":").map(Number)

  const totalMinutes =
    hours * 60 + minutes + 5

  const nextHours =
    Math.floor(totalMinutes / 60) % 24

  const nextMinutes =
    totalMinutes % 60

  return `${String(nextHours).padStart(2, "0")}:${String(
    nextMinutes,
  ).padStart(2, "0")}`
}
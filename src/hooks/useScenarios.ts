import { useCallback, useState } from "react"

import { mockScenarios } from "@/data/mock"
import type { Room, Scenario, ScenarioStep } from "@/types"

interface RoomActions {
  updateRoom: (id: string, patch: Partial<Room>) => void
  stopAllRooms: (options?: {
    resetPosition?: boolean
    includeSyncLine?: boolean
  }) => void
}

export interface ScenarioUpdate {
  name?: string
  description?: string
  status?: Scenario["status"]
  playMode?: string
  repeat?: string
  autoStart?: boolean
  stopPrevious?: boolean
  syncTranslation?: boolean
  crossfade?: boolean
  notifications?: boolean
}

export interface ScenarioValidation {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export function useScenarios({
  updateRoom,
  stopAllRooms,
}: RoomActions) {
  const [scenarios, setScenarios] =
    useState<Scenario[]>(mockScenarios)

  const playScenario = useCallback(
    (id: number) => {
      const scenario = scenarios.find((item) => item.id === id)

      if (!scenario) return

      scenario.steps.forEach((step) => {
        if (!step.roomId) return

        updateRoom(step.roomId, {
          status: "playing",
          audioFileId: step.file || null,
          volume: step.volume,
          position: 0,
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

  const createScenario = useCallback(() => {
    let newId = 1

    setScenarios((current) => {
      newId =
        current.length > 0
          ? Math.max(...current.map((item) => item.id)) + 1
          : 1

      const scenario: Scenario = {
        id: newId,
        name: "Новый сценарий",
        description: "",
        steps: [],
        status: "inactive",
        playMode: "sequential",
        repeat: "once",
        autoStart: false,
        stopPrevious: true,
        syncTranslation: false,
        crossfade: false,
        notifications: true,
      }

      return [...current, scenario]
    })

    return newId
  }, [])

  const updateScenario = useCallback(
    (id: number, patch: ScenarioUpdate) => {
      setScenarios((current) =>
        current.map((scenario) =>
          scenario.id === id
            ? {
                ...scenario,
                ...patch,
              }
            : scenario,
        ),
      )
    },
    [],
  )

  const deleteScenario = useCallback((id: number) => {
    setScenarios((current) =>
      current.filter((scenario) => scenario.id !== id),
    )
  }, [])

  const duplicateScenario = useCallback((id: number) => {
    let newId = 1

    setScenarios((current) => {
      const source = current.find((item) => item.id === id)

      if (!source) {
        return current
      }

      newId =
        current.length > 0
          ? Math.max(...current.map((item) => item.id)) + 1
          : 1

      const copy: Scenario = {
        ...structuredClone(source),
        id: newId,
        name: `${source.name} (копия)`,
        status: "inactive",
        steps: source.steps.map((step, index) => ({
          ...step,
          id: index + 1,
        })),
      }

      return [...current, copy]
    })

    return newId
  }, [])

  const addStep = useCallback(
    (
      scenarioId: number,
      step?: Partial<ScenarioStep>,
    ) => {
      setScenarios((current) =>
        current.map((scenario) => {
          if (scenario.id !== scenarioId) {
            return scenario
          }

          const nextId =
            scenario.steps.length > 0
              ? Math.max(
                  ...scenario.steps.map((item) => item.id),
                ) + 1
              : 1

          const newStep: ScenarioStep = {
            id: nextId,
            roomId: step?.roomId ?? "",
            roomName: step?.roomName ?? "Не выбрана",
            file: step?.file ?? "",
            volume: step?.volume ?? 100,
            delay: step?.delay ?? 0,
            duration: step?.duration ?? 0,
          }

          return {
            ...scenario,
            steps: [...scenario.steps, newStep],
          }
        }),
      )
    },
    [],
  )

  const updateStep = useCallback(
    (
      scenarioId: number,
      stepId: number,
      patch: Partial<ScenarioStep>,
    ) => {
      setScenarios((current) =>
        current.map((scenario) => {
          if (scenario.id !== scenarioId) {
            return scenario
          }

          return {
            ...scenario,
            steps: scenario.steps.map((step) =>
              step.id === stepId
                ? {
                    ...step,
                    ...patch,
                  }
                : step,
            ),
          }
        }),
      )
    },
    [],
  )

  const removeStep = useCallback(
    (scenarioId: number, stepId: number) => {
      setScenarios((current) =>
        current.map((scenario) => {
          if (scenario.id !== scenarioId) {
            return scenario
          }

          const steps = scenario.steps
            .filter((step) => step.id !== stepId)
            .map((step, index) => ({
              ...step,
              id: index + 1,
            }))

          return {
            ...scenario,
            steps,
          }
        }),
      )
    },
    [],
  )

  const moveStep = useCallback(
    (
      scenarioId: number,
      fromIndex: number,
      toIndex: number,
    ) => {
      setScenarios((current) =>
        current.map((scenario) => {
          if (scenario.id !== scenarioId) {
            return scenario
          }

          if (
            fromIndex < 0 ||
            toIndex < 0 ||
            fromIndex >= scenario.steps.length ||
            toIndex >= scenario.steps.length
          ) {
            return scenario
          }

          const steps = [...scenario.steps]
          const [moved] = steps.splice(fromIndex, 1)

          steps.splice(toIndex, 0, moved)

          return {
            ...scenario,
            steps: steps.map((step, index) => ({
              ...step,
              id: index + 1,
            })),
          }
        }),
      )
    },
    [],
  )

  const validateScenario = useCallback(
    (scenario: Scenario): ScenarioValidation => {
      const errors: string[] = []
      const warnings: string[] = []

      if (!scenario.name.trim()) {
        errors.push("Укажите название сценария.")
      }

      if (scenario.steps.length === 0) {
        errors.push("Добавьте хотя бы один шаг.")
      }

      scenario.steps.forEach((step, index) => {
        const number = index + 1

        if (!step.roomId) {
          errors.push(`Шаг ${number}: не выбрана комната.`)
        }

        if (!step.file) {
          errors.push(`Шаг ${number}: не выбран аудиофайл.`)
        }

        if (step.volume < 0 || step.volume > 100) {
          errors.push(
            `Шаг ${number}: громкость должна быть от 0 до 100%.`,
          )
        }

        if (step.delay < 0) {
          errors.push(
            `Шаг ${number}: задержка не может быть отрицательной.`,
          )
        }

        if (step.duration <= 0) {
          warnings.push(
            `Шаг ${number}: длительность аудио не определена.`,
          )
        }
      })

      return {
        valid: errors.length === 0,
        errors,
        warnings,
      }
    },
    [],
  )

  return {
    scenarios,
    playScenario,
    stopScenario,

    createScenario,
    updateScenario,
    deleteScenario,
    duplicateScenario,

    addStep,
    updateStep,
    removeStep,
    moveStep,

    validateScenario,
  }
}
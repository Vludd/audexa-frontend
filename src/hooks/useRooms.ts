import { useCallback, useState } from "react"

import { mockRooms, syncLine as defaultSyncLine } from "@/data/mock"
import type { Room } from "@/types"

export type RoomOperation = "starting" | "stopping" | "pausing"

export interface RoomInput {
  name: string
  file: string
  volume: number
}

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms)
  const [syncLine, setSyncLine] = useState<Room>(defaultSyncLine)

  /**
   * Runtime state of currently executing room operations.
   *
   * This is intentionally kept outside Room because it is not
   * part of the room's persistent/domain state.
   */
  const [operations, setOperations] = useState<
    Record<number, RoomOperation>
  >({})

  const updateSyncLine = useCallback((patch: Partial<Room>) => {
    setSyncLine((room) => ({
      ...room,
      ...patch,
    }))
  }, [])

  const updateRoom = useCallback(
    (id: number, patch: Partial<Room>) => {
      setRooms((currentRooms) =>
        currentRooms.map((room) =>
          room.id === id
            ? { ...room, ...patch }
            : room,
        ),
      )
    },
    [],
  )

  const runOperation = useCallback(
    async (
      id: number,
      operation: RoomOperation,
      action: () => void,
    ) => {
      setOperations((current) => ({
        ...current,
        [id]: operation,
      }))

      try {
        // Temporary mock delay.
        // Will be replaced with the real backend/audio-engine request.
        await new Promise((resolve) =>
          setTimeout(resolve, 400),
        )

        action()
      } finally {
        setOperations((current) => {
          const next = { ...current }
          delete next[id]
          return next
        })
      }
    },
    [],
  )

  const addRoom = useCallback((input: RoomInput) => {
    setRooms((currentRooms) => {
      const nextId =
        currentRooms.length > 0
          ? Math.max(
              ...currentRooms.map((room) => room.id),
            ) + 1
          : 1

      const newRoom: Room = {
        id: nextId,
        name: input.name,
        status: "stopped",
        file: input.file,
        volume: input.volume,
        position: 0,
        duration: 0,
      }

      return [...currentRooms, newRoom]
    })
  }, [])

  const deleteRoom = useCallback((id: number) => {
    setRooms((currentRooms) =>
      currentRooms.filter((room) => room.id !== id),
    )
  }, [])

  const duplicateRoom = useCallback((id: number) => {
    setRooms((currentRooms) => {
      const source = currentRooms.find(
        (room) => room.id === id,
      )

      if (!source) return currentRooms

      const nextId =
        currentRooms.length > 0
          ? Math.max(
              ...currentRooms.map((room) => room.id),
            ) + 1
          : 1

      return [
        ...currentRooms,
        {
          ...source,
          id: nextId,
          name: `${source.name} — копия`,
          status: "stopped",
          position: 0,
        },
      ]
    })
  }, [])

  const playRoom = useCallback(
    (id: number) =>
      runOperation(id, "starting", () => {
        updateRoom(id, {
          status: "playing",
        })
      }),
    [runOperation, updateRoom],
  )

  const stopRoom = useCallback(
    (id: number) =>
      runOperation(id, "stopping", () => {
        updateRoom(id, {
          status: "stopped",
          position: 0,
        })
      }),
    [runOperation, updateRoom],
  )

  const pauseRoom = useCallback(
    (id: number) =>
      runOperation(id, "pausing", () => {
        updateRoom(id, {
          status: "paused",
        })
      }),
    [runOperation, updateRoom],
  )

  const playSyncLine = useCallback(
    () =>
      runOperation(syncLine.id, "starting", () => {
        updateSyncLine({
          status: "playing",
        })
      }),
    [runOperation, syncLine.id, updateSyncLine],
  )

  const stopSyncLine = useCallback(
    () =>
      runOperation(syncLine.id, "stopping", () => {
        updateSyncLine({
          status: "stopped",
          position: 0,
        })
      }),
    [runOperation, syncLine.id, updateSyncLine],
  )

  const setRoomVolume = useCallback(
    (id: number, volume: number) => {
      updateRoom(id, { volume })
    },
    [updateRoom],
  )

  const stopAllRooms = useCallback(
    (
      options: {
        resetPosition?: boolean
        includeSyncLine?: boolean
      } = {},
    ) => {
      const {
        resetPosition = true,
        includeSyncLine = true,
      } = options

      setRooms((currentRooms) =>
        currentRooms.map((room) => ({
          ...room,
          status: "stopped",
          ...(resetPosition ? { position: 0 } : {}),
        })),
      )

      if (includeSyncLine) {
        setSyncLine((room) => ({
          ...room,
          status: "stopped",
          ...(resetPosition ? { position: 0 } : {}),
        }))
      }

      setOperations({})
    },
    [],
  )

  return {
    rooms,
    syncLine,
    operations,

    updateRoom,
    addRoom,
    deleteRoom,
    duplicateRoom,

    playRoom,
    stopRoom,
    pauseRoom,

    playSyncLine,
    stopSyncLine,

    setRoomVolume,
    stopAllRooms,
  }
}
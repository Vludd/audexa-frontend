import { useCallback, useState } from "react"

import { mockRooms, syncLine as defaultSyncLine } from "@/data/mock"
import type { Room, RoomOperation } from "@/types"
import { t } from "@/i18n"

function createEntityId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }

  return `room-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export interface RoomInput {
  name: string
  audioFileId: string | null
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
    Record<string, RoomOperation>
  >({})

  const updateSyncLine = useCallback((patch: Partial<Room>) => {
    setSyncLine((room) => ({
      ...room,
      ...patch,
    }))
  }, [])

  const updateRoom = useCallback(
    (id: string, patch: Partial<Room>) => {
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
      id: string,
      operation: RoomOperation,
      action: () => void,
    ) => {
      setOperations((current) => ({
        ...current,
        [id]: operation,
      }))

      try {
        // Temporary mock delay; replace with the real backend/audio-engine request.
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
    const newRoom: Room = {
      id: createEntityId(),
      name: input.name,
      status: "stopped",
      audioFileId: input.audioFileId,
      volume: input.volume,
      position: 0,
      duration: 0,
    }

    setRooms((currentRooms) => [
      ...currentRooms,
      newRoom,
    ])
  }, [])

  const deleteRoom = useCallback((id: string) => {
    setRooms((currentRooms) =>
      currentRooms.filter((room) => room.id !== id),
    )
  }, [])

  const duplicateRoom = useCallback((id: string) => {
    setRooms((currentRooms) => {
      const source = currentRooms.find(
        (room) => room.id === id,
      )

      if (!source) return currentRooms

      const duplicatedRoom: Room = {
        ...source,
        id: createEntityId(),
        name: `${source.name} — ${t("rooms.duplicateSuffix")}`,
        status: "stopped",
        position: 0,
      }

      return [
        ...currentRooms,
        duplicatedRoom,
      ]
    })
  }, [])

  const playRoom = useCallback(
    (id: string) =>
      runOperation(id, "starting", () => {
        updateRoom(id, {
          status: "playing",
        })
      }),
    [runOperation, updateRoom],
  )

  const stopRoom = useCallback(
    (id: string) =>
      runOperation(id, "stopping", () => {
        updateRoom(id, {
          status: "stopped",
          position: 0,
        })
      }),
    [runOperation, updateRoom],
  )

  const pauseRoom = useCallback(
    (id: string) =>
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
    (id: string, volume: number) => {
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
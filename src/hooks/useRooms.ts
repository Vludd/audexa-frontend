import { useCallback, useState } from "react"

import { mockRooms, syncLine as defaultSyncLine } from "@/data/mock"
import type { Room } from "@/types"

const SYNC_LINE_ID = 31

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms)
  const [syncLine, setSyncLine] = useState<Room>(defaultSyncLine)

  const updateRoom = useCallback((id: number, patch: Partial<Room>) => {
    if (id === SYNC_LINE_ID) {
      setSyncLine((room) => ({ ...room, ...patch }))
      return
    }

    setRooms((currentRooms) =>
      currentRooms.map((room) =>
        room.id === id ? { ...room, ...patch } : room,
      ),
    )
  }, [])

  const playRoom = useCallback(
    (id: number) => updateRoom(id, { status: "playing" }),
    [updateRoom],
  )

  const stopRoom = useCallback(
    (id: number) => updateRoom(id, { status: "stopped", position: 0 }),
    [updateRoom],
  )

  const pauseRoom = useCallback(
    (id: number) => updateRoom(id, { status: "stopped" }),
    [updateRoom],
  )

  const setRoomVolume = useCallback(
    (id: number, volume: number) => updateRoom(id, { volume }),
    [updateRoom],
  )

  const stopAllRooms = useCallback(
    (options: { resetPosition?: boolean; includeSyncLine?: boolean } = {}) => {
      const { resetPosition = true, includeSyncLine = true } = options

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
    },
    [],
  )

  return {
    rooms,
    syncLine,
    updateRoom,
    playRoom,
    stopRoom,
    pauseRoom,
    setRoomVolume,
    stopAllRooms,
  }
}

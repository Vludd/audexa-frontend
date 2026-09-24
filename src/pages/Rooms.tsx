import { useState } from "react"

import type { Room } from "@/types"
import type { RoomOperation } from "@/hooks/useRooms"

import Header from "@/components/Header"
import RoomDialog from "@/components/rooms/RoomDialog"
import RoomCard from "@/components/rooms/RoomCard"
import RoomFilters, {
  type RoomFilter,
} from "@/components/rooms/RoomFilters"
import RoomTable from "@/components/rooms/RoomTable"
import RoomToolbar from "@/components/rooms/RoomToolbar"
import SyncLineCard from "@/components/rooms/SyncLineCard"

interface Props {
  rooms: Room[]
  syncLine: Room
  operations: Record<number, RoomOperation>

  onPlay: (id: number) => void
  onStop: (id: number) => void
  onPause: (id: number) => void
  playSyncLine: () => void
  stopSyncLine: () => void
  onVolumeChange: (id: number, vol: number) => void

  onAddRoom: (data: {
    name: string
    file: string
    volume: number
  }) => void

  onUpdateRoom: (
    id: number,
    patch: {
      name: string
      file: string
      volume: number
    },
  ) => void

  onDeleteRoom: (id: number) => void
  onDuplicateRoom: (id: number) => void
}

export default function Rooms({
  rooms,
  syncLine,
  operations,
  onPlay,
  onStop,
  onPause,
  playSyncLine,
  stopSyncLine,
  onVolumeChange,
  onAddRoom,
  onUpdateRoom,
  onDeleteRoom,
  onDuplicateRoom,
}: Props) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<RoomFilter>("all")
  const [viewGrid, setViewGrid] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)

  const counts: Record<RoomFilter, number> = {
    all: rooms.length,
    playing: rooms.filter((room) => room.status === "playing").length,
    waiting: rooms.filter((room) => room.status === "waiting").length,
    stopped: rooms.filter((room) => room.status === "stopped").length,
    error: rooms.filter((room) => room.status === "error").length,
  }

  const filtered = rooms.filter((room) => {
    const matchFilter =
      filter === "all" || room.status === filter

    const normalizedQuery = query.toLowerCase()

    const matchQuery =
      !query ||
      room.name.toLowerCase().includes(normalizedQuery) ||
      String(room.id).includes(query)

    return matchFilter && matchQuery
  })

  const openCreateDialog = () => {
    setEditingRoom(null)
    setDialogOpen(true)
  }

  const openEditDialog = (room: Room) => {
    setEditingRoom(room)
    setDialogOpen(true)
  }

  const handleSave = (data: {
    name: string
    file: string
    volume: number
  }) => {
    if (editingRoom) {
      onUpdateRoom(editingRoom.id, data)
    } else {
      onAddRoom(data)
    }
  }

  const handleDelete = () => {
    if (!editingRoom) return

    onDeleteRoom(editingRoom.id)
    setEditingRoom(null)
    setDialogOpen(false)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Header
        title="Комнаты"
        subtitle="Управление аудиолиниями комнат"
      />

      <main className="min-h-0 flex-1 overflow-auto p-4">
        <RoomToolbar
          query={query}
          viewGrid={viewGrid}
          onQueryChange={setQuery}
          onViewChange={setViewGrid}
          onAddRoom={openCreateDialog}
        />

        <RoomFilters
          value={filter}
          counts={counts}
          onChange={setFilter}
        />

        {viewGrid ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
            {filtered.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                operation={operations[room.id]}
                onPlay={onPlay}
                onStop={onStop}
                onPause={onPause}
                onVolumeChange={onVolumeChange}
                onEdit={() => openEditDialog(room)}
                onDuplicate={() => onDuplicateRoom(room.id)}
                onDelete={() => onDeleteRoom(room.id)}
              />
            ))}
          </div>
        ) : (
          <RoomTable
            rooms={filtered}
            operations={operations}
            onPlay={onPlay}
            onStop={onStop}
            onPause={onPause}
          />
        )}

        <SyncLineCard
          room={syncLine}
          operation={operations[syncLine.id]}
          onPlay={playSyncLine}
          onStop={stopSyncLine}
        />
      </main>

      <RoomDialog
        open={dialogOpen}
        room={editingRoom}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        onDelete={editingRoom ? handleDelete : undefined}
      />
    </div>
  )
}
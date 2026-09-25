import { useState } from "react"

import type { Room } from "@/types"
import type { RoomOperation } from "@/hooks/useRooms"

import { toast } from "@/lib/toast"

import Header from "@/components/Header"
import RoomDialog, {
  type RoomFormData,
} from "@/components/rooms/RoomDialog"
import RoomCard from "@/components/rooms/RoomCard"
import RoomFilters, {
  type RoomFilter,
} from "@/components/rooms/RoomFilters"
import RoomTable from "@/components/rooms/RoomTable"
import RoomToolbar from "@/components/rooms/RoomToolbar"
import SyncLineCard from "@/components/rooms/SyncLineCard"

import ConfirmDialog from "@/components/ui/confirm-dialog"

import { useConfirm } from "@/hooks/useConfirm"

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
  const [filter, setFilter] =
    useState<RoomFilter>("all")

  const [viewGrid, setViewGrid] = useState(true)

  const [dialogOpen, setDialogOpen] =
    useState(false)

  const [editingRoom, setEditingRoom] =
    useState<Room | null>(null)

  const confirmation = useConfirm()

  const counts: Record<RoomFilter, number> = {
    all: rooms.length,

    playing: rooms.filter(
      (room) => room.status === "playing",
    ).length,

    waiting: rooms.filter(
      (room) => room.status === "waiting",
    ).length,

    stopped: rooms.filter(
      (room) => room.status === "stopped",
    ).length,

    error: rooms.filter(
      (room) => room.status === "error",
    ).length,
  }

  const filtered = rooms.filter((room) => {
    const matchFilter =
      filter === "all" ||
      room.status === filter

    const normalizedQuery =
      query.toLowerCase()

    const matchQuery =
      !query ||
      room.name
        .toLowerCase()
        .includes(normalizedQuery) ||
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

  const handleDialogChange = (
    open: boolean,
  ) => {
    setDialogOpen(open)

    if (!open) {
      setEditingRoom(null)
    }
  }

  const handleSave = (
    data: RoomFormData,
  ) => {
    if (editingRoom) {
      onUpdateRoom(
        editingRoom.id,
        data,
      )

      toast.success("Комната сохранена", {
        description: `Изменения комнаты «${editingRoom.name}» сохранены.`,
      })
    } else {
      onAddRoom(data)

      toast.success("Комната создана", {
        description: `Комната «${data.name}» добавлена.`,
      })
    }

    setDialogOpen(false)
    setEditingRoom(null)
  }

  const handleDelete = (room: Room) => {
    confirmation.confirm({
      title: "Удалить комнату?",
      description: `Комната «${room.name}» будет удалена. Это действие нельзя отменить.`,
      confirmLabel: "Удалить",
      cancelLabel: "Отмена",
      variant: "destructive",

      onConfirm: async () => {
        onDeleteRoom(room.id)

        toast.success("Комната удалена", {
          description: `Комната «${room.name}» успешно удалена.`,
        })
      },
    })
  }

  const handleDuplicate = (room: Room) => {
    onDuplicateRoom(room.id)

    toast.success("Комната дублирована", {
      description: `Создана копия комнаты «${room.name}».`,
    })
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
                onEdit={() =>
                  openEditDialog(room)
                }
                onDuplicate={() =>
                  handleDuplicate(room)
                }
                onDelete={() =>
                  handleDelete(room)
                }
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
            onEdit={openEditDialog}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onVolumeChange={onVolumeChange}
          />
        )}

        <SyncLineCard
          room={syncLine}
          operation={
            operations[syncLine.id]
          }
          onPlay={playSyncLine}
          onStop={stopSyncLine}
        />
      </main>

      <RoomDialog
        open={dialogOpen}
        room={editingRoom}
        onOpenChange={handleDialogChange}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={confirmation.open}
        onOpenChange={(open) => {
          if (!open) {
            confirmation.close()
          }
        }}
        title={
          confirmation.options?.title ?? ""
        }
        description={
          confirmation.options?.description
        }
        confirmLabel={
          confirmation.options?.confirmLabel
        }
        cancelLabel={
          confirmation.options?.cancelLabel
        }
        variant={
          confirmation.options?.variant
        }
        loading={confirmation.loading}
        onConfirm={
          confirmation.handleConfirm
        }
      />
    </div>
  )
}
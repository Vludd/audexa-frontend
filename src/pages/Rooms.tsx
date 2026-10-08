import { useState } from "react"

import type { Room } from "@/types"
import type { RoomOperation } from "@/types"

import { toast } from "@/lib/toast"

import Header from "@/components/Header"
import { t } from "@/i18n"
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
  operations: Record<string, RoomOperation>

  onPlay: (id: string) => void
  onStop: (id: string) => void
  onPause: (id: string) => void

  playSyncLine: () => void
  stopSyncLine: () => void

  onVolumeChange: (id: string, vol: number) => void

  onAddRoom: (data: {
    name: string
    audioFileId: string | null
    volume: number
  }) => void

  onUpdateRoom: (
    id: string,
    patch: {
      name: string
      audioFileId: string | null
      volume: number
    },
  ) => void

  onDeleteRoom: (id: string) => void
  onDuplicateRoom: (id: string) => void
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

  const displayRooms = rooms.map((room, index) => ({
    room,
    displayNumber: index + 1,
  }))

  const filtered = displayRooms.filter(({ room }) => {
    const matchFilter =
      filter === "all" ||
      room.status === filter

    const normalizedQuery =
      query.toLowerCase()

    const matchQuery =
      !query ||
      room.name
        .toLowerCase()
        .includes(normalizedQuery)

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

      toast.success(t("rooms.notifications.saved"), {
        description: t("rooms.notifications.savedDescription", {
          name: editingRoom.name,
        }),
      })
    } else {
      onAddRoom(data)

      toast.success(t("rooms.notifications.created"), {
        description: t("rooms.notifications.createdDescription", {
          name: data.name,
        }),
      })
    }

    setDialogOpen(false)
    setEditingRoom(null)
  }

  const handleDelete = (room: Room) => {
    confirmation.confirm({
      title: t("rooms.confirmDelete.title"),
      description: t("rooms.confirmDelete.description", {
        name: room.name,
      }),
      confirmLabel: t("common.delete"),
      cancelLabel: t("common.cancel"),
      variant: "destructive",

      onConfirm: async () => {
        onDeleteRoom(room.id)

        toast.success(t("rooms.notifications.deleted"), {
          description: t("rooms.notifications.deletedDescription", {
            name: room.name,
          }),
        })
      },
    })
  }

  const handleDuplicate = (room: Room) => {
    onDuplicateRoom(room.id)

    toast.success(t("rooms.notifications.duplicated"), {
      description: t("rooms.notifications.duplicatedDescription", {
        name: room.name,
      }),
    })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Header
        title={t("pages.rooms.title")}
        subtitle={t("pages.rooms.subtitle")}
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
            {filtered.map(({ room, displayNumber }) => (
              <RoomCard
                key={room.id}
                room={room}
                displayNumber={displayNumber}
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
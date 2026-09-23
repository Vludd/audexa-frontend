import { useState } from "react"

import type { Room, RoomStatus } from "@/types"
import Header from "@/components/Header"

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
  onPlay: (id: number) => void
  onStop: (id: number) => void
  onPause: (id: number) => void
  onVolumeChange: (id: number, vol: number) => void
}

export default function Rooms({
  rooms,
  syncLine,
  onPlay,
  onStop,
  onPause,
  onVolumeChange,
}: Props) {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<RoomFilter>("all")
  const [viewGrid, setViewGrid] = useState(true)

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
                onPlay={onPlay}
                onStop={onStop}
                onPause={onPause}
                onVolumeChange={onVolumeChange}
              />
            ))}
          </div>
        ) : (
          <RoomTable
            rooms={filtered}
            onPlay={onPlay}
            onStop={onStop}
            onPause={onPause}
          />
        )}

        <SyncLineCard
          room={syncLine}
          onPlay={onPlay}
          onStop={onStop}
        />
      </main>
    </div>
  )
}
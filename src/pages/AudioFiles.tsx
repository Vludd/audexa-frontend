import { useState } from "react"

import type { AudioFile } from "@/types"
import Header from "@/components/Header"
import AudioToolbar from "@/components/audio/AudioToolbar"
import AudioTable from "@/components/audio/AudioTable"

interface Props {
  files: AudioFile[]
}

export default function AudioFiles({ files }: Props) {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<number | null>(null)

  const filtered = files.filter((file) => {
    if (!query) return true

    const normalizedQuery = query.toLowerCase()

    return (
      file.name.toLowerCase().includes(normalizedQuery) ||
      file.filename.toLowerCase().includes(normalizedQuery)
    )
  })

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Header
        title="Аудиофайлы"
        subtitle="Управление звуковыми файлами системы"
      />

      <AudioToolbar
        query={query}
        onQueryChange={setQuery}
        onAdd={() => {}}
        onImport={() => {}}
      />

      <div className="min-h-0 flex-1 overflow-auto p-5">
        <AudioTable
          files={filtered}
          selected={selected}
          onSelect={setSelected}
        />

        <div className="mt-3 text-xs text-muted-foreground">
          Файлов: {filtered.length} из {files.length}
        </div>
      </div>
    </div>
  )
}
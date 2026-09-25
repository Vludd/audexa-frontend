import {
  Plus,
  Search,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Props {
  query: string
  onQueryChange: (value: string) => void
  onAdd: () => void

  selectedCount: number
  onDeleteSelected: () => void
}

export default function AudioToolbar({
  query,
  onQueryChange,
  onAdd,
  selectedCount,
  onDeleteSelected,
}: Props) {
  return (
    <div className="flex items-center gap-2 border-b bg-card px-4 py-2">
      <Button onClick={onAdd}>
        <Plus className="size-4" />
        Добавить файл
      </Button>

      {selectedCount > 0 && (
        <Button
          variant="destructive"
          onClick={onDeleteSelected}
        >
          <Trash2 className="size-4" />
          Удалить выбранные
          <span className="ml-1 rounded bg-white/15 px-1.5 py-0.5 text-xs">
            {selectedCount}
          </span>
        </Button>
      )}

      <div className="flex-1" />

      <div className="relative w-56">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={query}
          onChange={(event) =>
            onQueryChange(event.target.value)
          }
          placeholder="Поиск файлов..."
          className="pl-8"
        />
      </div>
    </div>
  )
}
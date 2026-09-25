import {
  LayoutGrid,
  List,
  Plus,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Props {
  query: string
  viewGrid: boolean
  onQueryChange: (value: string) => void
  onViewChange: (grid: boolean) => void
  onAddRoom: () => void
}

export default function RoomToolbar({
  query,
  viewGrid,
  onQueryChange,
  onViewChange,
  onAddRoom,
}: Props) {
  return (
    <div className="mb-4 flex items-center gap-3">
      

      <Button type="button" onClick={onAddRoom}>
        <Plus className="size-4" />
        Добавить комнату
      </Button>

      <div className="flex-1" />
      
      <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
        <Button
          type="button"
          size="icon"
          variant={viewGrid ? "secondary" : "ghost"}
          className="size-8"
          onClick={() => onViewChange(true)}
          aria-label="Показать сетку"
        >
          <LayoutGrid className="size-4" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant={!viewGrid ? "secondary" : "ghost"}
          className="size-8"
          onClick={() => onViewChange(false)}
          aria-label="Показать список"
        >
          <List className="size-4" />
        </Button>
      </div>


      <div className="relative w-full max-w-[280px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Поиск комнаты..."
          className="pl-9"
        />
      </div>
    </div>
  )
}

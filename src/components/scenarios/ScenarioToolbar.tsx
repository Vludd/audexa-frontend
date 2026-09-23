import { Edit2, Plus, Search, Trash2, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Props {
  query: string
  onQueryChange: (value: string) => void
}

export default function ScenarioToolbar({
  query,
  onQueryChange,
}: Props) {
  return (
    <div className="flex items-center gap-2 border-b bg-card px-5 py-3">
      <Button type="button" variant="default" size="sm">
        <Plus className="size-3.5" />
        Создать сценарий
      </Button>

      <Button type="button" variant="outline" size="sm">
        <Copy className="size-3.5" />
        Дублировать
      </Button>

      <Button type="button" variant="outline" size="sm">
        <Edit2 className="size-3.5" />
        Редактировать
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="size-3.5" />
        Удалить
      </Button>

      <div className="flex-1" />

      <div className="relative w-[220px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Поиск сценариев..."
          className="h-8 pl-9 text-xs"
        />
      </div>
    </div>
  )
}
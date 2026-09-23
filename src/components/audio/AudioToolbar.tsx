import { Plus, Upload, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Props {
  query: string
  onQueryChange: (value: string) => void
  onAdd: () => void
  onImport: () => void
}

export default function AudioToolbar({
  query,
  onQueryChange,
  onAdd,
  onImport,
}: Props) {
  return (
    <div className="flex items-center gap-2 border-b bg-card px-4 py-2">
      <Button onClick={onAdd}>
        <Plus className="size-4" />
        Добавить файл
      </Button>

      <Button variant="outline" onClick={onImport}>
        <Upload className="size-4" />
        Импортировать
      </Button>

      <div className="flex-1" />

      <div className="relative w-56">
        <Search className="text-muted-foreground pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2" />

        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Поиск файлов..."
          className="pl-8"
        />
      </div>
    </div>
  )
}
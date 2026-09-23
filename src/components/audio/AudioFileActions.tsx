import { Pencil, Play, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  onPlay?: () => void
  onRename?: () => void
  onDelete?: () => void
}

export default function AudioFileActions({
  onPlay,
  onRename,
  onDelete,
}: Props) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-xs"
        title="Прослушать"
        className="text-emerald-600 hover:text-emerald-700"
        onClick={(e) => {
          e.stopPropagation()
          onPlay?.()
        }}
      >
        <Play className="size-3.5" />
      </Button>

      <Button
        variant="ghost"
        size="icon-xs"
        title="Переименовать"
        className="text-primary hover:text-primary"
        onClick={(e) => {
          e.stopPropagation()
          onRename?.()
        }}
      >
        <Pencil className="size-3.5" />
      </Button>

      <Button
        variant="ghost"
        size="icon-xs"
        title="Удалить"
        className="text-destructive hover:text-destructive"
        onClick={(e) => {
          e.stopPropagation()
          onDelete?.()
        }}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  )
}
import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"

interface Props {
  onRename?: () => void
  onDelete?: () => void
}

export default function AudioFileActions({
  onRename,
  onDelete,
}: Props) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon-xs"
        title="Переименовать"
        className="text-primary hover:text-primary"
        onClick={(event) => {
          event.stopPropagation()
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
        onClick={(event) => {
          event.stopPropagation()
          onDelete?.()
        }}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  )
}
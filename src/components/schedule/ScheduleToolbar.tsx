import {
  Calendar,
  Copy,
  Edit2,
  Plus,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { t } from "@/i18n"

interface Props {
  selectedDate: string
  hasSelection: boolean
  onAdd: () => void
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
}

export default function ScheduleToolbar({
  selectedDate,
  hasSelection,
  onAdd,
  onEdit,
  onDelete,
  onDuplicate,
}: Props) {
  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b bg-card px-4 py-2">
      <Button
        type="button"
        size="sm"
        onClick={onAdd}
      >
        <Plus className="size-3.5" />
        {t("schedule.toolbar.add")}
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={!hasSelection}
        onClick={onEdit}
      >
        <Edit2 className="size-3.5" />
        {t("common.edit")}
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={!hasSelection}
        className="text-destructive hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 className="size-3.5" />
        {t("common.delete")}
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={!hasSelection}
        onClick={onDuplicate}
      >
        <Copy className="size-3.5" />
        {t("common.duplicate")}
      </Button>

      <div className="ml-auto flex-1" />

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="font-normal"
      >
        <Calendar className="size-3.5 text-primary" />
        {selectedDate}
      </Button>
    </div>
  )
}
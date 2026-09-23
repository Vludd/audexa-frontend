import {
  Calendar,
  Copy,
  Edit2,
  Plus,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"

interface Props {
  selectedDate: string
  onAdd: () => void
}

export default function ScheduleToolbar({
  selectedDate,
  onAdd,
}: Props) {
  return (
    <div className="flex items-center gap-2 border-b bg-card px-5 py-3">
      <Button
        type="button"
        size="sm"
        onClick={onAdd}
      >
        <Plus className="size-3.5" />
        Добавить расписание
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
      >
        <Edit2 className="size-3.5" />
        Редактировать
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="size-3.5" />
        Удалить
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
      >
        <Copy className="size-3.5" />
        Дублировать
      </Button>

      <div className="flex-1" />

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
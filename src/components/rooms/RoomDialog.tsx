import { useEffect, useState } from "react"
import { Plus, Save, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Room } from "@/types"

interface Props {
  open: boolean
  room?: Room | null
  onOpenChange: (open: boolean) => void
  onSave: (data: { name: string; file: string; volume: number }) => void
  onDelete?: () => void
}

export default function RoomDialog({
  open,
  room,
  onOpenChange,
  onSave,
  onDelete,
}: Props) {
  const isEditing = Boolean(room)

  const [name, setName] = useState("")
  const [file, setFile] = useState("")
  const [volume, setVolume] = useState("100")

  useEffect(() => {
    if (!open) return

    setName(room?.name ?? "")
    setFile(room?.file ?? "")
    setVolume(String(room?.volume ?? 100))
  }, [open, room])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedName = name.trim()
    if (!normalizedName) return

    const normalizedVolume = Math.min(
      100,
      Math.max(0, Number(volume) || 0),
    )

    onSave({
      name: normalizedName,
      file: file.trim(),
      volume: normalizedVolume,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Редактирование комнаты" : "Новая комната"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? `Изменение параметров комнаты ${String(room?.id).padStart(2, "0")}.`
                : "Добавьте новую аудиолинию комнаты."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <label className="grid gap-1.5">
              <span className="text-sm font-medium">Название</span>
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Например, Большой зал"
                autoFocus
              />
            </label>

            <label className="grid gap-1.5">
              <span className="text-sm font-medium">Аудиофайл</span>
              <Input
                value={file}
                onChange={(event) => setFile(event.target.value)}
                placeholder="audio/room-01.wav"
              />
            </label>

            <label className="grid gap-1.5" hidden>
              <span className="text-sm font-medium">Громкость</span>
              <Input
                type="number"
                min={0}
                max={100}
                value={volume}
                onChange={(event) => setVolume(event.target.value)}
              />
            </label>
          </div>

          <DialogFooter className="sm:justify-between">
            {isEditing && onDelete ? (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
              >
                <Trash2 className="size-4" />
                Удалить
              </Button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Отмена
              </Button>
              <Button type="submit">
                {isEditing ? (
                  <Save className="size-4" />
                ) : (
                  <Plus className="size-4" />
                )}
                {isEditing ? "Сохранить" : "Добавить"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

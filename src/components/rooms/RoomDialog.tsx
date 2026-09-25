import { useEffect, useState } from "react"
import { Plus, Save } from "lucide-react"

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

export interface RoomFormData {
  name: string
  file: string
  volume: number
}

interface Props {
  open: boolean
  room?: Room | null

  onOpenChange: (open: boolean) => void
  onSave: (data: RoomFormData) => void
}

export default function RoomDialog({
  open,
  room,
  onOpenChange,
  onSave,
}: Props) {
  const isEditing = Boolean(room)

  const [name, setName] = useState("")
  const [file, setFile] = useState("")
  const [volume, setVolume] = useState("100")

  const [nameError, setNameError] = useState("")

  useEffect(() => {
    if (!open) {
      return
    }

    setName(room?.name ?? "")
    setFile(room?.file ?? "")
    setVolume(String(room?.volume ?? 100))
    setNameError("")
  }, [open, room])

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const normalizedName = name.trim()

    if (!normalizedName) {
      setNameError("Введите название комнаты")
      return
    }

    setNameError("")

    const parsedVolume = Number(volume)

    const normalizedVolume = Number.isFinite(parsedVolume)
      ? Math.min(100, Math.max(0, parsedVolume))
      : 100

    onSave({
      name: normalizedName,
      file: file.trim(),
      volume: normalizedVolume,
    })
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setNameError("")
    }

    onOpenChange(nextOpen)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing
                ? "Редактирование комнаты"
                : "Новая комната"}
            </DialogTitle>

            <DialogDescription>
              {isEditing
                ? `Изменение параметров комнаты ${String(
                    room?.id,
                  ).padStart(2, "0")}.`
                : "Добавьте новую аудиолинию комнаты."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <label
                htmlFor="room-name"
                className="text-sm font-medium"
              >
                Название
              </label>

              <Input
                id="room-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value)

                  if (nameError) {
                    setNameError("")
                  }
                }}
                placeholder="Например, Большой зал"
                autoFocus
                aria-invalid={Boolean(nameError)}
              />

              {nameError && (
                <p className="text-xs text-destructive">
                  {nameError}
                </p>
              )}
            </div>

            <div className="grid gap-1.5">
              <label
                htmlFor="room-file"
                className="text-sm font-medium"
              >
                Аудиофайл
              </label>

              <Input
                id="room-file"
                value={file}
                onChange={(event) =>
                  setFile(event.target.value)
                }
                placeholder="audio/room-01.wav"
              />

              <p className="text-xs text-muted-foreground">
                Позже это поле будет заменено селектором
                Audio Library.
              </p>
            </div>

            <div className="grid gap-1.5">
              <label
                htmlFor="room-volume"
                className="text-sm font-medium"
              >
                Громкость
              </label>

              <div className="flex items-center gap-3">
                <Input
                  id="room-volume"
                  type="number"
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(event) =>
                    setVolume(event.target.value)
                  }
                  className="w-24"
                />

                <span className="text-sm text-muted-foreground">
                  %
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Отмена
            </Button>

            <Button type="submit">
              {isEditing ? (
                <Save className="size-4" />
              ) : (
                <Plus className="size-4" />
              )}

              {isEditing
                ? "Сохранить"
                : "Добавить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
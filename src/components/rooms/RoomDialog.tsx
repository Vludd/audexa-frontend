import { useState } from "react"
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
import { t } from "@/i18n"

export interface RoomFormData {
  name: string
  audioFileId: string | null
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
  const [audioFileId, setAudioFileId] = useState("")
  const [volume, setVolume] = useState("100")

  const [nameError, setNameError] = useState("")

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setNameError("")
      onOpenChange(false)
      return
    }

    setName(room?.name ?? "")
    setAudioFileId(room?.audioFileId ?? "")
    setVolume(String(room?.volume ?? 100))
    setNameError("")

    onOpenChange(true)
  }

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const normalizedName = name.trim()

    if (!normalizedName) {
      setNameError(t("rooms.dialog.nameRequired"))
      return
    }

    setNameError("")

    const parsedVolume = Number(volume)

    const normalizedVolume = Number.isFinite(parsedVolume)
      ? Math.min(100, Math.max(0, parsedVolume))
      : 100

    onSave({
      name: normalizedName,
      audioFileId: audioFileId.trim() || null,
      volume: normalizedVolume,
    })
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
                ? t("rooms.dialog.editTitle")
                : t("rooms.dialog.createTitle")}
            </DialogTitle>

            <DialogDescription>
              {isEditing
                ? t("rooms.dialog.editDescription", {
                    id: String(room?.id).padStart(2, "0"),
                  })
                : t("rooms.dialog.createDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <label
                htmlFor="room-name"
                className="text-sm font-medium"
              >
                {t("rooms.dialog.name")}
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
                placeholder={t("rooms.dialog.namePlaceholder")}
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
                htmlFor="room-audio-file"
                className="text-sm font-medium"
              >
                {t("rooms.dialog.audioFile")}
              </label>

              <Input
                id="room-audio-file"
                value={audioFileId}
                onChange={(event) =>
                  setAudioFileId(event.target.value)
                }
                placeholder="audio-01"
              />

              <p className="text-xs text-muted-foreground">
                {t("rooms.dialog.audioFileHelp")}
              </p>
            </div>

            <div className="grid gap-1.5">
              <label
                htmlFor="room-volume"
                className="text-sm font-medium"
              >
                {t("rooms.dialog.volume")}
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
              {t("common.cancel")}
            </Button>

            <Button type="submit">
              {isEditing ? (
                <Save className="size-4" />
              ) : (
                <Plus className="size-4" />
              )}

              {isEditing
                ? t("common.save")
                : t("common.add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
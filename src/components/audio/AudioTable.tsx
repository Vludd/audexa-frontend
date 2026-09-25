import { Pause, Play } from "lucide-react"

import type { AudioFile } from "@/types"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import AudioFileActions from "./AudioFileActions"

interface Props {
  files: AudioFile[]
  selected: number | null
  selectedIds: number[]
  currentFileId: number | null
  isPlaying: boolean

  onSelect: (id: number) => void
  onToggleSelection: (id: number) => void
  onToggleSelectAll: () => void
  onTogglePlay: (id: number) => void
  onRename: (id: number) => void
  onDelete: (id: number) => void
}

function fmtDur(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const sec = seconds % 60

  return `${String(minutes).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

function fmtSize(bytes: number) {
  if (!bytes) return "—"

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function AudioTable({
  files,
  selected,
  selectedIds,
  currentFileId,
  isPlaying,
  onSelect,
  onToggleSelection,
  onToggleSelectAll,
  onTogglePlay,
  onRename,
  onDelete,
}: Props) {
  const allSelected =
    files.length > 0 &&
    files.every((file) =>
      selectedIds.includes(file.id),
    )

  const someSelected =
    files.some((file) =>
      selectedIds.includes(file.id),
    ) && !allSelected

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      {files.length > 0 ? (<Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-10 px-3">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={onToggleSelectAll}
                aria-label="Выбрать все файлы"
              />
            </TableHead>

            <TableHead className="w-12" />

            <TableHead>Название</TableHead>
            <TableHead>Файл</TableHead>
            <TableHead>Формат</TableHead>
            <TableHead>Частота</TableHead>
            <TableHead>Длительность</TableHead>
            <TableHead>Размер</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {files.map((file) => {
            const isCurrent =
              currentFileId === file.id

            const isChecked =
              selectedIds.includes(file.id)

            return (
              <TableRow
                key={file.id}
                data-state={
                  selected === file.id
                    ? "selected"
                    : undefined
                }
                className="cursor-pointer"
                onClick={() => onSelect(file.id)}
              >
                <TableCell
                  className="w-10 px-3"
                  onClick={(event) => {
                    event.stopPropagation()
                  }}
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() =>
                      onToggleSelection(file.id)
                    }
                    aria-label={`Выбрать ${file.name}`}
                  />
                </TableCell>

                <TableCell className="pr-0">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="size-7 rounded-full"
                    title={
                      isCurrent && isPlaying
                        ? "Пауза"
                        : "Воспроизвести"
                    }
                    onClick={(event) => {
                      event.stopPropagation()
                      onTogglePlay(file.id)
                    }}
                  >
                    {isCurrent && isPlaying ? (
                      <Pause className="size-3.5" />
                    ) : (
                      <Play className="size-3.5" />
                    )}
                  </Button>
                </TableCell>

                <TableCell className="font-medium">
                  {file.name}
                </TableCell>

                <TableCell className="font-mono text-xs text-muted-foreground">
                  {file.filename}
                </TableCell>

                <TableCell>
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {file.format}
                  </span>
                </TableCell>

                <TableCell>
                  {file.sampleRate / 1000} kHz
                </TableCell>

                <TableCell>
                  {file.duration
                    ? fmtDur(file.duration)
                    : "—"}
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {fmtSize(file.size)}
                </TableCell>

                <TableCell>
                  <AudioFileActions
                    onRename={() =>
                      onRename(file.id)
                    }
                    onDelete={() =>
                      onDelete(file.id)
                    }
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>)
      : (
        <div className="flex min-h-16 items-center justify-center text-sm text-muted-foreground">
          Нет доступных аудиофайлов
        </div>
      )}
    </div>
  )
}
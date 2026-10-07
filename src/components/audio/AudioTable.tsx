import { Loader2, Pause, Play } from "lucide-react"

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
  selected: string | null
  selectedIds: string[]
  currentFileId: string | null
  isPlaying: boolean
  isPlayPending: boolean

  onSelect: (id: string) => void
  onToggleSelection: (id: string) => void
  onToggleSelectAll: () => void
  onTogglePlay: (id: string) => void
  onRename: (id: string) => void
  onDelete: (id: string) => void
}

function fmtDur(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "—"
  }

  const minutes = Math.floor(seconds / 60)
  const sec = Math.floor(seconds % 60)

  return `${String(minutes).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

function fmtSize(bytes: number) {
  if (!bytes) {
    return "—"
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function AudioTable({
  files,
  selected,
  selectedIds,
  currentFileId,
  isPlaying,
  isPlayPending,
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
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="w-10 px-3">
              <Checkbox
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={onToggleSelectAll}
                aria-label="Выбрать все файлы"
              />
            </TableHead>

            <TableHead className="w-11" />

            <TableHead className="min-w-56">
              Название
            </TableHead>

            <TableHead className="min-w-64">
              Файл
            </TableHead>

            <TableHead>Формат</TableHead>
            <TableHead>Частота</TableHead>
            <TableHead>Длительность</TableHead>
            <TableHead>Размер</TableHead>

            <TableHead className="w-20" />
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
                className={[
                  "group cursor-pointer transition-colors",
                  isCurrent &&
                    "bg-primary/[0.045] hover:bg-primary/[0.07]",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onSelect(file.id)}
              >
                <TableCell
                  className="w-10 px-3"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() =>
                      onToggleSelection(file.id)
                    }
                    aria-label={`Выбрать ${file.name}`}
                  />
                </TableCell>

                <TableCell
                  className="pr-0"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >
                  <Button
                    variant={
                      isCurrent
                        ? "secondary"
                        : "ghost"
                    }
                    size="icon-sm"
                    className={[
                      "size-7 rounded-full",
                      isCurrent &&
                        "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    title={
                      isCurrent && isPlaying
                        ? "Пауза"
                        : "Воспроизвести"
                    }
                    disabled={
                      isCurrent && isPlayPending
                    }
                    onClick={() =>
                      onTogglePlay(file.id)
                    }
                  >
                    {isCurrent && isPlayPending ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : isCurrent && isPlaying ? (
                      <Pause className="size-3.5" />
                    ) : (
                      <Play className="size-3.5 translate-x-px" />
                    )}
                  </Button>
                </TableCell>

                <TableCell className="max-w-80">
                  <div
                    className={[
                      "truncate font-medium",
                      isCurrent && "text-primary",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    title={file.name}
                  >
                    {file.name}
                  </div>

                  {isCurrent && (
                    <div className="mt-0.5 text-[11px] font-medium text-primary">
                      {isPlaying
                        ? "Сейчас воспроизводится"
                        : isPlayPending
                          ? "Запуск..."
                          : "Выбрано"}
                    </div>
                  )}
                </TableCell>

                <TableCell className="max-w-80">
                  <div
                    className="truncate font-mono text-xs text-muted-foreground"
                    title={file.filename}
                  >
                    {file.filename}
                  </div>
                </TableCell>

                <TableCell>
                  <span className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    {file.format}
                  </span>
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {file.sampleRate / 1000} kHz
                </TableCell>

                <TableCell className="font-mono text-xs">
                  {fmtDur(file.duration)}
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
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
      </Table>
    </div>
  )
}
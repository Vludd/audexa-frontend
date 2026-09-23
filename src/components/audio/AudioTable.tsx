import type { AudioFile } from "@/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AudioFileActions from "./AudioFileActions"

interface Props {
  files: AudioFile[]
  selected: number | null
  onSelect: (id: number) => void
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
  onSelect,
}: Props) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>Название</TableHead>
            <TableHead>Файл</TableHead>
            <TableHead>Формат</TableHead>
            <TableHead>Частота</TableHead>
            <TableHead>Длительность</TableHead>
            <TableHead>Размер</TableHead>
            <TableHead className="w-28" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {files.map((file) => (
            <TableRow
              key={file.id}
              data-state={selected === file.id ? "selected" : undefined}
              className="cursor-pointer"
              onClick={() => onSelect(file.id)}
            >
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
                {file.duration ? fmtDur(file.duration) : "—"}
              </TableCell>

              <TableCell className="text-muted-foreground">
                {fmtSize(file.size)}
              </TableCell>

              <TableCell>
                <AudioFileActions />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
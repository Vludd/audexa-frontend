import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { ScenarioStep } from "@/types"

interface Props {
  steps: ScenarioStep[]
}

function fmtSec(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const sec = seconds % 60

  return `${String(minutes).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

export default function ScenarioStepsTable({ steps }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-12">#</TableHead>
            <TableHead>Комната</TableHead>
            <TableHead>Аудиофайл</TableHead>
            <TableHead>Громкость</TableHead>
            <TableHead>Задержка</TableHead>
            <TableHead>Длительность</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {steps.map((step) => (
            <TableRow key={step.id}>
              <TableCell className="font-semibold text-muted-foreground">
                {step.id}
              </TableCell>

              <TableCell className="font-medium">
                {step.roomName}
              </TableCell>

              <TableCell className="max-w-[280px]">
                <span
                  className="block truncate text-xs text-muted-foreground"
                  title={step.file}
                >
                  {step.file}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-[70px] overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-[width]"
                      style={{ width: `${step.volume}%` }}
                    />
                  </div>

                  <span className="text-xs font-medium">
                    {step.volume}%
                  </span>
                </div>
              </TableCell>

              <TableCell>{step.delay} сек</TableCell>

              <TableCell>
                {fmtSec(step.duration)}
              </TableCell>

              <TableCell>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
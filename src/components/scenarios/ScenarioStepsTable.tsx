import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type {
  AudioFile,
  Room,
  ScenarioStep,
} from "@/types"
import { t } from "@/i18n"

interface Props {
  steps: ScenarioStep[]
  rooms: Room[]
  audioFiles: AudioFile[]

  onUpdateStep: (
    stepId: number,
    patch: Partial<ScenarioStep>,
  ) => void

  onRemoveStep: (stepId: number) => void

  onMoveStep: (
    fromIndex: number,
    toIndex: number,
  ) => void
}

function fmtSec(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const sec = seconds % 60

  return `${String(minutes).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
}

export default function ScenarioStepsTable({
  steps,
  rooms,
  audioFiles,
  onUpdateStep,
  onRemoveStep,
  onMoveStep,
}: Props) {
  const handleRoomChange = (
    step: ScenarioStep,
    roomId: string,
  ) => {
    const room = rooms.find(
      (item) => item.id === roomId,
    )

    onUpdateStep(step.id, {
      roomId,
      roomName: room?.name ?? t("scenarios.editor.notSelected"),
    })
  }

  const handleAudioChange = (
    step: ScenarioStep,
    fileId: string,
  ) => {
    const file = audioFiles.find(
      (item) => item.id === fileId,
    )

    onUpdateStep(step.id, {
      file: file?.name ?? "",
      duration: file?.duration ?? 0,
    })
  }

  if (steps.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-card p-8 text-center">
        <p className="text-sm font-medium">
          {t("scenarios.steps.emptyTitle")}
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          {t("scenarios.steps.emptyDescription")}
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-10" />
            <TableHead className="w-10">#</TableHead>
            <TableHead>{t("scenarios.steps.room")}</TableHead>
            <TableHead>{t("scenarios.steps.audioFile")}</TableHead>
            <TableHead className="w-[150px]">
              {t("scenarios.steps.volume")}
            </TableHead>
            <TableHead className="w-[100px]">
              {t("scenarios.steps.delay")}
            </TableHead>
            <TableHead className="w-[100px]">
              {t("scenarios.steps.duration")}
            </TableHead>
            <TableHead className="w-[90px]" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {steps.map((step, index) => (
            <TableRow
              key={step.id}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData(
                  "text/plain",
                  String(index),
                )
              }}
              onDragOver={(event) => {
                event.preventDefault()
              }}
              onDrop={(event) => {
                event.preventDefault()

                const fromIndex = Number(
                  event.dataTransfer.getData("text/plain"),
                )

                if (
                  Number.isInteger(fromIndex) &&
                  fromIndex !== index
                ) {
                  onMoveStep(fromIndex, index)
                }
              }}
              className="group"
            >
              <TableCell>
                <GripVertical className="size-4 cursor-grab text-muted-foreground/50" />
              </TableCell>

              <TableCell className="font-semibold text-muted-foreground">
                {index + 1}
              </TableCell>

              <TableCell>
                <select
                  value={step.roomId}
                  onChange={(event) =>
                    handleRoomChange(
                      step,
                      event.target.value,
                    )
                  }
                  className="h-8 w-full min-w-[150px] rounded-md border bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">
                    {t("scenarios.steps.chooseRoom")}
                  </option>

                  {rooms.map((room) => (
                    <option
                      key={room.id}
                      value={room.id}
                    >
                      {room.name}
                    </option>
                  ))}
                </select>
              </TableCell>

              <TableCell>
                <select
                  value={
                    audioFiles.find(
                      (file) => file.name === step.file,
                    )?.id ?? ""
                  }
                  onChange={(event) =>
                    handleAudioChange(
                      step,
                      event.target.value,
                    )
                  }
                  className="h-8 w-full min-w-[180px] rounded-md border bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">
                    {t("scenarios.steps.chooseAudioFile")}
                  </option>

                  {audioFiles.map((file) => (
                    <option
                      key={file.id}
                      value={file.id}
                    >
                      {file.name}
                    </option>
                  ))}
                </select>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={step.volume}
                    onChange={(event) =>
                      onUpdateStep(step.id, {
                        volume: Number(
                          event.target.value,
                        ),
                      })
                    }
                    className="w-[80px]"
                  />

                  <span className="w-9 text-right text-xs font-medium">
                    {step.volume}%
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <Input
                  type="number"
                  min={0}
                  value={step.delay}
                  onChange={(event) =>
                    onUpdateStep(step.id, {
                      delay: Math.max(
                        0,
                        Number(event.target.value),
                      ),
                    })
                  }
                  className="h-8 text-xs"
                />
              </TableCell>

              <TableCell className="text-xs text-muted-foreground">
                {fmtSec(step.duration)}
              </TableCell>

              <TableCell>
                <div className="flex items-center justify-end gap-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    disabled={index === 0}
                    onClick={() =>
                      onMoveStep(index, index - 1)
                    }
                  >
                    <ChevronUp className="size-3.5" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    disabled={index === steps.length - 1}
                    onClick={() =>
                      onMoveStep(index, index + 1)
                    }
                  >
                    <ChevronDown className="size-3.5" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-destructive hover:text-destructive"
                    onClick={() =>
                      onRemoveStep(step.id)
                    }
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
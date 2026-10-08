import { useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Check,
  CircleAlert,
  Play,
  RotateCcw,
  Save,
} from "lucide-react"
import { t } from "@/i18n"

type Room = {
  id: string
  number: number
  name: string
}

type Output = {
  id: string
  name: string
}

type Mapping = {
  roomId: string
  outputId: string | null
}

const rooms: Room[] = Array.from({ length: 30 }, (_, index) => ({
  id: `room-${index + 1}`,
  number: index + 1,
  name: `${t("settings.lineMapping.room")} ${String(index + 1).padStart(2, "0")}`,
}))

const outputs: Output[] = Array.from({ length: 31 }, (_, index) => ({
  id: `out-${index + 1}`,
  name: `OUT ${String(index + 1).padStart(2, "0")}`,
}))

const initialMappings: Mapping[] = rooms.map((room) => ({
  roomId: room.id,
  outputId: `out-${room.number}`,
}))

const translationMapping: Mapping = {
  roomId: "translation",
  outputId: "out-31",
}

export default function LineMappingSettings() {
  const [mappings, setMappings] = useState<Mapping[]>(
    initialMappings,
  )

  const [savedMappings, setSavedMappings] =
    useState<Mapping[]>(initialMappings)

  const [translationOutput, setTranslationOutput] = useState<
    string | null
  >(translationMapping.outputId)

  const [isTesting, setIsTesting] = useState<string | null>(null)

  /*
   * ------------------------------------------------------------------
   * Derived state
   * ------------------------------------------------------------------
   */

  const roomById = useMemo(
    () => new Map(rooms.map((room) => [room.id, room])),
    [],
  )

  const outputById = useMemo(
    () => new Map(outputs.map((output) => [output.id, output])),
    [],
  )

  const mappingByRoomId = useMemo(
    () => new Map(mappings.map((mapping) => [mapping.roomId, mapping])),
    [mappings],
  )

  const assignedOutputs = useMemo(() => {
    const map = new Map<string, string>()

    mappings.forEach((mapping) => {
      if (mapping.outputId) {
        map.set(mapping.outputId, mapping.roomId)
      }
    })

    return map
  }, [mappings])

  const translationOutputOwner = useMemo(() => {
    if (!translationOutput) {
      return null
    }

    return assignedOutputs.get(translationOutput) ?? null
  }, [assignedOutputs, translationOutput])

  const conflictCount = useMemo(() => {
    const usage = new Map<string, number>()

    mappings.forEach((mapping) => {
      if (!mapping.outputId) {
        return
      }

      usage.set(
        mapping.outputId,
        (usage.get(mapping.outputId) ?? 0) + 1,
      )
    })

    if (translationOutput) {
      usage.set(
        translationOutput,
        (usage.get(translationOutput) ?? 0) + 1,
      )
    }

    return [...usage.values()].filter((count) => count > 1).length
  }, [mappings, translationOutput])

  const unassignedCount = useMemo(
    () =>
      mappings.filter((mapping) => !mapping.outputId).length,
    [mappings],
  )

  const assignedCount = mappings.length - unassignedCount

  const freeOutputCount =
    outputs.length - assignedOutputs.size

  const isDirty =
    JSON.stringify(mappings) !== JSON.stringify(savedMappings) ||
    translationOutput !== translationMapping.outputId

  /*
   * ------------------------------------------------------------------
   * Actions
   * ------------------------------------------------------------------
   */

  const updateMapping = (
    roomId: string,
    outputId: string | null,
  ) => {
    setMappings((current) =>
      current.map((mapping) =>
        mapping.roomId === roomId
          ? {
              ...mapping,
              outputId,
            }
          : mapping,
      ),
    )
  }

  const handleTest = async (outputId: string) => {
    if (isTesting) {
      return
    }

    setIsTesting(outputId)

    await new Promise((resolve) =>
      setTimeout(resolve, 1000),
    )

    setIsTesting(null)
  }

  const handleReset = () => {
    setMappings(savedMappings)
    setTranslationOutput(translationMapping.outputId)
  }

  const handleSave = () => {
    if (conflictCount > 0) {
      return
    }

    setSavedMappings(mappings)

    // TODO:
    // Отправить mappings + translationOutput на backend.
  }

  /*
   * ------------------------------------------------------------------
   * Output selector
   * ------------------------------------------------------------------
   */

  const renderOutputSelect = (
    roomId: string,
    value: string | null,
  ) => {
    return (
      <Select
        value={value ?? ""}
        onValueChange={(outputId) =>
          updateMapping(roomId, outputId)
        }
      >
        <SelectTrigger className="h-8 w-full border-0 bg-transparent px-2 shadow-none hover:bg-muted focus:ring-0">
          <SelectValue placeholder={t("common.notAssigned")} />
        </SelectTrigger>

        <SelectContent>
          {outputs.map((output) => {
            const owner = assignedOutputs.get(output.id)
            const isOccupied =
              owner !== undefined && owner !== roomId

            const ownerRoom = owner
              ? roomById.get(owner)
              : undefined

            return (
              <SelectItem
                key={output.id}
                value={output.id}
                disabled={isOccupied}
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span>{output.name}</span>

                  {isOccupied && ownerRoom && (
                    <span className="truncate text-xs text-muted-foreground">
                      · {ownerRoom.name}
                    </span>
                  )}
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    )
  }

  /*
   * ------------------------------------------------------------------
   * Render
   * ------------------------------------------------------------------
   */

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="text-sm">
              {t("settings.lineMapping.title")}
            </CardTitle>

            <CardDescription className="mt-1 text-xs">
              {t("settings.lineMapping.description")}
            </CardDescription>
          </div>

          <Badge
            variant="outline"
            className="shrink-0"
          >
            {t("settings.lineMapping.summary", {
              rooms: rooms.length,
              outputs: outputs.length,
            })}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary */}

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-md border bg-muted/20 px-3 py-2">
            <div className="text-xs text-muted-foreground">
              {t("settings.lineMapping.assigned")}
            </div>

            <div className="mt-1 text-sm font-semibold">
              {assignedCount} / {mappings.length}
            </div>
          </div>

          <div className="rounded-md border bg-muted/20 px-3 py-2">
            <div className="text-xs text-muted-foreground">
              {t("settings.lineMapping.free")}
            </div>

            <div className="mt-1 text-sm font-semibold">
              {freeOutputCount}
            </div>
          </div>

          <div
            className={[
              "rounded-md border px-3 py-2",
              conflictCount > 0
                ? "border-destructive/50 bg-destructive/5"
                : "bg-muted/20",
            ].join(" ")}
          >
            <div className="text-xs text-muted-foreground">
              {t("settings.lineMapping.conflicts")}
            </div>

            <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
              {conflictCount > 0 ? (
                <>
                  <CircleAlert className="size-3.5 text-destructive" />
                  {conflictCount}
                </>
              ) : (
                <>
                  <Check className="size-3.5 text-green-600" />
                  0
                </>
              )}
            </div>
          </div>
        </div>

        {/* Rooms */}

        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("settings.lineMapping.rooms")}
          </div>

          <div className="overflow-hidden rounded-md border">
            {/* Grid header */}

            <div
              className="
                grid
                grid-cols-[48px_minmax(0,1fr)_minmax(150px,220px)_100px_48px]
                items-center
                gap-3
                border-b
                bg-muted/40
                px-3
                py-2
                text-xs
                font-medium
                text-muted-foreground
              "
            >
              <span>#</span>
              <span>{t("settings.lineMapping.room")}</span>
              <span>{t("settings.lineMapping.output")}</span>
              <span>{t("settings.lineMapping.status")}</span>
              <span />
            </div>

            {/* Grid body */}

            <div className="max-h-[360px] overflow-y-auto">
              {rooms.map((room) => {
                const mapping = mappingByRoomId.get(room.id)

                const output = mapping?.outputId
                  ? outputById.get(mapping.outputId)
                  : undefined

                const outputOwner = mapping?.outputId
                  ? assignedOutputs.get(mapping.outputId)
                  : undefined

                const hasConflict =
                  Boolean(outputOwner) &&
                  outputOwner !== room.id

                return (
                  <div
                    key={room.id}
                    className={[
                      "grid",
                      "grid-cols-[48px_minmax(0,1fr)_minmax(150px,220px)_100px_48px]",
                      "items-center",
                      "gap-3",
                      "border-b",
                      "px-3",
                      "py-1.5",
                      "last:border-b-0",
                      "transition-colors",
                      "hover:bg-muted/20",
                      hasConflict
                        ? "bg-destructive/5"
                        : "",
                    ].join(" ")}
                  >
                    {/* Number */}

                    <span className="font-mono text-xs text-muted-foreground">
                      {String(room.number).padStart(2, "0")}
                    </span>

                    {/* Room */}

                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {room.name}
                      </div>

                      <div className="truncate text-[11px] text-muted-foreground">
                        {room.id}
                      </div>
                    </div>

                    {/* Output */}

                    <div className="min-w-0 rounded-md border bg-background">
                      {renderOutputSelect(
                        room.id,
                        mapping?.outputId ?? null,
                      )}
                    </div>

                    {/* Status */}

                    <div>
                      {hasConflict ? (
                        <Badge
                          variant="destructive"
                          className="text-[10px]"
                        >
                          {t("settings.lineMapping.conflict")}
                        </Badge>
                      ) : output ? (
                        <Badge
                          variant="secondary"
                          className="gap-1 text-[10px]"
                        >
                          <Check className="size-3" />
                          OK
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px]"
                        >
                          {t("common.notAssigned")}
                        </Badge>
                      )}
                    </div>

                    {/* Test */}

                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      disabled={
                        !mapping?.outputId ||
                        isTesting === mapping.outputId
                      }
                      onClick={() => {
                        if (mapping?.outputId) {
                          handleTest(mapping.outputId)
                        }
                      }}
                      title={
                        output
                          ? t("settings.lineMapping.testNamedOutput", {
                              name: output.name,
                            })
                          : t("settings.lineMapping.testOutput")
                      }
                      hidden
                    >
                      {isTesting === mapping?.outputId ? (
                        <RotateCcw className="size-3.5 animate-spin" />
                      ) : (
                        <Play className="size-3.5" />
                      )}
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <Separator />

        {/* Special outputs */}

        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("settings.lineMapping.specialLines")}
          </div>

          <div className="overflow-hidden rounded-md border">
            <div
              className="
                grid
                grid-cols-[minmax(0,1fr)_minmax(150px,220px)_100px_48px]
                items-center
                gap-3
                bg-primary/5
                px-3
                py-2
              "
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">
                  {t("settings.lineMapping.translation")}
                </div>

                <div className="truncate text-xs text-muted-foreground">
                  {t("settings.lineMapping.dedicatedOutput")}
                </div>
              </div>

              <div className="min-w-0 rounded-md border bg-background">
                <Select
                  value={translationOutput ?? ""}
                  onValueChange={setTranslationOutput}
                >
                  <SelectTrigger className="h-8 w-full border-0 bg-transparent px-2 shadow-none focus:ring-0">
                    <SelectValue placeholder={t("common.notAssigned")} />
                  </SelectTrigger>

                  <SelectContent>
                    {outputs.map((output) => {
                      const owner = assignedOutputs.get(
                        output.id,
                      )

                      const ownerRoom = owner
                        ? roomById.get(owner)
                        : undefined

                      const occupiedByRoom = Boolean(owner)

                      return (
                        <SelectItem
                          key={output.id}
                          value={output.id}
                          disabled={occupiedByRoom}
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <span>{output.name}</span>

                            {occupiedByRoom &&
                              ownerRoom && (
                                <span className="truncate text-xs text-muted-foreground">
                                  · {ownerRoom.name}
                                </span>
                              )}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                {translationOutputOwner ? (
                  <Badge
                    variant="destructive"
                    className="text-[10px]"
                  >
                    {t("settings.lineMapping.conflict")}
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="gap-1 text-[10px]"
                  >
                    <Check className="size-3" />
                    OK
                  </Badge>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                disabled={
                  !translationOutput ||
                  isTesting === translationOutput
                }
                onClick={() => {
                  if (translationOutput) {
                    handleTest(translationOutput)
                  }
                }}
                title={t("settings.lineMapping.testOutput")}
                hidden
              >
                {isTesting === translationOutput ? (
                  <RotateCcw className="size-3.5 animate-spin" />
                ) : (
                  <Play className="size-3.5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground">
            {isDirty ? (
              <span className="text-foreground">
                {t("settings.lineMapping.unsaved")}
              </span>
            ) : (
              t("settings.lineMapping.saved")
            )}
          </div>

          <div className="flex items-center gap-2">
            {isDirty && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
              >
                {t("common.cancel")}
              </Button>
            )}

            <Button
              size="sm"
              disabled={!isDirty || conflictCount > 0}
              onClick={handleSave}
            >
              <Save className="mr-2 size-3.5" />
              {t("common.save")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
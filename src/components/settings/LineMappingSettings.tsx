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
  Save,
  X,
} from "lucide-react"

import type { AudioDevice } from "@/api/audioDevices"
import type { Room } from "@/types"

import { t } from "@/i18n"

type Mapping = {
  roomId: string
  outputId: string | null
}

interface LineMappingSettingsProps {
  rooms: Room[]
  selectedDevice: AudioDevice | null
}

const EMPTY_OUTPUTS: AudioDevice["outputs"] = []

function createMappings(
  rooms: Room[],
  device: AudioDevice | null,
): Mapping[] {
  return rooms.map((room, index) => ({
    roomId: room.id,
    outputId:
      device?.outputs[index]?.id ?? null,
  }))
}

export default function LineMappingSettings({
  rooms,
  selectedDevice,
}: LineMappingSettingsProps) {
  const outputs =
    selectedDevice?.outputs ?? EMPTY_OUTPUTS

  const [mappings, setMappings] = useState<
    Mapping[]
  >(() => createMappings(rooms, selectedDevice))

  const [savedMappings, setSavedMappings] =
    useState<Mapping[]>(() =>
      createMappings(rooms, selectedDevice),
    )

  const [translationOutput, setTranslationOutput] =
    useState<string | null>(
      () => outputs[30]?.id ?? null,
    )

  const [
    savedTranslationOutput,
    setSavedTranslationOutput,
  ] = useState<string | null>(
    () => outputs[30]?.id ?? null,
  )

  const roomById = useMemo(
    () =>
      new Map(
        rooms.map((room) => [
          room.id,
          room,
        ]),
      ),
    [rooms],
  )

  const outputById = useMemo(
    () =>
      new Map(
        outputs.map((output) => [
          output.id,
          output,
        ]),
      ),
    [outputs],
  )

  const mappingByRoomId = useMemo(
    () =>
      new Map(
        mappings.map((mapping) => [
          mapping.roomId,
          mapping,
        ]),
      ),
    [mappings],
  )

  const assignedOutputs = useMemo(() => {
    const map = new Map<string, string>()

    mappings.forEach((mapping) => {
      if (mapping.outputId) {
        map.set(
          mapping.outputId,
          mapping.roomId,
        )
      }
    })

    return map
  }, [mappings])

  const translationOutputOwner = useMemo(() => {
    if (!translationOutput) {
      return null
    }

    return (
      assignedOutputs.get(
        translationOutput,
      ) ?? null
    )
  }, [
    assignedOutputs,
    translationOutput,
  ])

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

    return [...usage.values()].filter(
      (count) => count > 1,
    ).length
  }, [
    mappings,
    translationOutput,
  ])

  const unassignedCount = useMemo(
    () =>
      mappings.filter(
        (mapping) => !mapping.outputId,
      ).length,
    [mappings],
  )

  const assignedCount =
    mappings.length - unassignedCount

  const freeOutputCount =
    outputs.length -
    assignedOutputs.size -
    (translationOutput &&
    !assignedOutputs.has(translationOutput)
      ? 1
      : 0)

  const isDirty =
    JSON.stringify(mappings) !==
      JSON.stringify(savedMappings) ||
    translationOutput !==
      savedTranslationOutput

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

  const handleReset = () => {
    setMappings(savedMappings)
    setTranslationOutput(
      savedTranslationOutput,
    )
  }

  const handleSave = () => {
    if (conflictCount > 0) {
      return
    }

    setSavedMappings(mappings)
    setSavedTranslationOutput(
      translationOutput,
    )

    /*
     * TODO:
     * Send mappings + translationOutput
     * to backend.
     */
  }

  const renderOutputSelect = (
    roomId: string,
    value: string | null,
  ) => {
    return (
      <Select
        value={value ?? ""}
        onValueChange={(outputId) =>
          updateMapping(
            roomId,
            outputId,
          )
        }
      >
        <SelectTrigger className="h-8 w-full border-0 bg-transparent px-2 shadow-none hover:bg-muted focus:ring-0">
          <SelectValue
            placeholder={t(
              "common.notAssigned",
            )}
          >
            {value
              ? outputById.get(value)?.name ??
                t("common.notAssigned")
              : t("common.notAssigned")}
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          {outputs.map((output) => {
            const owner =
              assignedOutputs.get(
                output.id,
              )

            const isOccupied =
              owner !== undefined &&
              owner !== roomId

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
                  <span>
                    {output.name}
                  </span>

                  {isOccupied &&
                    ownerRoom && (
                      <span className="truncate text-xs text-muted-foreground">
                        ·{" "}
                        {ownerRoom.name}
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="text-sm">
              {t(
                "settings.lineMapping.title",
              )}
            </CardTitle>

            <CardDescription className="mt-1 text-xs">
              {t(
                "settings.lineMapping.description",
              )}
            </CardDescription>
          </div>

          <Badge
            variant="outline"
            className="shrink-0"
          >
            {t(
              "settings.lineMapping.summary",
              {
                rooms: rooms.length,
                outputs: outputs.length,
              },
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!selectedDevice ? (
          <div className="rounded-md border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
            {t("settings.lineMapping.selectDevice")}
          </div>
        ) : outputs.length === 0 ? (
          <div className="rounded-md border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
            {t("settings.lineMapping.noOutputs")}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="rounded-md border bg-muted/20 px-3 py-2">
                <div className="text-xs text-muted-foreground">
                  {t(
                    "settings.lineMapping.assigned",
                  )}
                </div>

                <div className="mt-1 text-sm font-semibold">
                  {assignedCount} /{" "}
                  {mappings.length}
                </div>
              </div>

              <div className="rounded-md border bg-muted/20 px-3 py-2">
                <div className="text-xs text-muted-foreground">
                  {t(
                    "settings.lineMapping.free",
                  )}
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
                  {t(
                    "settings.lineMapping.conflicts",
                  )}
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

            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t(
                  "settings.lineMapping.rooms",
                )}
              </div>

              <div className="overflow-hidden rounded-md border">
                <div className="grid grid-cols-[48px_minmax(0,1fr)_minmax(150px,220px)_32px_100px] items-center gap-3 border-b bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
                  <span>#</span>
                  <span>
                    {t(
                      "settings.lineMapping.room",
                    )}
                  </span>
                  <span>
                    {t(
                      "settings.lineMapping.output",
                    )}
                  </span>
                  <span />
                  <span>
                    {t(
                      "settings.lineMapping.status",
                    )}
                  </span>
                </div>

                <div className="max-h-[360px] overflow-y-auto">
                  {rooms.map((room, index) => {
                    const mapping =
                      mappingByRoomId.get(
                        room.id,
                      )

                    const output =
                      mapping?.outputId
                        ? outputById.get(
                            mapping.outputId,
                          )
                        : undefined

                    const outputOwner =
                      mapping?.outputId
                        ? assignedOutputs.get(
                            mapping.outputId,
                          )
                        : undefined

                    const hasConflict =
                      Boolean(
                        outputOwner,
                      ) &&
                      outputOwner !==
                        room.id

                    return (
                      <div
                        key={room.id}
                        className={[
                          "grid",
                          "grid-cols-[48px_minmax(0,1fr)_minmax(150px,220px)_32px_100px]",
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
                        <span className="font-mono text-xs text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">
                            {room.name}
                          </div>
                        </div>

                        <div className="min-w-0 rounded-md border bg-background">
                          {renderOutputSelect(
                            room.id,
                            mapping?.outputId ??
                              null,
                          )}
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          disabled={!mapping?.outputId}
                          aria-label={t(
                            "settings.lineMapping.clearOutput",
                            { name: room.name },
                          )}
                          title={t(
                            "settings.lineMapping.clearOutput",
                            { name: room.name },
                          )}
                          onClick={() =>
                            updateMapping(room.id, null)
                          }
                        >
                          <X className="size-3.5" />
                        </Button>

                        <div>
                          {hasConflict ? (
                            <Badge
                              variant="destructive"
                              className="text-[10px]"
                            >
                              {t(
                                "settings.lineMapping.conflict",
                              )}
                            </Badge>
                          ) : output ? (
                            <Badge
                              variant="secondary"
                              className="gap-1 text-[10px]"
                            >
                              <Check className="size-3" />
                              {t("settings.lineMapping.ok")}
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[10px]"
                            >
                              {t(
                                "common.notAssigned",
                              )}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t(
                  "settings.lineMapping.specialLines",
                )}
              </div>

              <div className="overflow-hidden rounded-md border">
                <div className="grid grid-cols-[minmax(0,1fr)_minmax(150px,220px)_100px] items-center gap-3 bg-primary/5 px-3 py-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {t(
                        "settings.lineMapping.translation",
                      )}
                    </div>

                    <div className="truncate text-xs text-muted-foreground">
                      {t(
                        "settings.lineMapping.dedicatedOutput",
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 rounded-md border bg-background">
                    <Select
                      value={
                        translationOutput ??
                        ""
                      }
                      onValueChange={
                        setTranslationOutput
                      }
                    >
                      <SelectTrigger className="h-8 w-full border-0 bg-transparent px-2 shadow-none focus:ring-0">
                        <SelectValue
                          placeholder={t(
                            "common.notAssigned",
                          )}
                        >
                          {translationOutput
                            ? outputById.get(
                                translationOutput,
                              )?.name ??
                              t("common.notAssigned")
                            : t("common.notAssigned")}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        {outputs.map(
                          (output) => {
                            const owner =
                              assignedOutputs.get(
                                output.id,
                              )

                            const ownerRoom =
                              owner
                                ? roomById.get(
                                    owner,
                                  )
                                : undefined

                            return (
                              <SelectItem
                                key={output.id}
                                value={
                                  output.id
                                }
                                disabled={Boolean(
                                  owner,
                                )}
                              >
                                <div className="flex min-w-0 items-center gap-2">
                                  <span>
                                    {
                                      output.name
                                    }
                                  </span>

                                  {ownerRoom && (
                                    <span className="truncate text-xs text-muted-foreground">
                                      ·{" "}
                                      {
                                        ownerRoom.name
                                      }
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            )
                          },
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    {translationOutputOwner ? (
                      <Badge
                        variant="destructive"
                        className="text-[10px]"
                      >
                        {t(
                          "settings.lineMapping.conflict",
                        )}
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="gap-1 text-[10px]"
                      >
                        <Check className="size-3" />
                        {t("settings.lineMapping.ok")}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-muted-foreground">
                {isDirty ? (
                  <span className="text-foreground">
                    {t(
                      "settings.lineMapping.unsaved",
                    )}
                  </span>
                ) : (
                  t(
                    "settings.lineMapping.saved",
                  )
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
                  disabled={
                    !isDirty ||
                    conflictCount > 0
                  }
                  onClick={handleSave}
                >
                  <Save className="mr-2 size-3.5" />
                  {t("common.save")}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
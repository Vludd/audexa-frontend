import { useMemo, useState } from "react"
import { Check, CircleAlert, LoaderCircle, Play, Square } from "lucide-react"

import type { AudioDevice } from "@/api/audioDevices"
import { audioDiagnosticsApi, type AudioTestMode } from "@/api/audioDiagnostics"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { t } from "@/i18n"
import { toast } from "@/lib/toast"

type TestStatus = "idle" | "testing" | "success" | "error"

interface OutputDiagnosticsProps {
  device: AudioDevice
  outputIds: string[]
}

export default function OutputDiagnostics({
  device,
  outputIds,
}: OutputDiagnosticsProps) {
  const [mode, setMode] = useState<AudioTestMode>("voice")
  const [durationMs, setDurationMs] = useState("800")
  const [volume, setVolume] = useState("0.25")
  const [statuses, setStatuses] = useState<Record<string, TestStatus>>({})
  const [activeOutputId, setActiveOutputId] = useState<string | null>(null)
  const [runningAll, setRunningAll] = useState(false)

  const uniqueOutputIds = useMemo(
    () => [...new Set(outputIds)].filter(Boolean),
    [outputIds],
  )

  const testRequest = {
    deviceId: device.id,
    mode,
    durationMs: Number(durationMs),
    volume: Number(volume),
  }

  const testOutput = async (outputId: string) => {
    setActiveOutputId(outputId)
    setStatuses((current) => ({ ...current, [outputId]: "testing" }))

    try {
      const result = await audioDiagnosticsApi.testOutput({
        ...testRequest,
        outputId,
      })

      setStatuses((current) => ({
        ...current,
        [outputId]: result.ok ? "success" : "error",
      }))

      if (!result.ok) {
        toast.error(t("settings.lineMapping.diagnosticsTestFailed"), {
          description: result.message,
        })
      }
    } catch (error) {
      setStatuses((current) => ({ ...current, [outputId]: "error" }))
      toast.error(t("settings.lineMapping.diagnosticsTestFailed"), {
        description:
          error instanceof Error
            ? error.message
            : t("settings.lineMapping.diagnosticsBackendRequired"),
      })
    } finally {
      setActiveOutputId(null)
    }
  }

  const testAll = async () => {
    if (uniqueOutputIds.length === 0) return

    setRunningAll(true)
    setStatuses(() =>
      Object.fromEntries(uniqueOutputIds.map((id) => [id, "testing"])) as Record<string, TestStatus>,
    )

    try {
      const results = await audioDiagnosticsApi.testOutputs({
        ...testRequest,
        outputIds: uniqueOutputIds,
      })

      setStatuses((current) => {
        const next = { ...current }
        results.forEach((result) => {
          next[result.outputId] = result.ok ? "success" : "error"
        })
        return next
      })
    } catch (error) {
      setStatuses(() =>
        Object.fromEntries(uniqueOutputIds.map((id) => [id, "error"])) as Record<string, TestStatus>,
      )
      toast.error(t("settings.lineMapping.diagnosticsTestFailed"), {
        description:
          error instanceof Error
            ? error.message
            : t("settings.lineMapping.diagnosticsBackendRequired"),
      })
    } finally {
      setRunningAll(false)
    }
  }

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-sm font-semibold">
            {t("settings.lineMapping.diagnosticsTitle")}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("settings.lineMapping.diagnosticsDescription")}
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <div className="space-y-1.5">
            <Label className="text-xs">{t("settings.lineMapping.diagnosticsMode")}</Label>
            <Select value={mode} onValueChange={(value) => setMode(value as AudioTestMode)}>
              <SelectTrigger className="h-8 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="voice">{t("settings.lineMapping.diagnosticsVoice")}</SelectItem>
                <SelectItem value="tone">{t("settings.lineMapping.diagnosticsTone")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">{t("settings.lineMapping.diagnosticsDuration")}</Label>
            <Select value={durationMs} onValueChange={(value) => setDurationMs(value ?? "")}>
              <SelectTrigger className="h-8 w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="500">0.5 s</SelectItem>
                <SelectItem value="800">0.8 s</SelectItem>
                <SelectItem value="1000">1.0 s</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">{t("settings.lineMapping.diagnosticsVolume")}</Label>
            <Select value={volume} onValueChange={(value) => setVolume(value ?? "")}>
              <SelectTrigger className="h-8 w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.1">-20 dB</SelectItem>
                <SelectItem value="0.25">-12 dB</SelectItem>
                <SelectItem value="0.5">-6 dB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            size="sm"
            variant="outline"
            disabled={runningAll || uniqueOutputIds.length === 0}
            onClick={() => void testAll()}
          >
            <Play className="size-3.5" />
            {t("settings.lineMapping.diagnosticsTestAssigned")}
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <div className="grid grid-cols-[48px_minmax(0,1fr)_120px_96px] items-center gap-3 bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
          <span>#</span>
          <span>{t("settings.lineMapping.output")}</span>
          <span>{t("settings.lineMapping.status")}</span>
          <span className="text-right">{t("settings.lineMapping.diagnosticsTest")}</span>
        </div>

        {uniqueOutputIds.length === 0 ? (
          <div className="px-3 py-6 text-center text-xs text-muted-foreground">
            {t("settings.lineMapping.diagnosticsNoAssigned")}
          </div>
        ) : (
          uniqueOutputIds.map((outputId) => {
            const output = device.outputs.find((item) => item.id === outputId)
            const status = statuses[outputId] ?? "idle"

            return (
              <div
                key={outputId}
                className="grid grid-cols-[48px_minmax(0,1fr)_120px_96px] items-center gap-3 border-t px-3 py-2"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {String((output?.index ?? 0) + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {output?.name ?? outputId}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {outputId}
                  </div>
                </div>
                <div>
                  {status === "testing" && (
                    <Badge variant="outline" className="gap-1 text-[10px]">
                      <LoaderCircle className="size-3 animate-spin" />
                      {t("settings.lineMapping.diagnosticsTesting")}
                    </Badge>
                  )}
                  {status === "success" && (
                    <Badge variant="secondary" className="gap-1 text-[10px]">
                      <Check className="size-3" />
                      {t("settings.lineMapping.diagnosticsSignalSent")}
                    </Badge>
                  )}
                  {status === "error" && (
                    <Badge variant="destructive" className="gap-1 text-[10px]">
                      <CircleAlert className="size-3" />
                      {t("settings.lineMapping.diagnosticsFailed")}
                    </Badge>
                  )}
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    disabled={runningAll || activeOutputId !== null}
                    onClick={() => void testOutput(outputId)}
                    title={t("settings.lineMapping.testNamedOutput", {
                      name: output?.name ?? outputId,
                    })}
                    aria-label={t("settings.lineMapping.testNamedOutput", {
                      name: output?.name ?? outputId,
                    })}
                  >
                    {status === "testing" ? (
                      <Square className="size-3" />
                    ) : (
                      <Play className="size-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            )
          })
        )}
      </div>

      <p className="text-[11px] text-muted-foreground">
        {t("settings.lineMapping.diagnosticsSignalNotice")}
      </p>
    </div>
  )
}

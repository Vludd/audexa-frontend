import { RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { bufferSizes, sampleRates } from "@/data/audio"
import { t } from "@/i18n"

export default function AudioDeviceSettings() {
  const sampleRate = sampleRates[1]
  const bufferSize = bufferSizes[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {t("settings.audioDevice.title")}
        </CardTitle>

        <CardDescription className="text-xs">
          {t("settings.audioDevice.description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label>{t("settings.audioDevice.device")}</Label>

            <Select defaultValue="umc1820">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="umc1820">
                  UMC1820 (ASIO)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-6">
            <Button variant="outline" size="sm">
              <RefreshCw className="size-3.5" />
              {t("settings.audioDevice.refresh")}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("settings.audioDevice.sampleRate")}</Label>

          <Select
            defaultValue={sampleRate.toString()}
            disabled
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {sampleRates.map((rate) => (
                <SelectItem
                  key={rate}
                  value={rate.toString()}
                >
                  {rate} Hz
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("settings.audioDevice.bufferSize")}</Label>

          <Select
            defaultValue={bufferSize.toString()}
            disabled
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {bufferSizes.map((size) => (
                <SelectItem
                  key={size}
                  value={size.toString()}
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div
          hidden
          className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm dark:border-emerald-900 dark:bg-emerald-950/40"
        >
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            ● ONLINE
          </span>

          <span className="ml-2 text-muted-foreground">
            {t("settings.audioDevice.connected")}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
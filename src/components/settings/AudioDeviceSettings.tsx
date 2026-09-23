import { RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AudioDeviceSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          Аудиоустройство (ASIO)
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <Label>Устройство</Label>

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

          <Button variant="outline" size="sm">
            <RefreshCw className="size-3.5" />
            Обновить
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Частота дискретизации</Label>

          <Select defaultValue="48000">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="48000">48000 Hz</SelectItem>
              <SelectItem value="44100">44100 Hz</SelectItem>
              <SelectItem value="96000">96000 Hz</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Размер буфера</Label>

          <Select defaultValue="256">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="256">256 samples</SelectItem>
              <SelectItem value="512">512 samples</SelectItem>
              <SelectItem value="1024">1024 samples</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm dark:border-emerald-900 dark:bg-emerald-950/40">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            ● ONLINE
          </span>

          <span className="ml-2 text-muted-foreground">
            Устройство подключено и работает
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
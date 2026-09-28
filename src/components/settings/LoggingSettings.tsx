import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function LoggingSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          Журналирование
        </CardTitle>
        <CardDescription className="text-xs">
          Настройка уровня логирования и параметров журнала (В РАЗРАБОТКЕ)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Уровень логирования</Label>

          <Select defaultValue="INFO" disabled>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="INFO">INFO</SelectItem>
              <SelectItem value="DEBUG">DEBUG</SelectItem>
              <SelectItem value="WARNING">WARNING</SelectItem>
              <SelectItem value="ERROR">ERROR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Путь к журналу</Label>

          <Input defaultValue={"%APPDATA%\\Audexa\\logs\\"} disabled/>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-normal">
            Ротация файлов (ежедневно)
          </Label>

          <Switch defaultChecked disabled/>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-normal">
            Сохранять журнал 30 дней
          </Label>

          <Switch defaultChecked disabled/>
        </div>
      </CardContent>
    </Card>
  )
}
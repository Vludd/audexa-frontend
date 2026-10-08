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
import { t } from "@/i18n"

export default function LoggingSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          {t("settings.logging.title")}
        </CardTitle>
        <CardDescription className="text-xs">
          {t("settings.logging.description")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t("settings.logging.level")}</Label>

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
          <Label>{t("settings.logging.path")}</Label>

          <Input defaultValue={"%APPDATA%\\Audexa\\logs\\"} disabled/>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-normal">
            {t("settings.logging.rotation")}
          </Label>

          <Switch defaultChecked disabled/>
        </div>

        <div className="flex items-center justify-between">
          <Label className="font-normal">
            {t("settings.logging.retention")}
          </Label>

          <Switch defaultChecked disabled/>
        </div>
      </CardContent>
    </Card>
  )
}
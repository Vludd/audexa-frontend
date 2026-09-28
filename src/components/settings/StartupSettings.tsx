import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const OPTIONS = [
  "Автозапуск вместе с Windows",
  "Восстановление после сбоя",
  "Применять последний профиль при запуске",
  "Отправлять уведомления при ошибках",
]

export default function StartupSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          Автозапуск и восстановление
        </CardTitle>
        <CardDescription className="text-xs">
          Настройка автозапуска и восстановления приложения (В РАЗРАБОТКЕ)
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {OPTIONS.map((label) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4"
          >
            <Label className="cursor-pointer font-normal">
              {label}
            </Label>

            <Switch defaultChecked disabled/>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
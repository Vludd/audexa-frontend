import { Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface FormState {
  time: string
  scenario: string
  days: string[]
  repeat: string
  active: boolean
}

interface Props {
  open: boolean
  form: FormState
  onOpenChange: (open: boolean) => void
  onChange: (form: FormState) => void
  onSave: () => void
}

const DAYS = [
  "Пн",
  "Вт",
  "Ср",
  "Чт",
  "Пт",
  "Сб",
  "Вс",
]

const SCENARIOS = [
  "Экскурсия №1",
  "Исторический блок",
  "Природа Бурабая",
  "Детская программа",
  "Вечерний режим",
]

export default function ScheduleDialog({
  open,
  form,
  onOpenChange,
  onChange,
  onSave,
}: Props) {
  const toggleDay = (day: string) => {
    onChange({
      ...form,
      days: form.days.includes(day)
        ? form.days.filter((item) => item !== day)
        : [...form.days, day],
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="size-5 text-primary" />
            Добавить расписание
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <FormRow label="Время запуска">
            <Input
              type="time"
              value={form.time}
              onChange={(event) =>
                onChange({
                  ...form,
                  time: event.target.value,
                })
              }
            />
          </FormRow>

          <FormRow label="Сценарий">
            <Select
              value={form.scenario}
              onValueChange={(value) =>
                onChange({
                  ...form,
                  scenario: value ? value : "Экскурсия №1",
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {SCENARIOS.map((scenario) => (
                  <SelectItem
                    key={scenario}
                    value={scenario}
                  >
                    {scenario}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormRow>

          <FormRow label="Дни недели">
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => {
                const active = form.days.includes(day)

                return (
                  <Button
                    key={day}
                    type="button"
                    size="sm"
                    variant={
                      active
                        ? "default"
                        : "outline"
                    }
                    onClick={() => toggleDay(day)}
                    className="min-w-10"
                  >
                    {day}
                  </Button>
                )
              })}
            </div>
          </FormRow>

          <FormRow label="Повтор">
            <Select
              value={form.repeat}
              onValueChange={(value) =>
                onChange({
                  ...form,
                  repeat: value ? value : "Однократно",
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Ежедневно">
                  Ежедневно
                </SelectItem>
                <SelectItem value="Еженедельно">
                  Еженедельно
                </SelectItem>
                <SelectItem value="Однократно">
                  Однократно
                </SelectItem>
              </SelectContent>
            </Select>
          </FormRow>

          <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-3 py-3">
            <div>
              <div className="text-sm font-medium">
                Активно
              </div>
              <div className="text-xs text-muted-foreground">
                Запускать расписание автоматически
              </div>
            </div>

            <Switch
              checked={form.active}
              onCheckedChange={(active) =>
                onChange({
                  ...form,
                  active,
                })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </Button>

          <Button
            type="button"
            onClick={onSave}
          >
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function FormRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}
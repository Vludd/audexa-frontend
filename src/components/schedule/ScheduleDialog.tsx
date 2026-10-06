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

import type {
  Scenario,
  ScheduleFormData,
} from "@/types"

interface Props {
  open: boolean
  editing: boolean
  form: ScheduleFormData
  scenarios: Scenario[]
  onOpenChange: (open: boolean) => void
  onChange: (form: ScheduleFormData) => void
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

export default function ScheduleDialog({
  open,
  editing,
  form,
  scenarios,
  onOpenChange,
  onChange,
  onSave,
}: Props) {
  const toggleDay = (day: string) => {
    onChange({
      ...form,
      days: form.days.includes(day)
        ? form.days.filter(
            (item) => item !== day,
          )
        : [...form.days, day],
    })
  }

  const canSave =
    Boolean(form.time) &&
    form.scenarioId > 0 &&
    form.days.length > 0

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="size-5 text-primary" />

            {editing
              ? "Редактировать расписание"
              : "Добавить расписание"}
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
              value={
                form.scenarioId
                  ? String(form.scenarioId)
                  : undefined
              }
              onValueChange={(value) =>
                onChange({
                  ...form,
                  scenarioId: Number(value),
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите сценарий" />
              </SelectTrigger>

              <SelectContent>
                {scenarios.map((scenario) => (
                  <SelectItem
                    key={scenario.id}
                    value={String(scenario.id)}
                  >
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormRow>

          <FormRow label="Дни недели">
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => {
                const active =
                  form.days.includes(day)

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
                    onClick={() =>
                      toggleDay(day)
                    }
                    className="min-w-10"
                  >
                    {day}
                  </Button>
                )
              })}
            </div>

            {form.days.length === 0 && (
              <p className="text-xs text-destructive">
                Выберите хотя бы один день.
              </p>
            )}
          </FormRow>

          <FormRow label="Повтор">
            <Select
              value={form.repeat}
              onValueChange={(value) =>
                onChange({
                  ...form,
                  repeat:
                    value as ScheduleFormData["repeat"],
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="daily">
                  Ежедневно
                </SelectItem>

                <SelectItem value="weekly">
                  Еженедельно
                </SelectItem>

                <SelectItem value="once">
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
              checked={form.enabled}
              onCheckedChange={(enabled) =>
                onChange({
                  ...form,
                  enabled,
                })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Отмена
          </Button>

          <Button
            type="button"
            disabled={!canSave}
            onClick={onSave}
          >
            {editing
              ? "Сохранить изменения"
              : "Создать расписание"}
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
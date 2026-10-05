import type React from "react"

import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

import type { Scenario } from "@/types"
import type { ScenarioUpdate } from "@/hooks/useScenarios"

interface Props {
  scenario: Scenario
  onUpdate: (patch: ScenarioUpdate) => void
}

export default function ScenarioSettings({
  scenario,
  onUpdate,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
      <div className="rounded-lg border bg-card p-3.5">
        <div className="mb-3 text-sm font-semibold">
          Основные настройки
        </div>

        <FieldRow label="Название">
          <Input
            value={scenario.name}
            onChange={(event) =>
              onUpdate({
                name: event.target.value,
              })
            }
            className="h-9"
          />
        </FieldRow>

        <FieldRow label="Описание">
          <Textarea
            value={scenario.description}
            onChange={(event) =>
              onUpdate({
                description: event.target.value,
              })
            }
            rows={2}
          />
        </FieldRow>

        <FieldRow label="Режим воспроизведения">
          <select
            value={scenario.playMode}
            onChange={(event) =>
              onUpdate({
                playMode: event.target.value,
              })
            }
            className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value={scenario.playMode}>
              {scenario.playMode}
            </option>

            <option value="sequential">
              Последовательно
            </option>

            <option value="parallel">
              Параллельно
            </option>
          </select>
        </FieldRow>

        <FieldRow label="Повтор">
          <select
            value={scenario.repeat}
            onChange={(event) =>
              onUpdate({
                repeat: event.target.value,
              })
            }
            className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value={scenario.repeat}>
              {scenario.repeat}
            </option>

            <option value="once">
              Один раз
            </option>

            <option value="loop">
              Зациклить
            </option>
          </select>
        </FieldRow>
      </div>

      <div className="rounded-lg border bg-card p-3.5">
        <div className="mb-3 text-sm font-semibold">
          Дополнительные опции
        </div>

        <CheckRow
          label="Автоматически запускать по расписанию"
          checked={scenario.autoStart}
          onCheckedChange={(value) =>
            onUpdate({ autoStart: value })
          }
        />

        <CheckRow
          label="Останавливать предыдущий сценарий"
          checked={scenario.stopPrevious}
          onCheckedChange={(value) =>
            onUpdate({ stopPrevious: value })
          }
        />

        <CheckRow
          label="Синхронный перевод (линия 31)"
          checked={scenario.syncTranslation}
          onCheckedChange={(value) =>
            onUpdate({ syncTranslation: value })
          }
        />

        <CheckRow
          label="Плавное затухание между треками"
          checked={scenario.crossfade}
          onCheckedChange={(value) =>
            onUpdate({ crossfade: value })
          }
        />

        <CheckRow
          label="Показывать уведомления"
          checked={scenario.notifications}
          onCheckedChange={(value) =>
            onUpdate({ notifications: value })
          }
        />
      </div>
    </div>
  )
}

function FieldRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-3">
      <label className="mb-1.5 block text-xs text-muted-foreground">
        {label}
      </label>

      {children}
    </div>
  )
}

function CheckRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-2.5 last:border-0">
      <span className="text-sm">
        {label}
      </span>

      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  )
}
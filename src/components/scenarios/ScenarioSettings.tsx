import * as React from "react"

import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import type { Scenario } from "@/types"

interface Props {
  scenario: Scenario
}

export default function ScenarioSettings({
  scenario,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className="rounded-lg border bg-card p-4">
        <div className="mb-4 text-sm font-semibold">
          Настройки сценария
        </div>

        <FieldRow label="Название">
          <Input
            defaultValue={scenario.name}
            className="h-9"
          />
        </FieldRow>

        <FieldRow label="Описание">
          <Textarea
            defaultValue={scenario.description}
            rows={2}
          />
        </FieldRow>

        <FieldRow label="Режим воспроизведения">
          <select
            defaultValue={scenario.playMode}
            className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value={scenario.playMode}>
              {scenario.playMode}
            </option>
          </select>
        </FieldRow>

        <FieldRow label="Повтор">
          <select
            defaultValue={scenario.repeat}
            className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            <option value={scenario.repeat}>
              {scenario.repeat}
            </option>
          </select>
        </FieldRow>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <div className="mb-4 text-sm font-semibold">
          Дополнительные опции
        </div>

        <CheckRow
          label="Автоматически запускать по расписанию"
          checked={scenario.autoStart}
        />

        <CheckRow
          label="Останавливать предыдущий сценарий"
          checked={scenario.stopPrevious}
        />

        <CheckRow
          label="Синхронный перевод (линия 31)"
          checked={scenario.syncTranslation}
        />

        <CheckRow
          label="Плавное затухание между треками"
          checked={scenario.crossfade}
        />

        <CheckRow
          label="Показывать уведомления"
          checked={scenario.notifications}
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
}: {
  label: string
  checked: boolean
}) {
  const [value, setValue] = React.useState(checked)

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-sm">
        {label}
      </span>

      <Switch
        checked={value}
        onCheckedChange={setValue}
      />
    </div>
  )
}
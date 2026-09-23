import { useState } from "react"

import type { ScheduleItem } from "@/types"

import Header from "@/components/Header"
import ScheduleDialog from "@/components/schedule/ScheduleDialog"
import ScheduleTable from "@/components/schedule/ScheduleTable"
import ScheduleToolbar from "@/components/schedule/ScheduleToolbar"
import UpcomingEvents from "@/components/schedule/UpcomingEvents"

interface Props {
  schedule: ScheduleItem[]
  onToggle: (id: number) => void
}

interface FormState {
  time: string
  scenario: string
  days: string[]
  repeat: string
  active: boolean
}

const INITIAL_FORM: FormState = {
  time: "10:00",
  scenario: "Экскурсия №1",
  days: ["Пн", "Вт", "Ср", "Чт", "Пт"],
  repeat: "Ежедневно",
  active: true,
}

export default function Schedule({
  schedule,
  onToggle,
}: Props) {
  const [selectedDate] = useState(
    "22.09.2026 (Сегодня)",
  )

  const [showModal, setShowModal] = useState(false)

  const [form, setForm] =
    useState<FormState>(INITIAL_FORM)

  const upcoming = schedule
    .filter((item) => item.enabled)
    .slice(0, 5)

  const handleSave = () => {
    // Пока только закрываем форму.
    // Реальную запись добавим вместе с backend.
    setShowModal(false)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Header
        title="Расписание"
        subtitle="Автоматический запуск сценариев по времени"
      />

      <ScheduleToolbar
        selectedDate={selectedDate}
        onAdd={() => setShowModal(true)}
      />

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <main className="min-w-0 flex-1 overflow-auto p-5">
          <ScheduleTable
            schedule={schedule}
            onToggle={onToggle}
          />
        </main>

        <UpcomingEvents items={upcoming} />
      </div>

      <ScheduleDialog
        open={showModal}
        form={form}
        onOpenChange={setShowModal}
        onChange={setForm}
        onSave={handleSave}
      />
    </div>
  )
}
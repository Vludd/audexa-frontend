import {
  Calendar,
  DoorOpen,
  Home,
  List,
  Music,
  ScrollText,
  Settings,
} from "lucide-react"

import { cn } from "@/lib/utils"
import type { Page } from "../types"

interface Props {
  current: Page
  onChange: (page: Page) => void
}

const NAV: {
  page: Page
  label: string
  Icon: typeof Home
}[] = [
  { page: "dashboard", label: "Главная", Icon: Home },
  { page: "rooms", label: "Комнаты", Icon: DoorOpen },
  { page: "scenarios", label: "Сценарии", Icon: List },
  { page: "schedule", label: "Расписание", Icon: Calendar },
  { page: "audiofiles", label: "Аудиофайлы", Icon: Music },
  { page: "settings", label: "Настройки", Icon: Settings },
  { page: "logs", label: "Журнал событий", Icon: ScrollText },
]

export default function Sidebar({ current, onChange }: Props) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r bg-card">
      {/* Brand */}
      <div className="border-b px-4 pb-4 pt-5">
        <div className="mb-2 flex items-center gap-2.5">
          {/* Logo */}
          <div className="flex size-[38px] shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#17345F] to-[#1976D2]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 11 C3 6.5 6.5 3 11 3 C15.5 3 19 6.5 19 11"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="11" cy="11" r="3" fill="white" />
              <path
                d="M7 15 L5 18 M15 15 L17 18"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M11 14 L11 18"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div>
            <div className="text-[13px] font-bold leading-tight text-foreground">
              AUDEXA
            </div>

            <div className="text-[11px] font-semibold leading-tight text-primary">
              AUDIO CONTROL
            </div>
          </div>
        </div>

        <p className="text-[11px] leading-snug text-muted-foreground">
          Платформа центрального управления и автоматизации звука
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 p-2">
        {NAV.map(({ page, label, Icon }) => {
          const active = current === page

          return (
            <button
              key={page}
              type="button"
              onClick={() => onChange(page)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-primary font-semibold text-primary-foreground"
                  : "text-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
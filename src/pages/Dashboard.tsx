import {
  Activity,
  AlignLeft,
  ClipboardList,
  Mic,
  Play,
  PlayCircle,
  Square,
  Volume2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import type { Room, ScheduleItem, SystemStatus } from "@/types"
import Header from "@/components/Header"
import { cn } from "cn"
import React from "react"

interface Props {
  rooms: Room[];
  schedule: ScheduleItem[];
  system: SystemStatus;
  onStopAll: () => void;
  onNavigate: (page: string) => void;
}

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export default function Dashboard({
  rooms,
  schedule,
  system,
  onStopAll,
  onNavigate,
}: Props) {
  const playing = rooms.filter((room) => room.status === "playing")
  const currentRoom = playing[0]
  const upcomingSchedule = schedule.filter((item) => item.enabled).slice(0, 4)

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <Header
        title="Главная"
        subtitle="Платформа центрального управления и автоматизации звука"
      />

      <main className="min-h-0 flex-1 overflow-auto p-4">
        {/* Stats */}
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
          <StatCard
            icon={Volume2}
            value={rooms.length}
            label="Комнат"
          />

          <StatCard
            icon={Play}
            value={playing.length}
            label="Сейчас играет"
            accent="success"
          />

          <StatCard
            icon={AlignLeft}
            value={system.outputs - 1}
            label="Аудиолиний"
          />

          <StatCard
            icon={Activity}
            value={`${system.sampleRate / 1000} kHz`}
            label="Частота"
          />

          <Button
            variant="destructive"
            size="lg"
            onClick={onStopAll}
            className="h-[68px] px-6 text-sm font-bold"
          >
            <Square className="size-[18px]" fill="currentColor" />
            ОСТАНОВИТЬ ВСЁ
          </Button>
        </div>

        {/* Main content */}
        <div className="grid min-w-0 grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
          {/* Left */}
          <div className="flex min-w-0 flex-col gap-3">
            {currentRoom && (
              <Panel title="Текущее воспроизведение">
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 text-base font-bold">
                      {String(currentRoom.id).padStart(2, "0")} —{" "}
                      {currentRoom.name}
                    </div>

                    <div className="mb-3 text-sm text-muted-foreground">
                      {currentRoom.file}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Progress
                        value={
                          (currentRoom.position / currentRoom.duration) * 100
                        }
                        className="h-1.5"
                      />

                      <span className="shrink-0 text-xs text-muted-foreground">
                        {fmt(currentRoom.position)} /{" "}
                        {fmt(currentRoom.duration)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm">
                      <Play className="size-3.5" />
                      Пауза
                    </Button>

                    <Button size="sm" variant="secondary">
                      <Square className="size-3.5" />
                      Стоп
                    </Button>
                  </div>
                </div>
              </Panel>
            )}

            <Panel title={`Играют (${playing.length})`}>
              {playing.length === 0 ? (
                <div className="py-5 text-center text-sm text-muted-foreground">
                  Нет активных воспроизведений
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {playing.map((room) => (
                    <div
                      key={room.id}
                      className="flex items-center gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 dark:border-emerald-900 dark:bg-emerald-950/40"
                    >
                      <span className="min-w-7 text-sm font-bold">
                        {String(room.id).padStart(2, "0")}
                      </span>

                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {room.name}
                      </span>

                      <span className="hidden text-xs text-muted-foreground md:block">
                        {room.file}
                      </span>

                      <Progress
                        value={room.volume}
                        className="w-20"
                      />

                      <span className="min-w-8 text-right text-xs font-semibold text-emerald-600">
                        {room.volume}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            <Panel title="Аудиоустройство (ASIO)">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoRow label="Устройство" value={system.device} />

                <InfoRow
                  label="Статус"
                  value={<Badge variant="success">ONLINE</Badge>}
                />

                <InfoRow
                  label="Выходы"
                  value={`${system.outputs} (доступно)`}
                />

                <InfoRow
                  label="Частота"
                  value={`${system.sampleRate / 1000} kHz`}
                />

                <InfoRow
                  label="Буфер"
                  value={`${system.bufferSize} samples`}
                />

                <InfoRow
                  label="Аудиолинии"
                  value="31 (активно)"
                />
              </div>
            </Panel>
          </div>

          {/* Right */}
          <div className="flex min-w-0 flex-col gap-3">
            <Panel title="Расписание (ближайшие)">
              <div>
                {upcomingSchedule.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-center gap-2.5 py-2">
                      <span className="min-w-11 text-sm font-bold text-primary">
                        {item.time}
                      </span>

                      <span className="min-w-0 flex-1 truncate text-sm">
                        {item.scenarioName}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        Сегодня
                      </span>
                    </div>

                    {index < upcomingSchedule.length - 1 && <Separator />}
                  </div>
                ))}
              </div>

              <Button
                variant="link"
                className="mt-2 h-auto p-0 text-sm"
                onClick={() => onNavigate("schedule")}
              >
                Открыть расписание →
              </Button>
            </Panel>

            <Panel title="Быстрые действия">
              <div className="flex flex-col gap-2">
                <QuickAction
                  icon={<PlayCircle />}
                  label="Запустить сценарий"
                  variant="success"
                  onClick={() => onNavigate("scenarios")}
                />

                <QuickAction
                  icon={<ClipboardList />}
                  label="Тест выходов"
                  variant="outline"
                />

                <QuickAction
                  icon={<Mic />}
                  label="Синхронный перевод (Линия 31)"
                  variant="outline"
                />
              </div>
            </Panel>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>
  value: number | string
  label: string
  accent?: "success"
}) {
  const isSuccess = accent === "success"

  return (
    <Card className="flex-row items-center gap-3 px-4 py-3.5">
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-lg",
          isSuccess
            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
            : "bg-primary/10 text-primary",
        )}
      >
        <Icon className="size-6" />
      </div>

      <div>
        <div className="text-[25px] font-bold leading-none">
          {value}
        </div>

        <div className="mt-0.5 text-xs text-muted-foreground">
          {label}
        </div>
      </div>
    </Card>
  )
}

function Panel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="border-b px-4 py-2.5">
        <CardTitle className="text-sm">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3.5">
        {children}
      </CardContent>
    </Card>
  )
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-0.5 text-[11px] text-muted-foreground">
        {label}:
      </div>

      <div className="text-sm font-medium">
        {value}
      </div>
    </div>
  )
}

function QuickAction({
  icon,
  label,
  variant = "default",
  onClick,
}: {
  icon: React.ReactNode
  label: string
  variant?: "default" | "outline" | "success"
  onClick?: () => void
}) {
  return (
    <Button
      type="button"
      variant={variant === "success" ? "success" : variant}
      onClick={onClick}
      className="w-full justify-start gap-2.5"
    >
      {icon}
      {label}
    </Button>
  )
}

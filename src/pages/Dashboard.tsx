import type { LogEntry, Room, ScheduleItem, SystemStatus } from "@/types"

import Header from "@/components/Header"
import DashboardHealth from "@/components/dashboard/DashboardHealth"
import DashboardPlayback from "@/components/dashboard/DashboardPlayback"
import DashboardRooms from "@/components/dashboard/DashboardRooms"
import DashboardSchedule from "@/components/dashboard/DashboardSchedule"
import DashboardQuickActions from "@/components/dashboard/DashboardQuickActions"
import DashboardAudioSystem from "@/components/dashboard/DashboardAudioSystem"
import DashboardIssues from "@/components/dashboard/DashboardIssues"
import DashboardEmergencyStop from "@/components/dashboard/DashboardEmergencyStop"

interface Props {
  rooms: Room[]
  schedule: ScheduleItem[]
  system: SystemStatus
  logs: LogEntry[]
  onStopAll: () => void
  onPauseRoom: (roomId: number) => void
  onStopRoom: (roomId: number) => void
  onNavigate: (page: string) => void
}

export default function Dashboard({
  rooms,
  schedule,
  system,
  logs,
  onStopAll,
  onPauseRoom,
  onStopRoom,
  onNavigate,
}: Props) {
  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Header
          title="Главная"
          subtitle="Центральное управление и мониторинг аудиосистемы"
        />

        <main className="min-h-0 flex-1 overflow-auto p-4">
          <div className="flex flex-col gap-4">
            <DashboardHealth
              rooms={rooms}
              system={system}
              logs={logs}
            />

            {/* Main content */}
            <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
              {/* Left column */}
              <div className="flex min-w-0 flex-col gap-4">
                <DashboardPlayback
                  rooms={rooms}
                  onNavigate={onNavigate}
                  onPauseRoom={onPauseRoom}
                  onStopRoom={onStopRoom}
                />

                <DashboardRooms
                  rooms={rooms}
                  onNavigate={onNavigate}
                />
              </div>

              {/* Right column */}
              <div className="flex min-w-0 flex-col gap-4">
                <DashboardSchedule
                  schedule={schedule}
                  onNavigate={onNavigate}
                />

                <DashboardQuickActions
                  onNavigate={onNavigate}
                />

                <DashboardAudioSystem
                  system={system}
                />
              </div>
            </div>

            <DashboardIssues
              logs={logs}
              onNavigate={onNavigate}
            />

            <DashboardEmergencyStop
              rooms={rooms}
              onStopAll={onStopAll}
            />
          </div>
        </main>
      </div>
    </>
  )
}

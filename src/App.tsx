import { useState } from "react"
import type { Page } from "./types"

import {
  mockAudioFiles,
  mockLogs,
  mockSystemStatus,
} from "./data/mock"

import { useRooms } from "./hooks/useRooms"
import { useScenarios } from "./hooks/useScenarios"
import { useSchedule } from "./hooks/useSchedule"

import Sidebar from "./components/Sidebar"
import StatusBar from "./components/StatusBar"

import Dashboard from "./pages/Dashboard"
import Rooms from "./pages/Rooms"
import Scenarios from "./pages/Scenarios"
import Schedule from "./pages/Schedule"
import AudioFiles from "./pages/AudioFiles"
import Settings from "./pages/Settings"
import Logs from "./pages/Logs"

export default function App() {
  const [page, setPage] = useState<Page>("dashboard")

  const {
    rooms,
    operations,
    syncLine,
    playRoom,
    stopRoom,
    pauseRoom,
    playSyncLine,
    stopSyncLine,
    setRoomVolume,
    stopAllRooms,
    updateRoom,
    addRoom,
    deleteRoom,
    duplicateRoom,
  } = useRooms()

  const { scenarios, playScenario, stopScenario } = useScenarios({
    updateRoom,
    stopAllRooms,
  })

  const { schedule, toggleSchedule } = useSchedule()

  return (
    <div className="flex h-screen min-h-[700px] min-w-[1200px] flex-col overflow-hidden bg-background">
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar current={page} onChange={setPage} />

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
          {page === "dashboard" && (
            <Dashboard
              rooms={rooms}
              schedule={schedule}
              system={mockSystemStatus}
              onStopAll={stopAllRooms}
              onNavigate={(p) => setPage(p as Page)}
            />
          )}

          {page === "rooms" && (
            <Rooms
              rooms={rooms}
              operations={operations}
              syncLine={syncLine}
              onPlay={playRoom}
              onStop={stopRoom}
              onPause={pauseRoom}
              playSyncLine={playSyncLine}
              stopSyncLine={stopSyncLine}
              onVolumeChange={setRoomVolume}
              onAddRoom={addRoom}
              onUpdateRoom={(id, data) => updateRoom(id, data)}
              onDeleteRoom={deleteRoom}
              onDuplicateRoom={duplicateRoom}
            />
          )}

          {page === "scenarios" && (
            <Scenarios
              scenarios={scenarios}
              onPlay={playScenario}
              onStop={stopScenario}
            />
          )}

          {page === "schedule" && (
            <Schedule
              schedule={schedule}
              onToggle={toggleSchedule}
            />
          )}

          {page === "audiofiles" && (
            <AudioFiles files={mockAudioFiles} />
          )}

          {page === "settings" && <Settings />}

          {page === "logs" && <Logs logs={mockLogs} />}
        </main>
      </div>

      <StatusBar status={mockSystemStatus} />
    </div>
  )
}

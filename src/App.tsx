import { useState, useCallback } from 'react';
import type { Page, Room } from './types';
import { mockRooms, syncLine as defaultSyncLine, mockScenarios, mockSchedule, mockAudioFiles, mockLogs, mockSystemStatus } from './data/mock';
import Sidebar from './components/Sidebar';
import StatusBar from './components/StatusBar';
import Dashboard from './pages/Dashboard';
import Rooms from './pages/Rooms';
import Scenarios from './pages/Scenarios';
import Schedule from './pages/Schedule';
import AudioFiles from './pages/AudioFiles';
import Settings from './pages/Settings';
import Logs from './pages/Logs';

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [syncLine, setSyncLine] = useState<Room>(defaultSyncLine);
  const [schedule, setSchedule] = useState(mockSchedule);

  const updateRoom = useCallback((id: number, patch: Partial<Room>) => {
    if (id === 31) {
      setSyncLine(r => ({ ...r, ...patch }));
    } else {
      setRooms(rs => rs.map(r => r.id === id ? { ...r, ...patch } : r));
    }
  }, []);

  const handlePlay = useCallback((id: number) => updateRoom(id, { status: 'playing' }), [updateRoom]);
  const handleStop = useCallback((id: number) => updateRoom(id, { status: 'stopped', position: 0 }), [updateRoom]);
  const handlePause = useCallback((id: number) => updateRoom(id, { status: 'stopped' }), [updateRoom]);
  const handleVolume = useCallback((id: number, volume: number) => updateRoom(id, { volume }), [updateRoom]);

  const handleStopAll = useCallback(() => {
    setRooms(rs => rs.map(r => ({ ...r, status: 'stopped', position: 0 })));
    setSyncLine(r => ({ ...r, status: 'stopped', position: 0 }));
  }, []);

  const handleScenarioPlay = useCallback((id: number) => {
    const scenario = mockScenarios.find(s => s.id === id);
    if (!scenario) return;
    scenario.steps.forEach(step => updateRoom(step.roomId, { status: 'playing', file: step.file, volume: step.volume }));
  }, [updateRoom]);

  const handleScenarioStop = useCallback(() => {
    setRooms(rs => rs.map(r => ({ ...r, status: 'stopped' })));
  }, []);

  const handleScheduleToggle = useCallback((id: number) => {
    setSchedule(ss => ss.map(s => s.id === id ? { ...s, enabled: !s.enabled, status: !s.enabled ? 'active' : 'inactive' } : s));
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', overflow: 'hidden', background: 'var(--bg)',
    }}>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Sidebar current={page} onChange={setPage} />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>
          {page === 'dashboard' && (
            <Dashboard
              rooms={rooms}
              scenarios={mockScenarios}
              schedule={schedule}
              system={mockSystemStatus}
              onStopAll={handleStopAll}
              onNavigate={p => setPage(p as Page)}
            />
          )}
          {page === 'rooms' && (
            <Rooms
              rooms={rooms}
              syncLine={syncLine}
              onPlay={handlePlay}
              onStop={handleStop}
              onPause={handlePause}
              onVolumeChange={handleVolume}
            />
          )}
          {page === 'scenarios' && (
            <Scenarios
              scenarios={mockScenarios}
              onPlay={handleScenarioPlay}
              onStop={handleScenarioStop}
            />
          )}
          {page === 'schedule' && (
            <Schedule schedule={schedule} onToggle={handleScheduleToggle} />
          )}
          {page === 'audiofiles' && <AudioFiles files={mockAudioFiles} />}
          {page === 'settings' && <Settings />}
          {page === 'logs' && <Logs logs={mockLogs} />}
        </main>
      </div>
      <StatusBar status={mockSystemStatus} />
    </div>
  );
}

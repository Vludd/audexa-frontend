import { Volume2, Play, AlignLeft, Activity, Square, PlayCircle, ClipboardList, Mic } from 'lucide-react';
import type { Room, Scenario, ScheduleItem, SystemStatus } from '../types';
import Header from '../components/Header';

interface Props {
  rooms: Room[];
  scenarios: Scenario[];
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

export default function Dashboard({ rooms, scenarios, schedule, system, onStopAll, onNavigate }: Props) {
  const playing = rooms.filter(r => r.status === 'playing');
  const currentRoom = playing[0];
  const upcomingSchedule = schedule.filter(s => s.enabled).slice(0, 4);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header title="Главная" subtitle="Центральное управление аудиогидом МИК «Бурабай»" />
      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        {/* Top stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr) auto', gap: 12, marginBottom: 20 }}>
          <StatCard icon={<Volume2 size={28} color="var(--accent)" />} value={rooms.length} label="Комнат" />
          <StatCard icon={<Play size={28} color="var(--success)" />} value={playing.length} label="Сейчас играет" accent="success" />
          <StatCard icon={<AlignLeft size={28} color="var(--accent)" />} value={system.outputs - 1} label="Аудиолиний" />
          <StatCard icon={<Activity size={28} color="var(--accent)" />} value={`${system.sampleRate / 1000} kHz`} label="Частота" />
          <button
            onClick={onStopAll}
            style={{
              background: 'var(--error)', color: '#fff', border: 'none', borderRadius: 8,
              padding: '0 28px', fontWeight: 700, fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#c62828')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--error)')}
          >
            <Square size={18} fill="white" />
            ОСТАНОВИТЬ ВСЁ
          </button>
        </div>

        {/* Main content: left + right */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
          {/* Left: current line + rooms preview */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Current playing */}
            {currentRoom && (
              <Panel title="Текущее воспроизведение">
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', marginBottom: 2 }}>
                      {String(currentRoom.id).padStart(2, '0')} — {currentRoom.name}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>{currentRoom.file}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                          width: `${(currentRoom.position / currentRoom.duration) * 100}%`,
                          height: '100%', background: 'var(--accent)', borderRadius: 3,
                        }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                        {fmt(currentRoom.position)} / {fmt(currentRoom.duration)}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Btn label="Пауза" color="var(--accent)" />
                    <Btn label="Стоп" color="#68768A" />
                  </div>
                </div>
              </Panel>
            )}

            {/* Playing rooms summary */}
            <Panel title={`Играют (${playing.length})`}>
              {playing.length === 0 ? (
                <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px 0', fontSize: 13 }}>
                  Нет активных воспроизведений
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {playing.map(r => (
                    <div key={r.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '8px 12px', background: 'var(--success-light)',
                      borderRadius: 6, border: '1px solid #b7efd4',
                    }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', minWidth: 28 }}>
                        {String(r.id).padStart(2, '0')}
                      </span>
                      <span style={{ flex: 1, fontWeight: 500, color: 'var(--text)' }}>{r.name}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.file}</span>
                      <div style={{ width: 80, height: 4, background: '#cdf0e0', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${r.volume}%`, height: '100%', background: 'var(--success)' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--success)', minWidth: 32 }}>{r.volume}%</span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            {/* System info */}
            <Panel title="Аудиоустройство (ASIO)">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <InfoRow label="Устройство" value={system.device} />
                <InfoRow label="Статус" value={<span style={{ color: 'var(--success)', fontWeight: 600 }}>ONLINE</span>} />
                <InfoRow label="Выходы" value={`${system.outputs} (доступно)`} />
                <InfoRow label="Частота" value={`${system.sampleRate / 1000} kHz`} />
                <InfoRow label="Буфер" value={`${system.bufferSize} samples`} />
                <InfoRow label="Аудиолинии" value={`31 (активно)`} />
              </div>
            </Panel>
          </div>

          {/* Right panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Panel title="Расписание (ближайшие)">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {upcomingSchedule.map((item, i) => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 0',
                    borderBottom: i < upcomingSchedule.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--accent)', minWidth: 44 }}>{item.time}</span>
                    <span style={{ flex: 1, fontSize: 13, color: 'var(--text)' }}>{item.scenarioName}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Сегодня</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => onNavigate('schedule')}
                style={{
                  marginTop: 10, background: 'none', border: 'none', color: 'var(--accent)',
                  fontSize: 13, cursor: 'pointer', padding: 0, fontWeight: 500,
                }}
              >
                Открыть расписание →
              </button>
            </Panel>

            <Panel title="Быстрые действия">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <QuickAction
                  icon={<PlayCircle size={20} color="#fff" />}
                  label="Запустить сценарий"
                  bg="var(--success)"
                  onClick={() => onNavigate('scenarios')}
                />
                <QuickAction
                  icon={<ClipboardList size={20} color="var(--text)" />}
                  label="Тест выходов"
                  bg="var(--bg)"
                  textColor="var(--text)"
                  border="1px solid var(--border)"
                />
                <QuickAction
                  icon={<Mic size={20} color="var(--text)" />}
                  label="Синхронный перевод (Линия 31)"
                  bg="var(--bg)"
                  textColor="var(--text)"
                  border="1px solid var(--border)"
                />
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, accent }: { icon: React.ReactNode; value: number | string; label: string; accent?: string }) {
  return (
    <div style={{
      background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8,
      padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 8,
        background: accent === 'success' ? 'var(--success-light)' : 'var(--accent-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8,
      padding: 16,
    }}>
      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2 }}>{label}:</div>
      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{value}</div>
    </div>
  );
}

function Btn({ label, color }: { label: string; color: string }) {
  return (
    <button style={{
      background: color, color: '#fff', border: 'none', borderRadius: 5,
      padding: '6px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
    }}>{label}</button>
  );
}

function QuickAction({ icon, label, bg, textColor = '#fff', border, onClick }: {
  icon: React.ReactNode; label: string; bg: string; textColor?: string; border?: string; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', borderRadius: 6, cursor: 'pointer',
        background: bg, border: border || 'none', color: textColor,
        fontSize: 13, fontWeight: 500, textAlign: 'left', width: '100%',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

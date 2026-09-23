import { useState } from 'react';
import { Search, LayoutGrid, List, Play, Square, Settings, MoreHorizontal, Pause } from 'lucide-react';
import type { Room, RoomStatus } from '../types';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';

interface Props {
  rooms: Room[];
  syncLine: Room;
  onPlay: (id: number) => void;
  onStop: (id: number) => void;
  onPause: (id: number) => void;
  onVolumeChange: (id: number, vol: number) => void;
}

type Filter = 'all' | RoomStatus;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export default function Rooms({ rooms, syncLine, onPlay, onStop, onPause, onVolumeChange }: Props) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [viewGrid, setViewGrid] = useState(true);

  const counts: Record<Filter, number> = {
    all: rooms.length,
    playing: rooms.filter(r => r.status === 'playing').length,
    waiting: rooms.filter(r => r.status === 'waiting').length,
    stopped: rooms.filter(r => r.status === 'stopped').length,
    error: rooms.filter(r => r.status === 'error').length,
  };

  const filtered = rooms.filter(r => {
    const matchFilter = filter === 'all' || r.status === filter;
    const matchQuery = !query || r.name.toLowerCase().includes(query.toLowerCase()) || String(r.id).includes(query);
    return matchFilter && matchQuery;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header title="Комнаты" subtitle="Управление аудиолиниями комнат" />
      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Поиск комнаты..."
              style={{
                width: '100%', padding: '7px 12px 7px 32px', border: '1px solid var(--border)',
                borderRadius: 6, fontSize: 13, background: 'var(--panel)', color: 'var(--text)',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={() => setViewGrid(true)} style={viewBtn(viewGrid)}><LayoutGrid size={16} /></button>
          <button onClick={() => setViewGrid(false)} style={viewBtn(!viewGrid)}><List size={16} /></button>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {([
            ['all', `Все (${counts.all})`, 'var(--accent)'],
            ['playing', `Играют (${counts.playing})`, 'var(--success)'],
            ['waiting', `Ожидание (${counts.waiting})`, 'var(--warning)'],
            ['stopped', `Остановлены (${counts.stopped})`, '#68768A'],
            ['error', `Ошибки (${counts.error})`, 'var(--error)'],
          ] as [Filter, string, string][]).map(([f, label, color]) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '5px 14px', borderRadius: 20, border: `1px solid ${filter === f ? color : 'var(--border)'}`,
                background: filter === f ? color : 'var(--panel)',
                color: filter === f ? '#fff' : 'var(--text)',
                fontSize: 13, cursor: 'pointer', fontWeight: filter === f ? 600 : 400,
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              {f !== 'all' && <span style={{ width: 7, height: 7, borderRadius: '50%', background: filter === f ? '#fff' : color, display: 'inline-block' }} />}
              {label}
            </button>
          ))}
        </div>

        {/* Grid or List */}
        {viewGrid ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {filtered.map(room => <RoomCard key={room.id} room={room} onPlay={onPlay} onStop={onStop} onPause={onPause} onVolumeChange={onVolumeChange} />)}
          </div>
        ) : (
          <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                  {['#', 'Комната', 'Статус', 'Файл', 'Громкость', 'Действия'].map(h => (
                    <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((room, i) => (
                  <tr key={room.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--panel)' : '#fafbfc' }}>
                    <td style={{ padding: '8px 14px', fontWeight: 700, color: 'var(--text)' }}>{String(room.id).padStart(2, '0')}</td>
                    <td style={{ padding: '8px 14px', fontWeight: 500 }}>{room.name}</td>
                    <td style={{ padding: '8px 14px' }}><StatusBadge status={room.status} /></td>
                    <td style={{ padding: '8px 14px', color: 'var(--text-secondary)', fontSize: 12 }}>{room.file}</td>
                    <td style={{ padding: '8px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 60, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${room.volume}%`, height: '100%', background: 'var(--accent)' }} />
                        </div>
                        <span style={{ fontSize: 12 }}>{room.volume}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '8px 14px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {room.status === 'playing'
                          ? <SmallBtn label="Пауза" color="var(--accent)" onClick={() => onPause(room.id)} />
                          : <SmallBtn label="Запуск" color="var(--success)" onClick={() => onPlay(room.id)} />
                        }
                        <SmallBtn label="Стоп" color="#68768A" onClick={() => onStop(room.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sync line */}
        <div style={{ marginTop: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 10 }}>
            Линия 31 — Синхронный перевод
          </div>
          <div style={{
            background: 'var(--panel)', border: '2px solid var(--accent)', borderRadius: 8, padding: 16,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 8, background: 'var(--accent-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--accent)' }}>31</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>Синхронный перевод</div>
              <StatusBadge status={syncLine.status} />
            </div>
            <SmallBtn label="Запуск" color="var(--success)" onClick={() => onPlay(31)} />
            <SmallBtn label="Стоп" color="#68768A" onClick={() => onStop(31)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function RoomCard({ room, onPlay, onStop, onPause, onVolumeChange }: {
  room: Room;
  onPlay: (id: number) => void;
  onStop: (id: number) => void;
  onPause: (id: number) => void;
  onVolumeChange: (id: number, vol: number) => void;
}) {
  const borderColor = room.status === 'playing' ? 'var(--success)' : room.status === 'error' ? 'var(--error)' : room.status === 'waiting' ? 'var(--warning)' : 'var(--border)';
  const isPlaying = room.status === 'playing';

  return (
    <div style={{
      background: 'var(--panel)', borderRadius: 8,
      border: `1px solid ${borderColor}`,
      padding: 14,
      boxShadow: isPlaying ? '0 0 0 1px var(--success)' : 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{String(room.id).padStart(2, '0')}</span>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginTop: 2 }}>{room.name}</div>
          <div style={{ marginTop: 4 }}><StatusBadge status={room.status} /></div>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 2 }}>
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {room.file}
      </div>

      {/* Volume slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <input
          type="range" min={0} max={100} value={room.volume}
          onChange={e => onVolumeChange(room.id, +e.target.value)}
          style={{ flex: 1, accentColor: 'var(--accent)', cursor: 'pointer' }}
        />
        <span style={{ fontSize: 12, fontWeight: 500, minWidth: 30, textAlign: 'right' }}>{room.volume}%</span>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 6 }}>
        {isPlaying ? (
          <ActionBtn icon={<Pause size={12} />} label="Пауза" color="var(--accent)" onClick={() => onPause(room.id)} />
        ) : (
          <ActionBtn icon={<Play size={12} />} label="Запуск" color="var(--success)" onClick={() => onPlay(room.id)} />
        )}
        <ActionBtn icon={<Square size={12} />} label="Стоп" color="#68768A" onClick={() => onStop(room.id)} />
        <button style={{
          padding: '5px 8px', border: '1px solid var(--border)', borderRadius: 4,
          background: 'var(--bg)', cursor: 'pointer', color: 'var(--text-secondary)',
        }}>
          <Settings size={13} />
        </button>
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, color, onClick }: { icon: React.ReactNode; label: string; color: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '5px 10px', borderRadius: 4, border: 'none',
        background: color, color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer',
        flex: 1, justifyContent: 'center',
      }}
    >
      {icon}{label}
    </button>
  );
}

function SmallBtn({ label, color, onClick }: { label: string; color: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 12px', borderRadius: 4, border: 'none',
        background: color, color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer',
      }}
    >{label}</button>
  );
}

function viewBtn(active: boolean): React.CSSProperties {
  return {
    padding: '6px 10px', borderRadius: 5, border: '1px solid var(--border)',
    background: active ? 'var(--accent)' : 'var(--panel)',
    color: active ? '#fff' : 'var(--text-secondary)',
    cursor: 'pointer', display: 'flex', alignItems: 'center',
  };
}

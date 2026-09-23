import { useState } from 'react';
import { Search, Plus, Play, Pencil, Trash2, Upload } from 'lucide-react';
import type { AudioFile } from '../types';
import Header from '../components/Header';

interface Props { files: AudioFile[]; }

function fmtDur(s: number) {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}
function fmtSize(b: number) {
  if (!b) return '—';
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export default function AudioFiles({ files }: Props) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = files.filter(f =>
    !query || f.name.toLowerCase().includes(query.toLowerCase()) || f.filename.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header title="Аудиофайлы" subtitle="Управление звуковыми файлами системы" />

      {/* Toolbar */}
      <div style={{
        padding: '12px 20px', background: 'var(--panel)', borderBottom: '1px solid var(--border)',
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <button style={tbBtn('var(--accent)')}><Plus size={14} /> Добавить файл</button>
        <button style={tbBtn('var(--bg)', 'var(--text)', '1px solid var(--border)')}><Upload size={14} /> Импортировать</button>
        <div style={{ flex: 1 }} />
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Поиск файлов..."
            style={{ padding: '6px 10px 6px 28px', border: '1px solid var(--border)', borderRadius: 5, fontSize: 13, background: 'var(--bg)', color: 'var(--text)', outline: 'none', width: 220 }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                {['Название', 'Файл', 'Формат', 'Частота', 'Длительность', 'Размер', ''].map(h => (
                  <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr
                  key={f.id}
                  onClick={() => setSelected(f.id)}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: selected === f.id ? 'var(--accent-light)' : i % 2 === 0 ? 'var(--panel)' : '#fafbfc',
                    cursor: 'pointer',
                  }}
                >
                  <td style={{ padding: '9px 14px', fontWeight: 500, color: 'var(--text)' }}>{f.name}</td>
                  <td style={{ padding: '9px 14px', fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{f.filename}</td>
                  <td style={{ padding: '9px 14px', fontSize: 12 }}>
                    <span style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 4, fontWeight: 600, fontSize: 11 }}>{f.format}</span>
                  </td>
                  <td style={{ padding: '9px 14px', fontSize: 13, color: 'var(--text)' }}>{f.sampleRate / 1000} kHz</td>
                  <td style={{ padding: '9px 14px', fontSize: 13, color: 'var(--text)' }}>{f.duration ? fmtDur(f.duration) : '—'}</td>
                  <td style={{ padding: '9px 14px', fontSize: 13, color: 'var(--text-secondary)' }}>{fmtSize(f.size)}</td>
                  <td style={{ padding: '9px 10px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <IconBtn icon={<Play size={13} />} title="Прослушать" color="var(--success)" />
                      <IconBtn icon={<Pencil size={13} />} title="Переименовать" color="var(--accent)" />
                      <IconBtn icon={<Trash2 size={13} />} title="Удалить" color="var(--error)" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
          Файлов: {filtered.length} из {files.length}
        </div>
      </div>
    </div>
  );
}

function tbBtn(bg: string, color = '#fff', border?: string): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '7px 14px', borderRadius: 5, border: border || 'none',
    background: bg, color, fontSize: 13, fontWeight: 500, cursor: 'pointer',
  };
}

function IconBtn({ icon, title, color }: { icon: React.ReactNode; title: string; color: string }) {
  return (
    <button
      title={title}
      style={{
        padding: '4px 6px', border: '1px solid var(--border)', borderRadius: 4,
        background: 'var(--panel)', color, cursor: 'pointer', display: 'flex', alignItems: 'center',
      }}
    >{icon}</button>
  );
}

import { useState } from 'react';
import { Download, Trash2, RefreshCw } from 'lucide-react';
import type { LogEntry } from '../types';
import Header from '../components/Header';

interface Props { logs: LogEntry[]; }

type Filter = 'all' | 'INFO' | 'WARNING' | 'ERROR';

const LEVEL_COLORS: Record<string, { color: string; bg: string }> = {
  INFO: { color: '#1976D2', bg: '#E3F0FF' },
  WARNING: { color: '#F2B01E', bg: '#FEF8E7' },
  ERROR: { color: '#E53935', bg: '#FDEAEA' },
};

export default function Logs({ logs }: Props) {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = filter === 'all' ? logs : logs.filter(l => l.level === filter);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header title="Журнал событий" subtitle="История действий и системных сообщений" />

      {/* Toolbar */}
      <div style={{
        padding: '12px 20px', background: 'var(--panel)', borderBottom: '1px solid var(--border)',
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        {(['all', 'INFO', 'WARNING', 'ERROR'] as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '5px 14px', borderRadius: 20, border: '1px solid var(--border)',
              background: filter === f ? (f === 'all' ? 'var(--accent)' : LEVEL_COLORS[f]?.color ?? 'var(--accent)') : 'var(--panel)',
              color: filter === f ? '#fff' : 'var(--text)',
              fontSize: 12, fontWeight: filter === f ? 600 : 400, cursor: 'pointer',
            }}
          >
            {f === 'all' ? 'Все' : f === 'INFO' ? 'Информация' : f === 'WARNING' ? 'Предупреждения' : 'Ошибки'}
            {' '}({f === 'all' ? logs.length : logs.filter(l => l.level === f).length})
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button style={tbBtn()}><RefreshCw size={13} /> Обновить</button>
        <button style={tbBtn()}><Download size={13} /> Экспорт</button>
        <button style={{ ...tbBtn(), color: 'var(--error)' }}><Trash2 size={13} /> Очистить</button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        <div style={{
          background: '#0f1b2e', borderRadius: 8, padding: 0, overflow: 'hidden',
          border: '1px solid #1e2d42', fontFamily: 'Consolas, "Courier New", monospace',
        }}>
          {/* Header row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '90px 80px 1fr',
            padding: '8px 16px', background: '#1e2d42', fontSize: 11, fontWeight: 700,
            color: '#8fa8c8', letterSpacing: '0.05em',
          }}>
            <span>ВРЕМЯ</span>
            <span>УРОВЕНЬ</span>
            <span>СООБЩЕНИЕ</span>
          </div>
          {filtered.map((entry, i) => {
            const lc = LEVEL_COLORS[entry.level] ?? { color: '#8fa8c8', bg: 'transparent' };
            return (
              <div
                key={entry.id}
                style={{
                  display: 'grid', gridTemplateColumns: '90px 80px 1fr',
                  padding: '6px 16px', fontSize: 13,
                  background: i % 2 === 0 ? '#0f1b2e' : '#111e30',
                  borderBottom: '1px solid #1e2d42',
                }}
              >
                <span style={{ color: '#5a7a9a', fontVariantNumeric: 'tabular-nums' }}>{entry.time}</span>
                <span>
                  <span style={{
                    padding: '1px 6px', borderRadius: 3, fontSize: 11, fontWeight: 700,
                    background: lc.bg + '22', color: lc.color,
                  }}>{entry.level}</span>
                </span>
                <span style={{ color: entry.level === 'ERROR' ? '#ff6b6b' : entry.level === 'WARNING' ? '#f2b01e' : '#c8d8ec' }}>
                  {entry.message}
                </span>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ padding: '40px 16px', textAlign: 'center', color: '#5a7a9a', fontSize: 13 }}>
              Нет записей
            </div>
          )}
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
          Записей: {filtered.length} из {logs.length}
        </div>
      </div>
    </div>
  );
}

function tbBtn(): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '6px 12px', borderRadius: 5, border: '1px solid var(--border)',
    background: 'var(--bg)', color: 'var(--text)', fontSize: 12, cursor: 'pointer',
  };
}

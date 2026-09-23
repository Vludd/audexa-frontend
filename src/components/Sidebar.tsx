import { Home, DoorOpen, List, Calendar, Music, Settings, ScrollText } from 'lucide-react';
import type { Page } from '../types';

interface Props {
  current: Page;
  onChange: (p: Page) => void;
}

const NAV: { page: Page; label: string; Icon: typeof Home }[] = [
  { page: 'dashboard', label: 'Главная', Icon: Home },
  { page: 'rooms', label: 'Комнаты', Icon: DoorOpen },
  { page: 'scenarios', label: 'Сценарии', Icon: List },
  { page: 'schedule', label: 'Расписание', Icon: Calendar },
  { page: 'audiofiles', label: 'Аудиофайлы', Icon: Music },
  { page: 'settings', label: 'Настройки', Icon: Settings },
  { page: 'logs', label: 'Журнал событий', Icon: ScrollText },
];

export default function Sidebar({ current, onChange }: Props) {
  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      background: 'var(--panel)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 8,
            background: 'linear-gradient(135deg, #17345F 0%, #1976D2 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 11 C3 6.5 6.5 3 11 3 C15.5 3 19 6.5 19 11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="11" cy="11" r="3" fill="white"/>
              <path d="M7 15 L5 18 M15 15 L17 18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M11 14 L11 18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)', lineHeight: 1.2 }}>BURABAY</div>
            <div style={{ fontWeight: 600, fontSize: 11, color: 'var(--accent)', lineHeight: 1.2 }}>AUDIO CONTROL</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
          Центральное управление аудиогидом МИК «Бурабай»
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(({ page, label, Icon }) => {
          const active = current === page;
          return (
            <button
              key={page}
              onClick={() => onChange(page)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
                background: active ? 'var(--accent)' : 'transparent',
                color: active ? '#fff' : 'var(--text)',
                fontWeight: active ? 600 : 400,
                fontSize: 14, textAlign: 'left', width: '100%',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'var(--accent-light)'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Bottom landscape */}
      <div style={{ borderTop: '1px solid var(--border)' }}>
        <div style={{
          height: 100, background: 'linear-gradient(180deg, #c8dff0 0%, #a8cde8 40%, #6fa8d0 100%)',
          position: 'relative', overflow: 'hidden',
        }}>
          <svg viewBox="0 0 220 100" style={{ position: 'absolute', bottom: 0, width: '100%' }} preserveAspectRatio="none">
            <path d="M0 60 Q30 30 60 50 Q90 70 110 40 Q140 10 160 45 Q180 70 220 50 L220 100 L0 100Z" fill="#2d7a4f" opacity="0.7"/>
            <path d="M0 75 Q40 60 80 70 Q120 80 160 65 Q190 55 220 70 L220 100 L0 100Z" fill="#1a5c38" opacity="0.6"/>
            <ellipse cx="90" cy="38" rx="25" ry="18" fill="#5a8fc0" opacity="0.5"/>
            <path d="M65 55 Q90 20 115 55" fill="#7aa8c8" opacity="0.7"/>
          </svg>
        </div>
        <div style={{ padding: '8px 16px 12px', background: 'var(--panel)' }}>
          <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--text)' }}>Бурабай</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Природа. История. Вдохновение.</div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 6 }}>v1.0.0</div>
        </div>
      </div>
    </aside>
  );
}

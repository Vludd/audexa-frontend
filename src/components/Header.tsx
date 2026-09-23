import { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  systemOk?: boolean;
}

export default function Header({ title, subtitle, systemOk = true }: Props) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = now.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div style={{
      background: 'var(--panel)',
      borderBottom: '1px solid var(--border)',
      padding: '14px 24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{subtitle}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{dateStr}</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', fontVariantNumeric: 'tabular-nums' }}>{timeStr}</div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 6,
          background: systemOk ? 'var(--success-light)' : 'var(--error-light)',
        }}>
          {systemOk
            ? <CheckCircle size={16} color="var(--success)" />
            : <XCircle size={16} color="var(--error)" />
          }
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: systemOk ? 'var(--success)' : 'var(--error)' }}>
              {systemOk ? 'Система работает' : 'Ошибка системы'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
              {systemOk ? 'Все линии в норме' : 'Проверьте подключение'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

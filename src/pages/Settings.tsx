import { RefreshCw } from 'lucide-react';
import Header from '../components/Header';

export default function Settings() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header title="Настройки" subtitle="Конфигурация аудиосистемы и оборудования" />
      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* ASIO */}
          <Section title="Аудиоустройство (ASIO)">
            <Field label="Устройство">
              <select style={inp}>
                <option>UMC1820 (ASIO)</option>
              </select>
              <button style={{ marginLeft: 8, background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 5, padding: '6px 10px', cursor: 'pointer', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                <RefreshCw size={12} /> Обновить
              </button>
            </Field>
            <Field label="Частота дискретизации">
              <select style={inp}><option>48000 Hz</option><option>44100 Hz</option><option>96000 Hz</option></select>
            </Field>
            <Field label="Размер буфера">
              <select style={inp}><option>256 samples</option><option>512 samples</option><option>1024 samples</option></select>
            </Field>
            <div style={{ marginTop: 8, padding: '10px 12px', background: 'var(--success-light)', border: '1px solid #b7efd4', borderRadius: 6, fontSize: 13 }}>
              <span style={{ color: 'var(--success)', fontWeight: 600 }}>● ONLINE</span>
              <span style={{ color: 'var(--text-secondary)', marginLeft: 10 }}>Устройство подключено и работает</span>
            </div>
          </Section>

          {/* Карта линий */}
          <Section title="Карта линий (логическая → физическая)">
            <div style={{ maxHeight: 280, overflow: 'auto' }}>
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '5px 8px', borderBottom: '1px solid var(--border)',
                  fontSize: 13, background: i % 2 === 0 ? 'var(--panel)' : '#fafbfc',
                }}>
                  <span style={{ color: 'var(--text)' }}>Комната {String(i + 1).padStart(2, '0')}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>→</span>
                  <select style={{ ...inp, width: 80, padding: '3px 6px' }}>
                    <option>OUT {String(i + 1).padStart(2, '0')}</option>
                  </select>
                </div>
              ))}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '5px 8px', fontSize: 13, background: 'var(--accent-light)',
              }}>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Синхронный перевод</span>
                <span style={{ color: 'var(--text-secondary)' }}>→</span>
                <select style={{ ...inp, width: 80, padding: '3px 6px', borderColor: 'var(--accent)' }}>
                  <option>OUT 31</option>
                </select>
              </div>
            </div>
          </Section>

          {/* Автозапуск / поведение */}
          <Section title="Автозапуск и восстановление">
            <CheckField label="Автозапуск вместе с Windows" defaultChecked />
            <CheckField label="Восстановление после сбоя" defaultChecked />
            <CheckField label="Применять последний профиль при запуске" defaultChecked />
            <CheckField label="Отправлять уведомления при ошибках" defaultChecked />
          </Section>

          {/* Журналирование */}
          <Section title="Журналирование">
            <Field label="Уровень логирования">
              <select style={inp}><option>INFO</option><option>DEBUG</option><option>WARNING</option><option>ERROR</option></select>
            </Field>
            <Field label="Путь к журналу">
              <input defaultValue="C:\Burabay\logs\" style={inp} />
            </Field>
            <CheckField label="Ротация файлов (ежедневно)" defaultChecked />
            <CheckField label="Сохранять журнал 30 дней" defaultChecked />
          </Section>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
          <button style={saveBtn('var(--accent)')}>Сохранить настройки</button>
          <button style={saveBtn('var(--bg)', 'var(--text)', '1px solid var(--border)')}>Сбросить по умолчанию</button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 14, paddingBottom: 8, borderBottom: '1px solid var(--border)' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
    </div>
  );
}

function CheckField({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontSize: 13, cursor: 'pointer' }}>
      <input type="checkbox" defaultChecked={defaultChecked} style={{ accentColor: 'var(--accent)', width: 15, height: 15 }} />
      {label}
    </label>
  );
}

const inp: React.CSSProperties = {
  flex: 1, padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 5,
  fontSize: 13, color: 'var(--text)', background: 'var(--bg)', outline: 'none',
};

function saveBtn(bg: string, color = '#fff', border?: string): React.CSSProperties {
  return {
    padding: '8px 20px', borderRadius: 5, border: border || 'none',
    background: bg, color, fontSize: 13, fontWeight: 600, cursor: 'pointer',
  };
}

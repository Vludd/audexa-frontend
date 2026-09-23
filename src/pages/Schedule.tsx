import { useState } from 'react';
import { Plus, Edit2, Trash2, Copy, Calendar, Play, Square, Clock } from 'lucide-react';
import type { ScheduleItem } from '../types';
import Header from '../components/Header';

interface Props {
  schedule: ScheduleItem[];
  onToggle: (id: number) => void;
}

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export default function Schedule({ schedule, onToggle }: Props) {
  const [selectedDate] = useState('22.09.2026 (Сегодня)');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    time: '10:00', scenario: 'Экскурсия №1', days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'],
    repeat: 'Ежедневно', active: true,
  });

  const upcoming = schedule.filter(s => s.enabled).slice(0, 5);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header title="Расписание" subtitle="Автоматический запуск сценариев по времени" />

      {/* Toolbar */}
      <div style={{
        padding: '12px 20px', background: 'var(--panel)', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button onClick={() => setShowModal(true)} style={tbBtn('var(--accent)')}>
          <Plus size={14} /> Добавить расписание
        </button>
        <button style={tbBtn('var(--bg)', 'var(--text)', '1px solid var(--border)')}><Edit2 size={14} /> Редактировать</button>
        <button style={tbBtn('var(--bg)', 'var(--error)', '1px solid var(--border)')}><Trash2 size={14} /> Удалить</button>
        <button style={tbBtn('var(--bg)', 'var(--text)', '1px solid var(--border)')}><Copy size={14} /> Дублировать</button>
        <div style={{ flex: 1 }} />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          border: '1px solid var(--border)', borderRadius: 6, padding: '6px 12px', background: 'var(--panel)',
          fontSize: 13, color: 'var(--text)',
        }}>
          <Calendar size={14} color="var(--accent)" />
          {selectedDate}
          <span style={{ color: 'var(--text-secondary)' }}>▾</span>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', display: 'flex', gap: 0 }}>
        {/* Main table */}
        <div style={{ flex: 1, padding: 20, overflow: 'auto' }}>
          <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                  {['Вкл.', 'Время', 'Сценарий', 'Дни', 'Повтор', 'Следующий запуск', 'Статус'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.map((item, i) => (
                  <tr
                    key={item.id}
                    style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--panel)' : '#fafbfc' }}
                  >
                    <td style={{ padding: '10px 14px' }}>
                      <input
                        type="checkbox" checked={item.enabled}
                        onChange={() => onToggle(item.id)}
                        style={{ accentColor: 'var(--accent)', width: 16, height: 16, cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{item.time}</td>
                    <td style={{ padding: '10px 14px', fontWeight: 500, color: 'var(--text)' }}>{item.scenarioName}</td>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: 'var(--text)' }}>
                      {item.days.length === 7 ? 'Пн – Вс' : item.days.join(', ')}
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: 13, color: 'var(--text)' }}>
                      {item.repeat === 'daily' ? 'Ежедневно' : item.repeat === 'weekly' ? 'Еженедельно' : 'Однократно'}
                    </td>
                    <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-secondary)' }}>{item.nextRun}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 500,
                        background: item.status === 'active' ? 'var(--success-light)' : 'var(--bg)',
                        color: item.status === 'active' ? 'var(--success)' : 'var(--text-secondary)',
                      }}>
                        {item.status === 'active' ? '● Активно' : '○ Отключено'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{
          width: 240, background: 'var(--panel)', borderLeft: '1px solid var(--border)',
          padding: 16, overflow: 'auto', flexShrink: 0,
        }}>
          <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 12 }}>
            Ближайшие события
            <button style={{ float: 'right', background: 'none', border: 'none', fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>
              Все события
            </button>
          </div>
          {upcoming.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 3 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                <div style={{ width: 1, height: 20, background: 'var(--border)' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text)' }}>{item.time}</div>
                <div style={{ fontSize: 12, color: 'var(--text)' }}>{item.scenarioName}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Сегодня</div>
              </div>
            </div>
          ))}

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 10 }}>Быстрые действия</div>
            <button style={quickBtn('var(--success)')}><Play size={15} fill="white" /> Запустить сейчас</button>
            <button style={{ ...quickBtn('var(--error)'), marginTop: 6 }}><Square size={15} fill="white" /> Остановить всё</button>
            <button style={{ ...quickBtn('var(--bg)', 'var(--text)'), marginTop: 6, border: '1px solid var(--border)' }}>
              <Clock size={15} /> Тест расписания
            </button>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{ padding: '6px 20px', background: '#1e2d42', display: 'flex', gap: 16, fontSize: 12, color: '#8fa8c8' }}>
        <span>Аудиоустройство: <strong style={{ color: '#c8d8ec' }}>UMC1820 (ASIO)</strong></span>
        <span>● <strong style={{ color: '#18B968' }}>ONLINE</strong></span>
        <span>Частота: <strong style={{ color: '#c8d8ec' }}>48 kHz</strong></span>
        <span>Аудиолиний: <strong style={{ color: '#c8d8ec' }}>31</strong></span>
        <div style={{ flex: 1 }} />
        <span style={{ color: 'var(--accent)', cursor: 'pointer' }}>⚙ Настройки аудио</span>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: 'var(--panel)', borderRadius: 10, padding: 24, width: 480,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={18} color="var(--accent)" />
                Добавить расписание
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--text-secondary)' }}>×</button>
            </div>

            <FormRow label="Время запуска:">
              <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} style={inp} />
            </FormRow>
            <FormRow label="Сценарий:">
              <select style={inp} value={form.scenario} onChange={e => setForm(f => ({ ...f, scenario: e.target.value }))}>
                <option>Экскурсия №1</option>
                <option>Исторический блок</option>
                <option>Природа Бурабая</option>
                <option>Детская программа</option>
                <option>Вечерний режим</option>
              </select>
            </FormRow>
            <FormRow label="Дни недели:">
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {DAYS.map(d => (
                  <label key={d} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                    <input
                      type="checkbox"
                      checked={form.days.includes(d)}
                      onChange={e => setForm(f => ({
                        ...f,
                        days: e.target.checked ? [...f.days, d] : f.days.filter(x => x !== d),
                      }))}
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    {d}
                  </label>
                ))}
              </div>
            </FormRow>
            <FormRow label="Повтор:">
              <select style={inp} value={form.repeat} onChange={e => setForm(f => ({ ...f, repeat: e.target.value }))}>
                <option>Ежедневно</option>
                <option>Еженедельно</option>
                <option>Однократно</option>
              </select>
            </FormRow>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} style={{ accentColor: 'var(--accent)', width: 16, height: 16 }} />
              <strong>Активно</strong>
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={tbBtn('var(--bg)', 'var(--text)', '1px solid var(--border)')}>Отмена</button>
              <button onClick={() => setShowModal(false)} style={tbBtn('var(--accent)')}>Сохранить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inp: React.CSSProperties = {
  width: '100%', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 5,
  fontSize: 13, color: 'var(--text)', background: 'var(--bg)', outline: 'none',
};

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <label style={{ width: 140, fontSize: 13, color: 'var(--text)', flexShrink: 0 }}>{label}</label>
      <div style={{ flex: 1 }}>{children}</div>
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

function quickBtn(bg: string, color = '#fff'): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '8px 12px', borderRadius: 5, border: 'none',
    background: bg, color, fontSize: 13, fontWeight: 500, cursor: 'pointer', width: '100%',
  };
}

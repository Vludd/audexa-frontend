import { useState } from 'react';
import { Plus, Copy, Edit2, Trash2, Search, Play, Pause, Square, ChevronUp, ChevronDown, Download, Upload, Headphones } from 'lucide-react';
import type { Scenario, ScenarioStep } from '../types';
import Header from '../components/Header';

interface Props {
  scenarios: Scenario[];
  onPlay: (id: number) => void;
  onStop: (id: number) => void;
}

function fmtSec(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function totalDuration(steps: ScenarioStep[]) {
  return steps.reduce((sum, s) => sum + s.duration + s.delay, 0);
}

export default function Scenarios({ scenarios, onPlay, onStop }: Props) {
  const [selected, setSelected] = useState<number>(scenarios[0]?.id ?? 1);
  const scenario = scenarios.find(s => s.id === selected) ?? scenarios[0];
  const [query, setQuery] = useState('');

  const filtered = scenarios.filter(s => !query || s.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Header title="Сценарии" subtitle="Создание и управление аудиосценариями для комнат" />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Toolbar */}
        <div style={{
          padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--panel)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Btn label="+ Создать сценарий" color="var(--accent)" />
          <Btn label="Дублировать" color="var(--bg)" textColor="var(--text)" border="1px solid var(--border)" icon={<Copy size={14} />} />
          <Btn label="Редактировать" color="var(--bg)" textColor="var(--text)" border="1px solid var(--border)" icon={<Edit2 size={14} />} />
          <Btn label="Удалить" color="var(--bg)" textColor="var(--error)" border="1px solid var(--border)" icon={<Trash2 size={14} />} />
          <div style={{ flex: 1 }} />
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Поиск сценариев..."
              style={{
                padding: '6px 10px 6px 28px', border: '1px solid var(--border)', borderRadius: 5,
                fontSize: 13, background: 'var(--bg)', color: 'var(--text)', outline: 'none', width: 200,
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', gap: 0 }}>
          {/* Left: scenario list */}
          <div style={{
            width: 220, background: 'var(--panel)', borderRight: '1px solid var(--border)',
            overflow: 'auto', flexShrink: 0,
          }}>
            <div style={{ padding: '12px 16px 8px', fontWeight: 600, fontSize: 13, color: 'var(--text-secondary)' }}>
              Список сценариев
            </div>
            {filtered.map((s, i) => (
              <div
                key={s.id}
                onClick={() => setSelected(s.id)}
                style={{
                  padding: '10px 16px', cursor: 'pointer',
                  background: selected === s.id ? 'var(--accent-light)' : 'transparent',
                  borderLeft: selected === s.id ? '3px solid var(--accent)' : '3px solid transparent',
                  transition: 'background 0.1s',
                }}
              >
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: selected === s.id ? 'var(--accent)' : 'var(--border)',
                    fontSize: 11, fontWeight: 700, color: selected === s.id ? '#fff' : 'var(--text-secondary)',
                    flexShrink: 0,
                  }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{s.name}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginLeft: 30 }}>{s.description}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginLeft: 30, marginTop: 2 }}>
                  {s.steps.length} комнат · {fmtSec(totalDuration(s.steps))}
                </div>
              </div>
            ))}
          </div>

          {/* Center: editor */}
          {scenario && (
            <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
              {/* Scenario header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{scenario.name}</h2>
                    <Edit2 size={14} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{scenario.description}</div>
                </div>
                <div style={{ flex: 1 }} />
                <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
                  <InfoPill label="Длительность" value={fmtSec(totalDuration(scenario.steps))} />
                  <InfoPill label="Комнат" value={String(scenario.steps.length)} />
                  <InfoPill label="Статус" value={scenario.status === 'active' ? 'Активный' : 'Неактивный'}
                    valueColor={scenario.status === 'active' ? 'var(--success)' : 'var(--text-secondary)'} />
                </div>
              </div>

              {/* Steps table */}
              <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                      {['#', 'Комната', 'Аудиофайл', 'Громкость', 'Задержка', 'Длительность', ''].map(h => (
                        <th key={h} style={{ padding: '9px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {scenario.steps.map((step, i) => (
                      <tr key={step.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--panel)' : '#fafbfc' }}>
                        <td style={{ padding: '9px 14px', fontWeight: 600, color: 'var(--text-secondary)', width: 30 }}>{step.id}</td>
                        <td style={{ padding: '9px 14px', fontWeight: 500, color: 'var(--text)' }}>{step.roomName}</td>
                        <td style={{ padding: '9px 14px', color: 'var(--text-secondary)', fontSize: 12 }}>{step.file}</td>
                        <td style={{ padding: '9px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 70, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                              <div style={{ width: `${step.volume}%`, height: '100%', background: 'var(--accent)' }} />
                            </div>
                            <span style={{ fontSize: 12 }}>{step.volume}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '9px 14px', fontSize: 13, color: 'var(--text)' }}>{step.delay} сек</td>
                        <td style={{ padding: '9px 14px', fontSize: 13, color: 'var(--text)' }}>{fmtSec(step.duration)}</td>
                        <td style={{ padding: '9px 8px' }}>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>···</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Step controls */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
                <Btn label="+ Добавить шаг" color="var(--accent-light)" textColor="var(--accent)" border="1px solid var(--accent)" icon={<Plus size={13} />} />
                <Btn label="Удалить шаг" color="var(--bg)" textColor="var(--error)" border="1px solid var(--border)" icon={<Trash2 size={13} />} />
                <Btn label="Вверх" color="var(--bg)" textColor="var(--text)" border="1px solid var(--border)" icon={<ChevronUp size={13} />} />
                <Btn label="Вниз" color="var(--bg)" textColor="var(--text)" border="1px solid var(--border)" icon={<ChevronDown size={13} />} />
                <div style={{ flex: 1 }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Общая длительность: <strong style={{ color: 'var(--text)' }}>{fmtSec(totalDuration(scenario.steps))}</strong>
                </span>
              </div>

              {/* Settings */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 14, color: 'var(--text)' }}>Настройки сценария</div>
                  <FieldRow label="Название" value={scenario.name} />
                  <FieldRow label="Описание" value={scenario.description} multiline />
                  <FieldRow label="Режим воспроизведения" value={scenario.playMode} select />
                  <FieldRow label="Повтор" value={scenario.repeat} select />
                </div>
                <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8, padding: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 14, color: 'var(--text)' }}>Дополнительные опции</div>
                  <CheckRow label="Автоматически запускать по расписанию" checked={scenario.autoStart} />
                  <CheckRow label="Останавливать предыдущий сценарий" checked={scenario.stopPrevious} />
                  <CheckRow label="Синхронный перевод (линия 31)" checked={scenario.syncTranslation} />
                  <CheckRow label="Плавное затухание между треками" checked={scenario.crossfade} />
                  <CheckRow label="Показывать уведомления" checked={scenario.notifications} />
                </div>
              </div>
            </div>
          )}

          {/* Right panel: quick launch */}
          <div style={{
            width: 200, background: 'var(--panel)', borderLeft: '1px solid var(--border)',
            padding: 16, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0,
          }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', marginBottom: 4 }}>Быстрый запуск</div>
            <button onClick={() => scenario && onPlay(scenario.id)} style={quickBtn('var(--success)')}>
              <Play size={16} fill="white" /> Запустить сценарий
            </button>
            <button style={quickBtn('var(--accent-light)', 'var(--text)')}>
              <Pause size={16} /> Пауза
            </button>
            <button onClick={() => scenario && onStop(scenario.id)} style={quickBtn('#F4F7FA', 'var(--text)')}>
              <Square size={16} /> Стоп
            </button>
            <button style={{ ...quickBtn('var(--bg)', 'var(--text)'), fontSize: 12, gap: 6 }}>
              <Headphones size={14} /> Тест (первые 10 секунд)
            </button>

            <div style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid var(--border)', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>
              Экспорт / Импорт
            </div>
            <button style={{ ...quickBtn('var(--bg)', 'var(--text)'), gap: 6, fontSize: 12 }}>
              <Upload size={14} /> Экспортировать
            </button>
            <button style={{ ...quickBtn('var(--bg)', 'var(--text)'), gap: 6, fontSize: 12 }}>
              <Download size={14} /> Импортировать
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function quickBtn(bg: string, color = '#fff'): React.CSSProperties {
  return {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '9px 12px', borderRadius: 6, border: '1px solid var(--border)',
    background: bg, color, fontSize: 13, fontWeight: 500, cursor: 'pointer',
    width: '100%',
  };
}

function InfoPill({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ background: 'var(--bg)', borderRadius: 6, padding: '6px 12px', textAlign: 'center' }}>
      <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: valueColor ?? 'var(--text)' }}>{value}</div>
    </div>
  );
}

function FieldRow({ label, value, multiline, select }: { label: string; value: string; multiline?: boolean; select?: boolean }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{label}</label>
      {select ? (
        <select style={inputStyle}><option>{value}</option></select>
      ) : multiline ? (
        <textarea rows={2} defaultValue={value} style={{ ...inputStyle, resize: 'vertical' }} />
      ) : (
        <input defaultValue={value} style={inputStyle} />
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 5,
  fontSize: 13, color: 'var(--text)', background: 'var(--bg)', outline: 'none',
};

function CheckRow({ label, checked }: { label: string; checked: boolean }) {
  const [val, setVal] = useState(checked);
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, cursor: 'pointer', fontSize: 13 }}>
      <input type="checkbox" checked={val} onChange={e => setVal(e.target.checked)} style={{ accentColor: 'var(--accent)', width: 15, height: 15 }} />
      {label}
    </label>
  );
}

function Btn({ label, color, textColor = '#fff', border, icon, onClick }: {
  label: string; color: string; textColor?: string; border?: string; icon?: React.ReactNode; onClick?: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '7px 14px', borderRadius: 5, border: border || 'none',
      background: color, color: textColor, fontSize: 13, fontWeight: 500, cursor: 'pointer',
    }}>{icon}{label}</button>
  );
}

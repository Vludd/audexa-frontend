import { Settings } from 'lucide-react';
import type { SystemStatus } from '../types';

interface Props {
  status: SystemStatus;
}

export default function StatusBar({ status }: Props) {
  return (
    <div style={{
      height: 36,
      background: '#1e2d42',
      borderTop: '1px solid #0d1a2a',
      display: 'flex', alignItems: 'center',
      padding: '0 20px',
      gap: 0, flexShrink: 0,
      fontSize: 12, color: '#8fa8c8',
    }}>
      <span>Аудиоустройство: <strong style={{ color: '#c8d8ec' }}>{status.device}</strong></span>
      <Sep />
      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: status.online ? '#18B968' : '#E53935', display: 'inline-block' }} />
        <strong style={{ color: status.online ? '#18B968' : '#E53935' }}>{status.online ? 'ONLINE' : 'OFFLINE'}</strong>
      </span>
      <Sep />
      <span>Выходы: <strong style={{ color: '#c8d8ec' }}>{status.outputs} (доступно)</strong></span>
      <Sep />
      <span>Частота: <strong style={{ color: '#c8d8ec' }}>{status.sampleRate / 1000} kHz</strong></span>
      <Sep />
      <span>Буфер: <strong style={{ color: '#c8d8ec' }}>{status.bufferSize} samples</strong></span>
      <div style={{ flex: 1 }} />
      <button style={{
        display: 'flex', alignItems: 'center', gap: 5,
        background: 'none', border: 'none', color: '#8fa8c8', cursor: 'pointer', fontSize: 12,
        padding: '4px 8px', borderRadius: 4,
      }}>
        <Settings size={13} />
        Настройки аудио
      </button>
    </div>
  );
}

function Sep() {
  return <span style={{ margin: '0 12px', color: '#3a5070' }}>|</span>;
}

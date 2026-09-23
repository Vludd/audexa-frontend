import type { RoomStatus } from '../types';

const CONFIG: Record<RoomStatus, { color: string; bg: string; label: string }> = {
  playing: { color: '#18B968', bg: '#E6F9EF', label: 'Играет' },
  stopped: { color: '#68768A', bg: '#F4F7FA', label: 'Остановлена' },
  waiting: { color: '#F2B01E', bg: '#FEF8E7', label: 'Ожидание' },
  error: { color: '#E53935', bg: '#FDEAEA', label: 'Ошибка' },
};

export default function StatusBadge({ status }: { status: RoomStatus }) {
  const { color, bg, label } = CONFIG[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 12, fontWeight: 500, color,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {label}
    </span>
  );
}

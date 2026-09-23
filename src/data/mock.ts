import type { Room, Scenario, ScheduleItem, AudioFile, LogEntry, SystemStatus } from '../types';

const ROOM_NAMES = [
  'Зал истории', 'Археология', 'Батырлар', 'Природа', 'Этнография',
  'Традиции', 'Культура', 'Великий Шёлковый путь', 'Озёра Бурабая', 'Флора и фауна',
  'Современность', 'Выдающиеся личности', 'Искусство', 'Ремёсла', 'Духовное наследие',
  'Архитектура', 'Животный мир', 'Степные просторы', 'Геология', 'Туризм',
  'Наука', 'Образование', 'Медицина', 'Спорт', 'Экология',
  'Промышленность', 'Сельское хозяйство', 'Международные связи', 'Будущее', 'Интерактивный зал',
];

const FILES = [
  'history_intro.wav', 'archeology.wav', 'batyr.wav', 'nature.wav', 'ethno.wav',
  'traditions.wav', 'culture.wav', 'silkroad.wav', 'lakes.wav', 'flora_fauna.wav',
  'modern.wav', 'personalities.wav', 'art.wav', 'crafts.wav', 'heritage.wav',
  'architecture.wav', 'wildlife.wav', 'steppe.wav', 'geology.wav', 'tourism.wav',
  'science.wav', 'education.wav', 'medicine.wav', 'sport.wav', 'ecology.wav',
  'industry.wav', 'agriculture.wav', 'international.wav', 'future.wav', 'interactive.wav',
];

const STATUSES: Room['status'][] = ['playing', 'stopped', 'stopped', 'stopped', 'playing', 'stopped', 'stopped', 'stopped', 'stopped', 'stopped'];

export const mockRooms: Room[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: ROOM_NAMES[i],
  status: i === 0 || i === 2 || i === 4 ? 'playing' : i === 11 ? 'error' : 'stopped',
  file: FILES[i],
  volume: i === 0 ? 70 : i === 2 ? 80 : i === 4 ? 65 : 100,
  position: i === 0 ? 84 : i === 2 ? 120 : i === 4 ? 40 : 0,
  duration: 330,
}));

export const syncLine: Room = {
  id: 31,
  name: 'Синхронный перевод',
  status: 'stopped',
  file: 'sync_translation.wav',
  volume: 100,
  position: 0,
  duration: 0,
  isSyncTranslation: true,
};

export const mockScenarios: Scenario[] = [
  {
    id: 1,
    name: 'Экскурсия №1',
    description: 'Основной сценарий для группового посещения',
    status: 'active',
    playMode: 'Последовательно (с задержками)',
    repeat: 'Не повторять',
    autoStart: true,
    stopPrevious: true,
    syncTranslation: false,
    crossfade: true,
    notifications: true,
    steps: [
      { id: 1, roomId: 1, roomName: '01 — Зал истории', file: 'history_intro.wav', volume: 100, delay: 0, duration: 84 },
      { id: 2, roomId: 2, roomName: '02 — Археология', file: 'archeology.wav', volume: 90, delay: 5, duration: 70 },
      { id: 3, roomId: 5, roomName: '05 — Этнография', file: 'ethno.wav', volume: 100, delay: 10, duration: 150 },
      { id: 4, roomId: 7, roomName: '07 — Культура', file: 'culture.wav', volume: 85, delay: 8, duration: 105 },
      { id: 5, roomId: 9, roomName: '09 — Озёра Бурабая', file: 'lakes.wav', volume: 100, delay: 6, duration: 135 },
      { id: 6, roomId: 12, roomName: '12 — Выдающиеся личности', file: 'personalities.wav', volume: 90, delay: 5, duration: 90 },
      { id: 7, roomId: 16, roomName: '16 — Архитектура', file: 'architecture.wav', volume: 100, delay: 8, duration: 110 },
      { id: 8, roomId: 20, roomName: '20 — Туризм', file: 'tourism.wav', volume: 85, delay: 5, duration: 106 },
    ],
  },
  {
    id: 2,
    name: 'Исторический блок',
    description: 'Тематическая экскурсия',
    status: 'active',
    playMode: 'Последовательно',
    repeat: 'Не повторять',
    autoStart: true,
    stopPrevious: true,
    syncTranslation: false,
    crossfade: false,
    notifications: true,
    steps: [
      { id: 1, roomId: 1, roomName: '01 — Зал истории', file: 'history_intro.wav', volume: 100, delay: 0, duration: 84 },
      { id: 2, roomId: 3, roomName: '03 — Батырлар', file: 'batyr.wav', volume: 95, delay: 5, duration: 100 },
      { id: 3, roomId: 8, roomName: '08 — Великий Шёлковый путь', file: 'silkroad.wav', volume: 90, delay: 8, duration: 120 },
    ],
  },
  {
    id: 3,
    name: 'Природа Бурабая',
    description: 'Природное наследие',
    status: 'active',
    playMode: 'Параллельно',
    repeat: 'Не повторять',
    autoStart: false,
    stopPrevious: false,
    syncTranslation: false,
    crossfade: true,
    notifications: false,
    steps: [
      { id: 1, roomId: 4, roomName: '04 — Природа', file: 'nature.wav', volume: 100, delay: 0, duration: 110 },
      { id: 2, roomId: 9, roomName: '09 — Озёра Бурабая', file: 'lakes.wav', volume: 100, delay: 0, duration: 135 },
      { id: 3, roomId: 10, roomName: '10 — Флора и фауна', file: 'flora_fauna.wav', volume: 90, delay: 5, duration: 125 },
    ],
  },
  {
    id: 4,
    name: 'Детская программа',
    description: 'Сокращённая версия',
    status: 'inactive',
    playMode: 'Последовательно',
    repeat: 'Не повторять',
    autoStart: false,
    stopPrevious: true,
    syncTranslation: false,
    crossfade: false,
    notifications: true,
    steps: [
      { id: 1, roomId: 1, roomName: '01 — Зал истории', file: 'history_intro.wav', volume: 80, delay: 0, duration: 60 },
      { id: 2, roomId: 4, roomName: '04 — Природа', file: 'nature.wav', volume: 80, delay: 5, duration: 80 },
    ],
  },
  {
    id: 5,
    name: 'Вечерний режим',
    description: 'Тихий режим',
    status: 'inactive',
    playMode: 'Циклически',
    repeat: 'Повторять',
    autoStart: false,
    stopPrevious: true,
    syncTranslation: false,
    crossfade: true,
    notifications: false,
    steps: [
      { id: 1, roomId: 5, roomName: '05 — Этнография', file: 'ethno.wav', volume: 40, delay: 0, duration: 150 },
    ],
  },
  {
    id: 6,
    name: 'Тестовый сценарий',
    description: 'Для проверки',
    status: 'inactive',
    playMode: 'Последовательно',
    repeat: 'Однократно',
    autoStart: false,
    stopPrevious: false,
    syncTranslation: false,
    crossfade: false,
    notifications: false,
    steps: [
      { id: 1, roomId: 1, roomName: '01 — Зал истории', file: 'history_intro.wav', volume: 100, delay: 0, duration: 10 },
      { id: 2, roomId: 2, roomName: '02 — Археология', file: 'archeology.wav', volume: 100, delay: 2, duration: 10 },
      { id: 3, roomId: 3, roomName: '03 — Батырлар', file: 'batyr.wav', volume: 100, delay: 2, duration: 10 },
    ],
  },
];

export const mockSchedule: ScheduleItem[] = [
  { id: 1, enabled: true, time: '10:00', scenarioId: 1, scenarioName: 'Утренний запуск', days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], repeat: 'daily', nextRun: 'Сегодня 10:00', status: 'active' },
  { id: 2, enabled: true, time: '11:00', scenarioId: 1, scenarioName: 'Экскурсия №1', days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'], repeat: 'weekly', nextRun: 'Сегодня 11:00', status: 'active' },
  { id: 3, enabled: true, time: '13:00', scenarioId: 2, scenarioName: 'Исторический блок', days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'], repeat: 'weekly', nextRun: 'Сегодня 13:00', status: 'active' },
  { id: 4, enabled: true, time: '15:30', scenarioId: 3, scenarioName: 'Природа Бурабая', days: ['Сб', 'Вс'], repeat: 'weekly', nextRun: 'Следующий выходной 27.09.2025 15:30', status: 'active' },
  { id: 5, enabled: true, time: '18:00', scenarioId: 1, scenarioName: 'Закрытие', days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], repeat: 'daily', nextRun: 'Сегодня 18:00', status: 'active' },
  { id: 6, enabled: false, time: '20:00', scenarioId: 5, scenarioName: 'Ночной режим', days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], repeat: 'daily', nextRun: 'Сегодня 20:00', status: 'inactive' },
  { id: 7, enabled: false, time: '09:00', scenarioId: 6, scenarioName: 'Тестовый сценарий', days: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'], repeat: 'once', nextRun: '—', status: 'inactive' },
];

export const mockAudioFiles: AudioFile[] = [
  { id: 1, name: 'Зал истории (вступление)', filename: 'history_intro.wav', format: 'WAV', sampleRate: 48000, duration: 84, size: 8064000 },
  { id: 2, name: 'Археология', filename: 'archeology.wav', format: 'WAV', sampleRate: 48000, duration: 70, size: 6720000 },
  { id: 3, name: 'Батырлар', filename: 'batyr.wav', format: 'WAV', sampleRate: 48000, duration: 100, size: 9600000 },
  { id: 4, name: 'Природа', filename: 'nature.wav', format: 'WAV', sampleRate: 48000, duration: 110, size: 10560000 },
  { id: 5, name: 'Этнография', filename: 'ethno.wav', format: 'WAV', sampleRate: 48000, duration: 150, size: 14400000 },
  { id: 6, name: 'Традиции', filename: 'traditions.wav', format: 'WAV', sampleRate: 48000, duration: 95, size: 9120000 },
  { id: 7, name: 'Культура', filename: 'culture.wav', format: 'WAV', sampleRate: 48000, duration: 105, size: 10080000 },
  { id: 8, name: 'Великий Шёлковый путь', filename: 'silkroad.wav', format: 'WAV', sampleRate: 48000, duration: 120, size: 11520000 },
  { id: 9, name: 'Озёра Бурабая', filename: 'lakes.wav', format: 'WAV', sampleRate: 48000, duration: 135, size: 12960000 },
  { id: 10, name: 'Флора и фауна', filename: 'flora_fauna.wav', format: 'WAV', sampleRate: 48000, duration: 125, size: 12000000 },
  { id: 11, name: 'Современность', filename: 'modern.wav', format: 'WAV', sampleRate: 48000, duration: 88, size: 8448000 },
  { id: 12, name: 'Выдающиеся личности', filename: 'personalities.wav', format: 'WAV', sampleRate: 48000, duration: 90, size: 8640000 },
  { id: 13, name: 'Синхронный перевод', filename: 'sync_translation.wav', format: 'WAV', sampleRate: 48000, duration: 0, size: 0 },
];

export const mockLogs: LogEntry[] = [
  { id: 1, time: '10:00:00', level: 'INFO', message: 'Система запущена' },
  { id: 2, time: '10:00:01', level: 'INFO', message: 'ASIO устройство UMC1820 подключено' },
  { id: 3, time: '10:00:02', level: 'INFO', message: 'Инициализировано 31 аудиолиния' },
  { id: 4, time: '10:00:05', level: 'INFO', message: 'Запущен сценарий «Утренний запуск»' },
  { id: 5, time: '10:00:05', level: 'INFO', message: 'Комната 01 — воспроизведение: history_intro.wav' },
  { id: 6, time: '10:00:05', level: 'INFO', message: 'Комната 03 — воспроизведение: batyr.wav' },
  { id: 7, time: '10:00:05', level: 'INFO', message: 'Комната 05 — воспроизведение: ethno.wav' },
  { id: 8, time: '10:10:15', level: 'WARNING', message: 'ASIO: потеря сигнала, попытка переподключения' },
  { id: 9, time: '10:10:16', level: 'INFO', message: 'ASIO: подключение восстановлено' },
  { id: 10, time: '10:15:00', level: 'INFO', message: 'Комната 12 — ошибка воспроизведения: файл не найден' },
  { id: 11, time: '10:15:00', level: 'ERROR', message: 'Комната 12 (Выдающиеся личности): personalities.wav — файл недоступен' },
  { id: 12, time: '10:20:00', level: 'INFO', message: 'Запланировано расписание: 11:00 — Экскурсия №1' },
  { id: 13, time: '10:24:00', level: 'INFO', message: 'Статус системы: все основные линии в норме' },
];

export const mockSystemStatus: SystemStatus = {
  device: 'UMC1820 (ASIO)',
  online: true,
  outputs: 32,
  sampleRate: 48000,
  bufferSize: 256,
};

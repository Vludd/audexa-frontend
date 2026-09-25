import {
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react"
import { useMemo } from "react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { AudioFile } from "@/types"

interface Props {
  file: AudioFile | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  onSeek: (value: number) => void
  onVolumeChange: (value: number) => void
  onSkip: (seconds: number) => void
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00"
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`
}

export default function AudioPlayer({
  file,
  isPlaying,
  currentTime,
  duration,
  volume,
  onPlay,
  onPause,
  onStop,
  onSeek,
  onVolumeChange,
  onSkip,
}: Props) {
  const progress = useMemo(() => {
    if (!duration || !Number.isFinite(duration)) {
      return 0
    }

    return Math.min((currentTime / duration) * 100, 100)
  }, [currentTime, duration])

  if (!file) {
    return (
      <div className="border-t bg-background px-5 py-4">
        <div className="flex min-h-16 items-center justify-center text-sm text-muted-foreground">
          Выберите аудиофайл для прослушивания
        </div>
      </div>
    )
  }

  const actualDuration = duration || file.duration || 0

  return (
    <div className="border-t bg-background px-5 py-4">
      <div className="flex items-center gap-4">
        {/* Play / Pause */}
        <Button
          variant="default"
          size="icon"
          className="size-10 shrink-0 rounded-full"
          onClick={isPlaying ? onPause : onPlay}
          title={isPlaying ? "Пауза" : "Воспроизвести"}
        >
          {isPlaying ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4 translate-x-px" />
          )}
        </Button>

        {/* Stop */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="shrink-0"
          title="Остановить"
          onClick={onStop}
        >
          <Square className="size-4" />
        </Button>

        {/* File information + timeline */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">
                {file.name}
              </div>

              <div className="text-xs text-muted-foreground">
                {file.format} · {file.sampleRate / 1000} kHz
              </div>
            </div>

            <div className="shrink-0 font-mono text-xs text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(actualDuration)}
            </div>
          </div>

          <Slider
            trackClassName="bg-muted-foreground/25"
            value={[Math.min(currentTime, actualDuration)]}
            max={actualDuration || 1}
            step={0.1}
            onValueChange={(value) => {
              const v = Array.isArray(value) ? value[0] : value
              onSeek(v ?? 0)
            }}
            aria-label="Позиция воспроизведения"
          />

          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>{Math.round(progress)}%</span>

            <span>
              {file.size
                ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
                : ""}
            </span>
          </div>
        </div>

        {/* Skip controls */}
        <div className="hidden items-center gap-1 md:flex">
          <Button
            variant="ghost"
            size="icon-sm"
            title="Назад 10 секунд"
            onClick={() => onSkip(-10)}
          >
            <RotateCcw className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            title="Вперёд 10 секунд"
            onClick={() => onSkip(10)}
          >
            <RotateCw className="size-4" />
          </Button>
        </div>

        {/* Volume */}
        <div className="hidden w-28 items-center gap-2 lg:flex">
          <Button
            variant="ghost"
            size="icon-sm"
            title={volume === 0 ? "Включить звук" : "Выключить звук"}
            onClick={() => onVolumeChange(volume === 0 ? 1 : 0)}
          >
            {volume === 0 ? (
              <VolumeX className="size-4" />
            ) : (
              <Volume2 className="size-4" />
            )}
          </Button>

          <Slider
            trackClassName="bg-muted-foreground/25"
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={(value) => {
              const v = Array.isArray(value) ? value[0] : value
              onVolumeChange(v ?? 0)
            }}
            aria-label="Громкость"
          />
        </div>

        
      </div>
    </div>
  )
}

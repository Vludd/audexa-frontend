import { useRef } from "react"
import { Upload } from "lucide-react"

import type { AudioFile } from "@/types"

import Header from "@/components/Header"
import AudioToolbar from "@/components/audio/AudioToolbar"
import AudioTable from "@/components/audio/AudioTable"
import AudioPlayer from "@/components/audio/AudioPlayer"

import { useAudioFiles } from "@/hooks/useAudioFiles"

interface Props {
  files: AudioFile[]
}

export default function AudioFiles({
  files: initialFiles,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const audio = useAudioFiles({
    initialFiles,
  })

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(
      event.target.files ?? [],
    )

    audio.addFiles(selectedFiles)

    event.target.value = ""
  }

  const handleRename = (id: number) => {
    const file = audio.files.find(
      (item) => item.id === id,
    )

    if (!file) {
      return
    }

    const name = window.prompt(
      "Новое название файла",
      file.name,
    )

    if (name !== null) {
      audio.renameFile(id, name)
    }
  }

  const handleDelete = (id: number) => {
    const file = audio.files.find(
      (item) => item.id === id,
    )

    if (!file) {
      return
    }

    const confirmed = window.confirm(
      `Удалить «${file.name}»?`,
    )

    if (!confirmed) {
      return
    }

    audio.deleteFile(id)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* Header */}
      <Header
        title="Аудиофайлы"
        subtitle="Управление звуковыми файлами системы"
      />

      {/* Toolbar */}
      <AudioToolbar
        query={audio.query}
        onQueryChange={audio.setQuery}
        onAdd={handleImportClick}
        selectedCount={audio.selectedIds.length}
        onDeleteSelected={() => {
          const count = audio.selectedIds.length

          const confirmed = window.confirm(
            `Удалить выбранные файлы (${count})?`,
          )

          if (!confirmed) {
            return
          }

          audio.deleteSelectedFiles()
        }}
      />

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Scrollable list area */}
      <div
        className="relative min-h-0 flex-1 overflow-auto p-4"
        onDragEnter={audio.handleDragEnter}
        onDragOver={audio.handleDragOver}
        onDragLeave={audio.handleDragLeave}
        onDrop={audio.handleDrop}
      >
        {audio.isDragging && (
          <div className="absolute inset-4 z-10 flex items-center justify-center rounded-lg border-2 border-dashed border-primary bg-background/95 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 text-primary">
              <Upload className="size-6" />

              <span className="font-medium">
                Отпустите файлы для импорта
              </span>

              <span className="text-sm text-muted-foreground">
                WAV, MP3, FLAC, OGG, AAC, M4A
              </span>
            </div>
          </div>
        )}

        <AudioTable
          files={audio.filteredFiles}
          selected={audio.selectedId}
          selectedIds={audio.selectedIds}
          currentFileId={audio.currentFileId}
          isPlaying={audio.isPlaying}
          onSelect={audio.selectFile}
          onToggleSelection={audio.toggleSelection}
          onToggleSelectAll={audio.toggleSelectAll}
          onTogglePlay={audio.togglePlay}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      </div>

      {/* Fixed bottom player */}
      <div className="shrink-0 border-t bg-background">
        <AudioPlayer
          file={audio.currentFile}
          isPlaying={audio.isPlaying}
          currentTime={audio.currentTime}
          duration={audio.duration}
          volume={audio.volume}
          onPlay={audio.playCurrent}
          onPause={audio.pause}
          onStop={audio.stop}
          onSeek={audio.seek}
          onVolumeChange={audio.setVolume}
          onSkip={audio.skip}
        />
      </div>
    </div>
  )
}
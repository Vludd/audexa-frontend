import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import type { AudioFile } from "@/types"

const SUPPORTED_FORMATS = [
  "wav",
  "mp3",
  "flac",
  "ogg",
  "aac",
  "m4a",
]

interface UseAudioFilesOptions {
  initialFiles: AudioFile[]
}

interface AudioMetadata {
  duration: number
  sampleRate: number
}

export function useAudioFiles({
  initialFiles,
}: UseAudioFilesOptions) {
  /*
   * ------------------------------------------------------------
   * Library state
   * ------------------------------------------------------------
   */

  const [files, setFiles] = useState<AudioFile[]>(initialFiles)

  const [query, setQuery] = useState("")

  const [selectedId, setSelectedId] = useState<number | null>(
    null,
  )

  const [selectedIds, setSelectedIds] = useState<number[]>([])

  /*
   * ------------------------------------------------------------
   * Import / Drag & Drop
   * ------------------------------------------------------------
   */

  const [isDragging, setIsDragging] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const dragCounterRef = useRef(0)

  /*
   * ------------------------------------------------------------
   * Player state
   * ------------------------------------------------------------
   */

  const [currentFileId, setCurrentFileId] = useState<
    number | null
  >(null)

  const [isPlaying, setIsPlaying] = useState(false)

  const [currentTime, setCurrentTime] = useState(0)

  const [duration, setDuration] = useState(0)

  const [volume, setVolumeState] = useState(1)

  /*
   * ------------------------------------------------------------
   * Refs
   * ------------------------------------------------------------
   */

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const objectUrlsRef = useRef<Map<number, string>>(
    new Map(),
  )

  /*
   * ------------------------------------------------------------
   * Derived state
   * ------------------------------------------------------------
   */

  const selectedFile = useMemo(
    () =>
      files.find((file) => file.id === selectedId) ?? null,
    [files, selectedId],
  )

  const currentFile = useMemo(
    () =>
      files.find((file) => file.id === currentFileId) ?? null,
    [files, currentFileId],
  )

  const filteredFiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return files
    }

    return files.filter(
      (file) =>
        file.name.toLowerCase().includes(normalizedQuery) ||
        file.filename.toLowerCase().includes(normalizedQuery),
    )
  }, [files, query])

  /*
   * ------------------------------------------------------------
   * Audio element initialization
   * ------------------------------------------------------------
   */

  const ensureAudioElement = useCallback(() => {
    if (audioRef.current) {
      return audioRef.current
    }

    const audio = new Audio()

    audio.preload = "metadata"
    audio.volume = volume

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime)
    }

    audio.onloadedmetadata = () => {
      setDuration(
        Number.isFinite(audio.duration)
          ? audio.duration
          : 0,
      )
    }

    audio.onplay = () => {
      setIsPlaying(true)
    }

    audio.onpause = () => {
      setIsPlaying(false)
    }

    audio.onended = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    audio.onerror = () => {
      setIsPlaying(false)
    }

    audioRef.current = audio

    return audio
  }, [volume])

  /*
   * ------------------------------------------------------------
   * Player
   * ------------------------------------------------------------
   */

  const play = useCallback(
    async (fileId: number) => {
      const file = files.find((item) => item.id === fileId)

      if (!file) {
        return
      }

      const source = objectUrlsRef.current.get(fileId)

      if (!source) {
        console.warn(
          `Audio source is not available for "${file.filename}".`,
        )

        return
      }

      const audio = ensureAudioElement()

      if (currentFileId !== fileId) {
        audio.pause()

        audio.src = source
        audio.currentTime = 0

        setCurrentFileId(fileId)
        setCurrentTime(0)
        setDuration(file.duration || 0)
      }

      try {
        await audio.play()
      } catch (error) {
        console.error("Failed to play audio:", error)
        setIsPlaying(false)
      }
    },
    [
      currentFileId,
      ensureAudioElement,
      files,
    ],
  )

  const playCurrent = useCallback(async () => {
    if (!currentFileId) {
      return
    }

    await play(currentFileId)
  }, [currentFileId, play])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const stop = useCallback(() => {
    const audio = audioRef.current

    if (!audio) {
      return
    }

    audio.pause()
    audio.currentTime = 0

    setCurrentTime(0)
    setIsPlaying(false)
  }, [])

  const togglePlay = useCallback(
    async (fileId: number) => {
      if (currentFileId === fileId && isPlaying) {
        pause()
        return
      }

      await play(fileId)
    },
    [currentFileId, isPlaying, pause, play],
  )

  const seek = useCallback(
    (time: number) => {
      const audio = audioRef.current

      if (!audio) {
        return
      }

      const maxTime = Number.isFinite(audio.duration)
        ? audio.duration
        : duration

      const nextTime = Math.max(
        0,
        Math.min(time, maxTime || 0),
      )

      audio.currentTime = nextTime
      setCurrentTime(nextTime)
    },
    [duration],
  )

  const skip = useCallback(
    (seconds: number) => {
      const audio = audioRef.current

      if (!audio) {
        return
      }

      seek(audio.currentTime + seconds)
    },
    [seek],
  )

  const setVolume = useCallback((value: number) => {
    const normalizedValue = Math.max(
      0,
      Math.min(value, 1),
    )

    setVolumeState(normalizedValue)

    if (audioRef.current) {
      audioRef.current.volume = normalizedValue
    }
  }, [])

  /*
   * ------------------------------------------------------------
   * Single selection
   * ------------------------------------------------------------
   */

  const selectFile = useCallback((id: number) => {
    setSelectedId(id)
  }, [])

  /*
   * ------------------------------------------------------------
   * Multi selection
   * ------------------------------------------------------------
   */

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter(
            (selectedId) => selectedId !== id,
          )
        : [...current, id],
    )
  }, [])

  const toggleSelectAll = useCallback(() => {
    const visibleIds = filteredFiles.map(
      (file) => file.id,
    )

    setSelectedIds((current) => {
      const allSelected =
        visibleIds.length > 0 &&
        visibleIds.every((id) =>
          current.includes(id),
        )

      if (allSelected) {
        return current.filter(
          (id) => !visibleIds.includes(id),
        )
      }

      return Array.from(
        new Set([
          ...current,
          ...visibleIds,
        ]),
      )
    })
  }, [filteredFiles])

  const clearSelection = useCallback(() => {
    setSelectedIds([])
  }, [])

  /*
   * ------------------------------------------------------------
   * Import
   * ------------------------------------------------------------
   */

  const addFiles = useCallback(
    async (incomingFiles: File[]) => {
      if (!incomingFiles.length) {
        return
      }

      setIsImporting(true)

      try {
        const importedFiles: AudioFile[] = []

        for (const sourceFile of incomingFiles) {
          const extension =
            sourceFile.name
              .split(".")
              .pop()
              ?.toLowerCase() ?? ""

          if (!SUPPORTED_FORMATS.includes(extension)) {
            console.warn(
              `Unsupported audio format: ${sourceFile.name}`,
            )

            continue
          }

          try {
            const metadata =
              await readAudioMetadata(sourceFile)

            const id =
              Date.now() +
              Math.floor(Math.random() * 100000)

            const objectUrl =
              URL.createObjectURL(sourceFile)

            objectUrlsRef.current.set(
              id,
              objectUrl,
            )

            importedFiles.push({
              id,

              name: sourceFile.name.replace(
                /\.[^/.]+$/,
                "",
              ),

              filename: sourceFile.name,

              format: extension.toUpperCase(),

              sampleRate: metadata.sampleRate,

              duration: Math.round(
                metadata.duration,
              ),

              size: sourceFile.size,
            })
          } catch (error) {
            console.error(
              `Failed to process "${sourceFile.name}"`,
              error,
            )
          }
        }

        if (importedFiles.length > 0) {
          setFiles((current) => [
            ...current,
            ...importedFiles,
          ])
        }
      } finally {
        setIsImporting(false)
      }
    },
    [],
  )

  /*
   * ------------------------------------------------------------
   * Rename
   * ------------------------------------------------------------
   */

  const renameFile = useCallback(
    (id: number, name: string) => {
      const normalizedName = name.trim()

      if (!normalizedName) {
        return
      }

      setFiles((current) =>
        current.map((file) =>
          file.id === id
            ? {
                ...file,
                name: normalizedName,
              }
            : file,
        ),
      )
    },
    [],
  )

  /*
   * ------------------------------------------------------------
   * Delete
   * ------------------------------------------------------------
   */

  const deleteFile = useCallback(
    (id: number) => {
      if (currentFileId === id) {
        stop()

        if (audioRef.current) {
          audioRef.current.removeAttribute("src")
          audioRef.current.load()
        }

        setCurrentFileId(null)
        setDuration(0)
        setCurrentTime(0)
      }

      const objectUrl =
        objectUrlsRef.current.get(id)

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
        objectUrlsRef.current.delete(id)
      }

      setFiles((current) =>
        current.filter((file) => file.id !== id),
      )

      setSelectedId((current) =>
        current === id ? null : current,
      )

      setSelectedIds((current) =>
        current.filter(
          (selectedId) => selectedId !== id,
        ),
      )
    },
    [currentFileId, stop],
  )

  const deleteSelectedFiles = useCallback(() => {
    if (!selectedIds.length) {
      return
    }

    const idsToDelete = new Set(selectedIds)

    if (
      currentFileId !== null &&
      idsToDelete.has(currentFileId)
    ) {
      stop()

      if (audioRef.current) {
        audioRef.current.removeAttribute("src")
        audioRef.current.load()
      }

      setCurrentFileId(null)
      setCurrentTime(0)
      setDuration(0)
    }

    selectedIds.forEach((id) => {
      const objectUrl =
        objectUrlsRef.current.get(id)

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
        objectUrlsRef.current.delete(id)
      }
    })

    setFiles((current) =>
      current.filter(
        (file) => !idsToDelete.has(file.id),
      ),
    )

    setSelectedId((current) =>
      current !== null &&
      idsToDelete.has(current)
        ? null
        : current,
    )

    setSelectedIds([])
  }, [currentFileId, selectedIds, stop])

  /*
   * ------------------------------------------------------------
   * Drag & Drop
   * ------------------------------------------------------------
   */

  const handleDragEnter = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      event.stopPropagation()

      dragCounterRef.current += 1
      setIsDragging(true)
    },
    [],
  )

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      event.stopPropagation()
    },
    [],
  )

  const handleDragLeave = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      event.stopPropagation()

      dragCounterRef.current -= 1

      if (dragCounterRef.current <= 0) {
        dragCounterRef.current = 0
        setIsDragging(false)
      }
    },
    [],
  )

  const handleDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault()
      event.stopPropagation()

      dragCounterRef.current = 0
      setIsDragging(false)

      const droppedFiles = Array.from(
        event.dataTransfer.files,
      )

      await addFiles(droppedFiles)
    },
    [addFiles],
  )

  /*
   * ------------------------------------------------------------
   * Cleanup
   * ------------------------------------------------------------
   */

  useEffect(() => {
    return () => {
      audioRef.current?.pause()

      objectUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url)
      })

      objectUrlsRef.current.clear()
    }
  }, [])

  /*
   * ------------------------------------------------------------
   * Return
   * ------------------------------------------------------------
   */

  return {
    /*
     * Library
     */
    files,
    filteredFiles,

    query,
    setQuery,

    selectedId,
    selectedFile,
    selectFile,

    /*
     * Multi selection
     */
    selectedIds,
    toggleSelection,
    toggleSelectAll,
    clearSelection,

    /*
     * Import
     */
    isDragging,
    isImporting,
    addFiles,

    /*
     * Player
     */
    currentFileId,
    currentFile,

    isPlaying,
    currentTime,
    duration,
    volume,

    play,
    playCurrent,
    togglePlay,
    pause,
    stop,
    seek,
    skip,
    setVolume,

    /*
     * CRUD
     */
    renameFile,
    deleteFile,
    deleteSelectedFiles,

    /*
     * Drag & Drop
     */
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  }
}

/*
 * ============================================================
 * Audio metadata
 * ============================================================
 */

async function readAudioMetadata(
  file: File,
): Promise<AudioMetadata> {
  const arrayBuffer = await file.arrayBuffer()

  const audioContext = new AudioContext()

  try {
    const audioBuffer =
      await audioContext.decodeAudioData(
        arrayBuffer,
      )

    return {
      duration: audioBuffer.duration,
      sampleRate: audioBuffer.sampleRate,
    }
  } finally {
    await audioContext.close()
  }
}
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

interface UseFilePickerOptions {
  /** Расширения вида ".mp3". MIME-типы лучше не добавлять (см. комментарий ниже). */
  accept: string[]
  multiple?: boolean
  onPick: (files: File[]) => void
}

/*
 * Резолвится после того, как браузер реально отрисовал текущее
 * состояние. Первый rAF срабатывает ДО отрисовки кадра, второй —
 * в начале следующего, то есть когда предыдущий кадр уже показан.
 */
function nextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

export function useFilePicker({
  accept,
  multiple = false,
  onPick,
}: UseFilePickerOptions) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Синхронный флаг: state обновляется асинхронно,
  // а двойной клик должен отсекаться мгновенно.
  const busyRef = useRef(false)

  const [isOpening, setIsOpening] = useState(false)

  const onPickRef = useRef(onPick)

  useEffect(() => {
    onPickRef.current = onPick
  }, [onPick])

  const finish = useCallback(() => {
    busyRef.current = false
    setIsOpening(false)
  }, [])

  useEffect(() => {
    const input = inputRef.current

    if (!input) {
      return
    }

    // Выбор файлов.
    const handleChange = () => {
      const files = Array.from(input.files ?? [])

      // Сбрасываем, чтобы повторный выбор того же файла тоже дал change.
      input.value = ""

      finish()

      if (files.length > 0) {
        onPickRef.current(files)
      }
    }

    // Диалог закрыт без выбора (Chromium 113+, т.е. любой актуальный WebView2).
    const handleCancel = () => finish()

    input.addEventListener("change", handleChange)
    input.addEventListener("cancel", handleCancel)

    return () => {
      input.removeEventListener("change", handleChange)
      input.removeEventListener("cancel", handleCancel)

      busyRef.current = false
    }
  }, [finish])

  const open = useCallback(async () => {
    if (busyRef.current) {
      return
    }

    busyRef.current = true
    setIsOpening(true)

    // Даём React закоммитить спиннер, а браузеру — показать его.
    // Нативный диалог может заблокировать UI-поток на время создания,
    // и без этого спиннер не успевает появиться.
    await nextPaint()

    // За время ожидания компонент мог размонтироваться.
    if (!busyRef.current) {
      return
    }

    try {
      inputRef.current?.click()
    } catch (error) {
      console.error("Failed to open file picker:", error)
      finish()
    }
  }, [finish])

  const inputProps = {
    ref: inputRef,
    type: "file" as const,
    multiple,
    /*
     * Только расширения. MIME-типы (audio/mpeg и т.п.) Chromium на Windows
     * резолвит через реестр, и это может заметно тормозить открытие диалога.
     */
    accept: accept.join(","),
    className: "hidden",
  }

  return {
    open,
    isOpening,
    inputProps,
  }
}
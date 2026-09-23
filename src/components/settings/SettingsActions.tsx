import { Button } from "@/components/ui/button"

interface Props {
  onSave?: () => void
  onReset?: () => void
}

export default function SettingsActions({
  onSave,
  onReset,
}: Props) {
  return (
    <div className="flex gap-2">
      <Button variant="success" onClick={onSave}>
        Сохранить настройки
      </Button>

      <Button variant="outline" onClick={onReset}>
        Сбросить по умолчанию
      </Button>
    </div>
  )
}
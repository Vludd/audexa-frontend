import { Button } from "@/components/ui/button"
import { cn } from "cn"

export type RoomFilter = "all" | "playing" | "waiting" | "stopped" | "error"

interface Props {
  value: RoomFilter
  counts: Record<RoomFilter, number>
  onChange: (value: RoomFilter) => void
}

const filters: {
  value: RoomFilter
  label: string
  dotClass: string
}[] = [
  {
    value: "all",
    label: "Все",
    dotClass: "bg-primary",
  },
  {
    value: "playing",
    label: "Играют",
    dotClass: "bg-emerald-500",
  },
  {
    value: "waiting",
    label: "Ожидание",
    dotClass: "bg-amber-500",
  },
  {
    value: "stopped",
    label: "Остановлены",
    dotClass: "bg-muted-foreground",
  },
  {
    value: "error",
    label: "Ошибки",
    dotClass: "bg-destructive",
  },
]

export default function RoomFilters({
  value,
  counts,
  onChange,
}: Props) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {filters.map((filter) => {
        const active = value === filter.value

        return (
          <Button
            key={filter.value}
            type="button"
            size="sm"
            variant={active ? "secondary" : "outline"}
            onClick={() => onChange(filter.value)}
            className={cn(
              "rounded-full",
              active &&
                filter.value === "playing" &&
                "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
              active &&
                filter.value === "waiting" &&
                "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100",
              active &&
                filter.value === "error" &&
                "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
            )}
          >
            {filter.value !== "all" && (
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  active ? "bg-current" : filter.dotClass,
                )}
              />
            )}

            {filter.label} ({counts[filter.value]})
          </Button>
        )
      })}
    </div>
  )
}
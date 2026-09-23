import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function LineMappingSettings() {
  const rooms = Array.from({ length: 30 }, (_, i) => i + 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">
          Карта линий (логическая → физическая)
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-[280px] overflow-auto">
          {rooms.map((room) => {
            const roomNumber = String(room).padStart(2, "0")

            return (
              <div
                key={room}
                className="flex items-center justify-between border-b px-3 py-1.5 text-sm even:bg-muted/30"
              >
                <span>Комната {roomNumber}</span>

                <span className="text-muted-foreground">→</span>

                <Select defaultValue={`OUT ${roomNumber}`}>
                  <SelectTrigger className="h-7 w-20">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={`OUT ${roomNumber}`}>
                      OUT {roomNumber}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )
          })}

          <div className="flex items-center justify-between bg-primary/10 px-3 py-1.5 text-sm">
            <span className="font-semibold text-primary">
              Синхронный перевод
            </span>

            <span className="text-muted-foreground">→</span>

            <Select defaultValue="OUT 31">
              <SelectTrigger className="h-7 w-20 border-primary">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="OUT 31">OUT 31</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
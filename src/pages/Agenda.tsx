import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, addDays, startOfWeek, isSameDay, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAllReservations } from "@/hooks/useReservations";

const typeColors: Record<string, string> = {
  sala: "bg-primary",
  coworking: "bg-accent",
  auditorio: "bg-info",
  laboratorio: "bg-success",
};

const typeBgColors: Record<string, string> = {
  sala: "bg-primary/10 border-primary/30",
  coworking: "bg-accent/10 border-accent/30",
  auditorio: "bg-info/10 border-info/30",
  laboratorio: "bg-success/10 border-success/30",
};

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"day" | "week">("day");

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  
  // Calcular range de datas para buscar reservas
  const dateRange = useMemo(() => {
    if (viewMode === "day") {
      return {
        start: startOfDay(selectedDate),
        end: endOfDay(selectedDate),
      };
    } else {
      return {
        start: startOfDay(weekStart),
        end: endOfDay(addDays(weekStart, 6)),
      };
    }
  }, [selectedDate, viewMode, weekStart]);

  const { data: reservations, isLoading } = useAllReservations(
    dateRange.start,
    dateRange.end
  );

  // Converter reservas do banco para formato usado na UI
  const formattedReservations = useMemo(() => {
    if (!reservations) return [];
    
    return reservations.map((res) => ({
      id: res.id,
      spaceName: res.spaces?.nome || "Espaço desconhecido",
      spaceType: res.spaces?.tipo || "sala",
      startTime: format(new Date(res.data_inicio), "HH:mm"),
      endTime: format(new Date(res.data_fim), "HH:mm"),
      date: new Date(res.data_inicio),
      status: res.status,
    }));
  }, [reservations]);

  const filteredReservations = formattedReservations.filter((res) =>
    viewMode === "day"
      ? isSameDay(res.date, selectedDate)
      : weekDays.some((day) => isSameDay(res.date, day))
  );

  const getReservationsForDay = (date: Date) =>
    formattedReservations.filter((res) => isSameDay(res.date, date));

  return (
    <Layout>
      {/* Header */}
      <section className="pt-12 pb-8 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                <span className="text-primary">Agenda</span> de Reservas
              </h1>
              <p className="text-lg text-muted-foreground">
                Visualize a disponibilidade dos espaços e planeje suas reservas.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("day")}
              >
                Dia
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
              >
                Semana
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Calendar Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border/50 p-4 sticky top-24">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={ptBR}
                  className="rounded-md"
                />

                {/* Legend */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <h4 className="font-semibold text-sm text-foreground mb-3">Legenda</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground">Salas de Reunião</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-accent" />
                      <span className="text-sm text-muted-foreground">Coworking</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-info" />
                      <span className="text-sm text-muted-foreground">Auditórios</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success" />
                      <span className="text-sm text-muted-foreground">Laboratórios</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule View */}
            <div className="lg:col-span-3">
              {/* Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedDate(addDays(selectedDate, viewMode === "day" ? -1 : -7))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <h2 className="text-xl font-bold text-foreground">
                  {viewMode === "day"
                    ? format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })
                    : `${format(weekStart, "d MMM", { locale: ptBR })} - ${format(addDays(weekStart, 6), "d MMM", { locale: ptBR })}`}
                </h2>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSelectedDate(addDays(selectedDate, viewMode === "day" ? 1 : 7))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Day View */}
              {viewMode === "day" && (
                <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                  {isLoading ? (
                    <div className="p-6 space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      ))}
                    </div>
                  ) : filteredReservations.length > 0 ? (
                    <div className="divide-y divide-border/50">
                      {filteredReservations.map((reservation) => (
                        <div
                          key={reservation.id}
                          className={cn(
                            "p-4 border-l-4 hover:bg-muted/50 transition-colors",
                            typeColors[reservation.spaceType].replace("bg-", "border-l-")
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {reservation.spaceName}
                              </h3>
                              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {reservation.startTime} - {reservation.endTime}
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  Hub de Inovação
                                </div>
                              </div>
                            </div>
                            <Badge
                              className={cn(
                                "capitalize",
                                typeBgColors[reservation.spaceType]
                              )}
                            >
                              {reservation.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Nenhuma reserva neste dia
                      </h3>
                      <p className="text-muted-foreground">
                        Todos os espaços estão disponíveis.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Week View */}
              {viewMode === "week" && (
                <>
                  {isLoading ? (
                    <div className="grid grid-cols-7 gap-2">
                      {weekDays.map((day) => (
                        <div
                          key={day.toISOString()}
                          className="bg-card rounded-xl border border-border/50 p-3 min-h-[200px]"
                        >
                          <Skeleton className="h-6 w-12 mx-auto mb-3" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-7 gap-2">
                      {weekDays.map((day) => {
                        const dayReservations = getReservationsForDay(day);
                        const isToday = isSameDay(day, new Date());
                        const isSelected = isSameDay(day, selectedDate);

                        return (
                          <div
                            key={day.toISOString()}
                            className={cn(
                              "bg-card rounded-xl border border-border/50 p-3 min-h-[200px] cursor-pointer transition-all",
                              isSelected && "ring-2 ring-primary",
                              isToday && "bg-primary/5"
                            )}
                            onClick={() => {
                              setSelectedDate(day);
                              setViewMode("day");
                            }}
                          >
                            <div className="text-center mb-3">
                              <p className="text-xs text-muted-foreground uppercase">
                                {format(day, "EEE", { locale: ptBR })}
                              </p>
                              <p
                                className={cn(
                                  "text-lg font-bold",
                                  isToday ? "text-primary" : "text-foreground"
                                )}
                              >
                                {format(day, "d")}
                              </p>
                            </div>

                            <div className="space-y-1">
                              {dayReservations.slice(0, 3).map((res) => (
                                <div
                                  key={res.id}
                                  className={cn(
                                    "text-xs p-1.5 rounded truncate",
                                    typeBgColors[res.spaceType]
                                  )}
                                >
                                  {res.startTime} {res.spaceName}
                                </div>
                              ))}
                              {dayReservations.length > 3 && (
                                <p className="text-xs text-muted-foreground text-center">
                                  +{dayReservations.length - 3} mais
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

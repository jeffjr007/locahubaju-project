import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  CalendarIcon, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Shield,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAllReservationsForReports } from "@/hooks/useReservations";
import { useReportStats } from "@/hooks/useReports";
import { useAllSpaces } from "@/hooks/useSpaces";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#22c55e", "#f97316", "#3b82f6", "#ef4444"];

export default function AdminRelatorios() {
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: isLoadingAdmin } = useIsAdmin();
  const { data: spaces } = useAllSpaces();

  const [periodFilter, setPeriodFilter] = useState<"month" | "year" | "custom">("month");
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));

  const { data: reservations, isLoading: isLoadingReservations } = useAllReservationsForReports(
    startDate,
    endDate
  );
  const { data: stats, isLoading: isLoadingStats } = useReportStats(startDate, endDate);

  // Redirecionar se não for admin
  if (!isLoadingAdmin && !isAdmin) {
    navigate("/");
    return null;
  }

  const handlePeriodChange = (value: "month" | "year" | "custom") => {
    setPeriodFilter(value);
    const now = new Date();
    
    if (value === "month") {
      setStartDate(startOfMonth(now));
      setEndDate(endOfMonth(now));
    } else if (value === "year") {
      setStartDate(startOfYear(now));
      setEndDate(endOfYear(now));
    }
  };

  // Dados para gráfico de reservas por status
  const statusChartData = useMemo(() => {
    if (!stats) return [];
    
    return [
      { name: "Confirmadas", value: stats.confirmedReservations, color: COLORS[0] },
      { name: "Pendentes", value: stats.pendingReservations, color: COLORS[2] },
      { name: "Canceladas", value: stats.cancelledReservations, color: COLORS[3] },
    ].filter(item => item.value > 0);
  }, [stats]);

  // Dados para gráfico de ocupação por espaço
  const occupancyBySpace = useMemo(() => {
    if (!reservations || !spaces) return [];

    const spaceCounts: Record<string, number> = {};
    
    reservations.forEach((res) => {
      if (res.status === "confirmada" && res.spaces?.nome) {
        spaceCounts[res.spaces.nome] = (spaceCounts[res.spaces.nome] || 0) + 1;
      }
    });

    return Object.entries(spaceCounts)
      .map(([nome, count]) => ({ nome, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [reservations, spaces]);

  // Dados para gráfico de reservas por tipo de espaço
  const reservationsByType = useMemo(() => {
    if (!reservations) return [];

    const typeCounts: Record<string, number> = {};
    
    reservations.forEach((res) => {
      if (res.status === "confirmada" && res.spaces?.tipo) {
        typeCounts[res.spaces.tipo] = (typeCounts[res.spaces.tipo] || 0) + 1;
      }
    });

    return Object.entries(typeCounts).map(([tipo, count]) => ({
      tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1),
      count,
    }));
  }, [reservations]);

  if (isLoadingAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="pt-12 pb-8 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-8 h-8 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  <span className="text-primary">Relatórios</span>
                </h1>
              </div>
              <p className="text-lg text-muted-foreground">
                Análise e estatísticas do sistema
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={periodFilter} onValueChange={(value: any) => handlePeriodChange(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Este Mês</SelectItem>
                  <SelectItem value="year">Este Ano</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {periodFilter === "custom" && (
              <>
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[200px] justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setStartDate(date)}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[200px] justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => date && setEndDate(date)}
                        locale={ptBR}
                        disabled={(date) => date < startDate}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}

            <div className="text-sm text-muted-foreground">
              {startDate && endDate && (
                <span>
                  {format(startDate, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                  {format(endDate, "dd/MM/yyyy", { locale: ptBR })}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {isLoadingStats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalReservations}</div>
                  <p className="text-xs text-muted-foreground">
                    No período selecionado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    {stats.confirmedReservations}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalReservations > 0
                      ? Math.round((stats.confirmedReservations / stats.totalReservations) * 100)
                      : 0}% do total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
                  <XCircle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    {stats.cancelledReservations}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalReservations > 0
                      ? Math.round((stats.cancelledReservations / stats.totalReservations) * 100)
                      : 0}% do total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Usuários</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeSpaces} espaços ativos
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Reservas por Status */}
            <Card>
              <CardHeader>
                <CardTitle>Reservas por Status</CardTitle>
                <CardDescription>Distribuição de reservas no período</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingStats ? (
                  <Skeleton className="h-64" />
                ) : statusChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Nenhum dado disponível
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reservas por Tipo de Espaço */}
            <Card>
              <CardHeader>
                <CardTitle>Reservas por Tipo de Espaço</CardTitle>
                <CardDescription>Distribuição por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingReservations ? (
                  <Skeleton className="h-64" />
                ) : reservationsByType.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={reservationsByType}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tipo" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Nenhum dado disponível
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ocupação por Espaço */}
          <Card>
            <CardHeader>
              <CardTitle>Ocupação por Espaço</CardTitle>
              <CardDescription>Top 10 espaços mais reservados</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingReservations ? (
                <Skeleton className="h-64" />
              ) : occupancyBySpace.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={occupancyBySpace} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="nome" type="category" width={150} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Nenhum dado disponível
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lista de Reservas */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Reservas Detalhadas</CardTitle>
              <CardDescription>
                Lista completa de reservas no período selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingReservations ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : reservations && reservations.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-semibold">Data/Hora</th>
                        <th className="text-left p-3 text-sm font-semibold">Espaço</th>
                        <th className="text-left p-3 text-sm font-semibold">Duração</th>
                        <th className="text-left p-3 text-sm font-semibold">Valor</th>
                        <th className="text-left p-3 text-sm font-semibold">Usuário</th>
                        <th className="text-left p-3 text-sm font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((reservation) => {
                        const dataInicio = new Date(reservation.data_inicio);
                        const dataFim = new Date(reservation.data_fim);
                        const horas = differenceInHours(dataFim, dataInicio);
                        const minutos = differenceInMinutes(dataFim, dataInicio) % 60;
                        const horasTotais = horas + minutos / 60;
                        const precoHora = reservation.spaces?.preco_hora || 0;
                        const valorTotal = horasTotais * precoHora;
                        const valorFormatado = precoHora > 0 
                          ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valorTotal)
                          : "N/A";

                        return (
                          <tr key={reservation.id} className="border-b hover:bg-muted/50">
                            <td className="p-3 text-sm">
                              <div className="flex flex-col">
                                <span>
                                  {format(dataInicio, "dd/MM/yyyy", {
                                    locale: ptBR,
                                  })}
                                </span>
                                <span className="text-muted-foreground">
                                  {format(dataInicio, "HH:mm")} -{" "}
                                  {format(dataFim, "HH:mm")}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-sm">
                              {reservation.spaces?.nome || "N/A"}
                            </td>
                            <td className="p-3 text-sm">
                              {horas}h {minutos > 0 && `${minutos}min`}
                            </td>
                            <td className="p-3 text-sm font-semibold text-accent">
                              {valorFormatado}
                            </td>
                            <td className="p-3 text-sm">
                              {reservation.profiles?.nome || reservation.profiles?.email || "N/A"}
                            </td>
                            <td className="p-3">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs",
                                  reservation.status === "confirmada" &&
                                    "bg-success/10 text-success border-success/30",
                                  reservation.status === "pendente" &&
                                    "bg-warning/10 text-warning border-warning/30",
                                  reservation.status === "cancelada" &&
                                    "bg-destructive/10 text-destructive border-destructive/30"
                                )}
                              >
                                {reservation.status}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Nenhuma reserva encontrada no período selecionado
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}


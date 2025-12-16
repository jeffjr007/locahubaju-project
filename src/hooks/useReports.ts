import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ReportStats {
  totalReservations: number;
  confirmedReservations: number;
  cancelledReservations: number;
  pendingReservations: number;
  totalUsers: number;
  totalSpaces: number;
  activeSpaces: number;
}

export function useReportStats(startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ["report-stats", startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      // Buscar estatísticas de reservas
      let reservationsQuery = supabase
        .from("reservations")
        .select("status", { count: "exact", head: true });

      if (startDate) {
        reservationsQuery = reservationsQuery.gte("data_inicio", startDate.toISOString());
      }
      if (endDate) {
        reservationsQuery = reservationsQuery.lte("data_fim", endDate.toISOString());
      }

      const { count: totalReservations } = await reservationsQuery;

      // Contar por status
      let confirmedQuery = supabase
        .from("reservations")
        .select("id", { count: "exact", head: true })
        .eq("status", "confirmada");

      let cancelledQuery = supabase
        .from("reservations")
        .select("id", { count: "exact", head: true })
        .eq("status", "cancelada");

      let pendingQuery = supabase
        .from("reservations")
        .select("id", { count: "exact", head: true })
        .eq("status", "pendente");

      if (startDate) {
        confirmedQuery = confirmedQuery.gte("data_inicio", startDate.toISOString());
        cancelledQuery = cancelledQuery.gte("data_inicio", startDate.toISOString());
        pendingQuery = pendingQuery.gte("data_inicio", startDate.toISOString());
      }
      if (endDate) {
        confirmedQuery = confirmedQuery.lte("data_fim", endDate.toISOString());
        cancelledQuery = cancelledQuery.lte("data_fim", endDate.toISOString());
        pendingQuery = pendingQuery.lte("data_fim", endDate.toISOString());
      }

      const [
        { count: confirmedReservations },
        { count: cancelledReservations },
        { count: pendingReservations },
      ] = await Promise.all([
        confirmedQuery,
        cancelledQuery,
        pendingQuery,
      ]);

      // Contar usuários
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true });

      // Contar espaços
      const { count: totalSpaces } = await supabase
        .from("spaces")
        .select("id", { count: "exact", head: true });

      const { count: activeSpaces } = await supabase
        .from("spaces")
        .select("id", { count: "exact", head: true })
        .eq("ativo", true);

      return {
        totalReservations: totalReservations || 0,
        confirmedReservations: confirmedReservations || 0,
        cancelledReservations: cancelledReservations || 0,
        pendingReservations: pendingReservations || 0,
        totalUsers: totalUsers || 0,
        totalSpaces: totalSpaces || 0,
        activeSpaces: activeSpaces || 0,
      } as ReportStats;
    },
  });
}


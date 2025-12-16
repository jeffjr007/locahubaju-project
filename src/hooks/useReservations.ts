import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Reservation {
  id: string;
  user_id: string;
  space_id: string;
  data_inicio: string;
  data_fim: string;
  status: "confirmada" | "cancelada" | "pendente";
  created_at: string;
  spaces?: {
    nome: string;
    tipo: string;
    capacidade?: number;
  };
  profiles?: {
    nome: string;
    email: string;
    telefone: string | null;
  };
}

export function useUserReservations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["reservations", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from("reservations")
        .select(`
          *,
          spaces (nome, tipo)
        `)
        .eq("user_id", user.id)
        .order("data_inicio", { ascending: false });

      if (error) throw error;
      return data as Reservation[];
    },
    enabled: !!user,
  });
}

export function useAllReservations(startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ["all-reservations", startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from("reservations")
        .select(`
          *,
          spaces (nome, tipo)
        `)
        .neq("status", "cancelada")
        .order("data_inicio");

      if (startDate) {
        query = query.gte("data_inicio", startDate.toISOString());
      }
      if (endDate) {
        query = query.lte("data_fim", endDate.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Reservation[];
    },
  });
}

// Hook para buscar TODAS as reservas (incluindo canceladas) - apenas para admin/relatórios
export function useAllReservationsForReports(startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ["all-reservations-reports", startDate?.toISOString(), endDate?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from("reservations")
        .select(`
          *,
          spaces (nome, tipo, capacidade),
          profiles (nome, email, telefone)
        `)
        .order("data_inicio", { ascending: false });

      if (startDate) {
        query = query.gte("data_inicio", startDate.toISOString());
      }
      if (endDate) {
        query = query.lte("data_fim", endDate.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Reservation[];
    },
  });
}

interface CreateReservationParams {
  space_id: string;
  data_inicio: string;
  data_fim: string;
}

export function useCreateReservation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateReservationParams) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("reservations")
        .insert({
          user_id: user.id,
          space_id: params.space_id,
          data_inicio: params.data_inicio,
          data_fim: params.data_fim,
          status: "confirmada",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["all-reservations"] });
    },
  });
}

export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId: string) => {
      const { error } = await supabase
        .from("reservations")
        .update({ status: "cancelada" })
        .eq("id", reservationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["all-reservations"] });
    },
  });
}

interface UpdateReservationParams {
  id: string;
  space_id?: string;
  data_inicio?: string;
  data_fim?: string;
}

export function useUpdateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateReservationParams) => {
      const { id, ...updates } = params;
      
      const { data, error } = await supabase
        .from("reservations")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["all-reservations"] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Space {
  id: string;
  nome: string;
  tipo: "sala" | "coworking" | "auditorio" | "laboratorio";
  capacidade: number;
  descricao: string | null;
  imagem_url: string | null;
  preco_hora: number | null;
  ativo: boolean;
  created_at: string;
}

export function useSpaces() {
  return useQuery({
    queryKey: ["spaces"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spaces")
        .select("*")
        .eq("ativo", true)
        .order("nome");

      if (error) throw error;
      return data as Space[];
    },
  });
}

export function useSpace(id: string) {
  return useQuery({
    queryKey: ["space", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spaces")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as Space | null;
    },
    enabled: !!id,
  });
}

// Hook para listar TODOS os espaços (incluindo inativos) - apenas para admin
export function useAllSpaces() {
  return useQuery({
    queryKey: ["all-spaces"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("spaces")
        .select("*")
        .order("nome");

      if (error) throw error;
      return data as Space[];
    },
  });
}

// Hook para criar espaço
export function useCreateSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (space: {
      nome: string;
      tipo: "sala" | "coworking" | "auditorio" | "laboratorio";
      capacidade: number;
      descricao?: string | null;
      imagem_url?: string | null;
      preco_hora?: number | null;
      ativo?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("spaces")
        .insert(space)
        .select()
        .single();

      if (error) throw error;
      return data as Space;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      queryClient.invalidateQueries({ queryKey: ["all-spaces"] });
    },
  });
}

// Hook para atualizar espaço
export function useUpdateSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: {
      id: string;
      nome?: string;
      tipo?: "sala" | "coworking" | "auditorio" | "laboratorio";
      capacidade?: number;
      descricao?: string | null;
      imagem_url?: string | null;
      preco_hora?: number | null;
      ativo?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("spaces")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Space;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      queryClient.invalidateQueries({ queryKey: ["all-spaces"] });
      queryClient.invalidateQueries({ queryKey: ["space"] });
    },
  });
}

// Hook para deletar espaço
export function useDeleteSpace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("spaces").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spaces"] });
      queryClient.invalidateQueries({ queryKey: ["all-spaces"] });
    },
  });
}

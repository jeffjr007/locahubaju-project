import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Space {
  id: string;
  nome: string;
  tipo: "sala" | "coworking" | "auditorio" | "laboratorio";
  capacidade: number;
  descricao: string | null;
  imagem_url: string | null;
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

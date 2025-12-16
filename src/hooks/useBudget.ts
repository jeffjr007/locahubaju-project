import { useMemo } from "react";
import { differenceInHours, differenceInMinutes } from "date-fns";

export interface BudgetCalculation {
  precoHora: number;
  horas: number;
  minutos: number;
  horasTotais: number;
  valorTotal: number;
  valorFormatado: string;
}

/**
 * Calcula o orçamento de uma reserva baseado no preço por hora e duração
 */
export function useBudget(
  precoHora: number | null | undefined,
  dataInicio: Date | undefined,
  dataFim: Date | undefined
): BudgetCalculation | null {
  return useMemo(() => {
    if (!precoHora || !dataInicio || !dataFim || precoHora <= 0) {
      return null;
    }

    const horas = differenceInHours(dataFim, dataInicio);
    const minutos = differenceInMinutes(dataFim, dataInicio) % 60;
    const horasTotais = horas + minutos / 60;
    const valorTotal = horasTotais * precoHora;

    return {
      precoHora,
      horas,
      minutos,
      horasTotais,
      valorTotal,
      valorFormatado: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valorTotal),
    };
  }, [precoHora, dataInicio, dataFim]);
}


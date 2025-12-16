-- Corrigir função check_reservation_conflict com search_path
CREATE OR REPLACE FUNCTION public.check_reservation_conflict()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.reservations
    WHERE space_id = NEW.space_id
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
      AND status != 'cancelada'
      AND (NEW.data_inicio, NEW.data_fim) OVERLAPS (data_inicio, data_fim)
  ) THEN
    RAISE EXCEPTION 'Conflito de horário: este espaço já está reservado neste período';
  END IF;
  RETURN NEW;
END;
$$;
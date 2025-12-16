-- Adicionar campo preco_hora na tabela spaces
ALTER TABLE public.spaces
ADD COLUMN IF NOT EXISTS preco_hora DECIMAL(10, 2) DEFAULT 0.00;

-- Comentário na coluna
COMMENT ON COLUMN public.spaces.preco_hora IS 'Preço por hora de locação do espaço em reais (R$)';

-- Atualizar espaços existentes com preços de exemplo (opcional)
UPDATE public.spaces SET preco_hora = 50.00 WHERE tipo = 'sala';
UPDATE public.spaces SET preco_hora = 30.00 WHERE tipo = 'coworking';
UPDATE public.spaces SET preco_hora = 100.00 WHERE tipo = 'auditorio';
UPDATE public.spaces SET preco_hora = 80.00 WHERE tipo = 'laboratorio';


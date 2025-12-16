-- Enum para tipos de espaço
CREATE TYPE public.space_type AS ENUM ('sala', 'coworking', 'auditorio', 'laboratorio');

-- Enum para status de reserva
CREATE TYPE public.reservation_status AS ENUM ('confirmada', 'cancelada', 'pendente');

-- Enum para roles de usuário
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de roles de usuário
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE (user_id, role)
);

-- Tabela de espaços
CREATE TABLE public.spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo space_type NOT NULL,
  capacidade INTEGER NOT NULL,
  descricao TEXT,
  imagem_url TEXT,
  ativo BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de reservas
CREATE TABLE public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE NOT NULL,
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
  status reservation_status DEFAULT 'pendente' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT valid_dates CHECK (data_fim > data_inicio)
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Função para verificar role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Função para verificar conflito de reservas
CREATE OR REPLACE FUNCTION public.check_reservation_conflict()
RETURNS TRIGGER
LANGUAGE plpgsql
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

-- Trigger para verificar conflitos
CREATE TRIGGER check_reservation_conflict_trigger
BEFORE INSERT OR UPDATE ON public.reservations
FOR EACH ROW EXECUTE FUNCTION public.check_reservation_conflict();

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email), NEW.email);
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil quando usuário se cadastra
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Políticas RLS para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Políticas RLS para user_roles
CREATE POLICY "Usuários podem ver suas próprias roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Políticas RLS para spaces (público para leitura)
CREATE POLICY "Qualquer um pode ver espaços ativos"
ON public.spaces FOR SELECT
USING (ativo = true);

CREATE POLICY "Admins podem gerenciar espaços"
ON public.spaces FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Políticas RLS para reservations
CREATE POLICY "Usuários podem ver suas próprias reservas"
ON public.reservations FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Usuários autenticados podem criar reservas"
ON public.reservations FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias reservas"
ON public.reservations FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todas as reservas"
ON public.reservations FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Inserir espaços de exemplo
INSERT INTO public.spaces (nome, tipo, capacidade, descricao, imagem_url) VALUES
('Sala de Reunião Alpha', 'sala', 10, 'Sala equipada com TV, quadro branco e ar condicionado', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'),
('Coworking Open Space', 'coworking', 30, 'Ambiente colaborativo com mesas compartilhadas e internet de alta velocidade', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'),
('Auditório Principal', 'auditorio', 100, 'Auditório para eventos, palestras e workshops com sistema de som profissional', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'),
('Lab de Tecnologia', 'laboratorio', 20, 'Laboratório equipado com computadores e ferramentas de prototipagem', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'),
('Sala Beta', 'sala', 6, 'Sala intimista para reuniões rápidas e calls', 'https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=800'),
('Coworking Focus', 'coworking', 15, 'Área silenciosa para trabalho focado', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800');
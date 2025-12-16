# LocaHubAju

Plataforma inteligente para locação de espaços de inovação em Aracaju.

## 📋 Sobre o Projeto

O LocaHubAju é uma plataforma web moderna e intuitiva para gerenciamento e locação de espaços de inovação, inspirada em hubs como o CAJUHUB. O sistema permite que usuários reservem salas de reunião, ambientes de trabalho compartilhados, auditórios e laboratórios de tecnologia de forma simples e eficiente.

## ✨ Funcionalidades

### Principais
- ✅ **Cadastro e listagem de espaços** - Sistema completo de gerenciamento de espaços disponíveis para locação
- ✅ **Cadastro de usuários/clientes** - Sistema de autenticação com perfil completo (nome, email, telefone)
- ✅ **Registro de reservas** - Sistema de reservas com verificação automática de conflitos de horário
- ✅ **Visualização da agenda** - Agenda de ocupação dos espaços com visualização por dia e semana
- ✅ **Interface gráfica intuitiva** - Design moderno, responsivo e fácil de usar

### Funcionalidades Adicionais
- 🔐 Sistema de autenticação completo (login/cadastro)
- 🔍 Filtros e busca de espaços por tipo
- 📊 Dashboard com estatísticas e taxa de ocupação
- ⚠️ Validação de conflitos de horário em tempo real
- 🔒 Row Level Security (RLS) configurado no Supabase
- 📱 Design totalmente responsivo
- 🎨 Interface moderna com identidade visual própria

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - React 18.3
  - TypeScript
  - Vite
  - React Router
  - React Query (TanStack Query)
  - Tailwind CSS
  - shadcn/ui
  - Zod (validação)
  - date-fns (manipulação de datas)

- **Backend:**
  - Supabase (PostgreSQL + Auth + RLS)
  - Row Level Security para segurança de dados

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ (recomendado usar nvm)
- npm ou yarn
- Conta no Supabase

### Passos

1. **Clone o repositório**
```bash
git clone <URL_DO_REPOSITORIO>
cd locahubaju
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica_do_supabase
VITE_N8N_WEBHOOK_URL=https://seu-n8n.com/webhook/reservas
VITE_N8N_WEBHOOKCANCEL_URL=https://seu-n8n.com/webhook/cancelamento
```

**Nota:** As variáveis `VITE_N8N_WEBHOOK_URL` e `VITE_N8N_WEBHOOKCANCEL_URL` são opcionais. Se configuradas, o sistema acionará os webhooks do n8n quando:
- Uma reserva for confirmada e o usuário tiver permitido notificações (`VITE_N8N_WEBHOOK_URL`)
- Uma reserva for cancelada (`VITE_N8N_WEBHOOKCANCEL_URL`)

4. **Execute as migrações do banco de dados**
Acesse o SQL Editor no Supabase Dashboard e execute as migrações na ordem:
- `supabase/migrations/20251216012548_34411aea-f05e-4490-adb6-de25b2f86791.sql`
- `supabase/migrations/20251216012820_13f78245-1561-48fb-bf29-36f191d0a43c.sql`
- `supabase/migrations/20251216020000_update_handle_new_user_telefone.sql`

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:8080`

## 🗄️ Estrutura do Banco de Dados

### Tabelas
- **profiles** - Perfis de usuário (nome, email, telefone)
- **spaces** - Espaços disponíveis para locação
- **reservations** - Reservas realizadas
- **user_roles** - Sistema de permissões (admin/user)

### Enums
- **space_type**: sala, coworking, auditorio, laboratorio
- **reservation_status**: confirmada, cancelada, pendente
- **app_role**: admin, user

## 🚀 Build para Produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

Para visualizar o build:
```bash
npm run preview
```

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera o build de produção
- `npm run build:dev` - Gera o build em modo desenvolvimento
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Executa o linter

## 🔐 Segurança

- Row Level Security (RLS) habilitado em todas as tabelas
- Políticas de segurança configuradas:
  - Usuários só veem suas próprias reservas
  - Apenas admins podem gerenciar espaços
  - Validação de conflitos de horário no banco de dados
  - Triggers para criação automática de perfis

## 📄 Licença

Este projeto foi desenvolvido como parte de um desafio de programação acadêmico.

## 👤 Autor

Desenvolvido para o ecossistema de inovação de Aracaju.

---

**LocaHubAju** - Transforme suas ideias em realidade 🚀

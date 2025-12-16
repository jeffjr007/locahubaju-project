# LocaHubAju

Plataforma inteligente para locação de espaços de inovação em Aracaju.

**🌐 Acesso Online:** [https://locahubaju.vercel.app/](https://locahubaju.vercel.app/)

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

## 🚀 Como Usar o Sistema

### Acesso Online
O sistema está disponível online em: **[https://locahubaju.vercel.app/](https://locahubaju.vercel.app/)**

### Primeiro Acesso

1. **Criar Conta**
   - Acesse a plataforma e clique em "Entrar"
   - Selecione "Criar conta"
   - Preencha os dados:
     - **Nome completo** (obrigatório)
     - **Email** (obrigatório)
     - **Telefone** (obrigatório) - **Importante:** Use o formato correto: DDD + número sem parênteses ou traços
       - ✅ Formato correto: `79 988226170`
       - ❌ Formato incorreto: `(79) 98822-6170` ou `79988226170`
     - **Senha** (mínimo 6 caracteres)

2. **Login**
   - Você pode usar as credenciais do formulário do Jovem Tech
   - **Recomendação:** Crie seu próprio login para receber notificações de confirmação e cancelamento de reservas via WhatsApp
   - O telefone cadastrado será usado para envio de mensagens automáticas

### Como Fazer uma Reserva

1. **Navegue até "Reservas"** no menu superior
2. **Complete seu perfil** (se necessário):
   - Nome completo
   - Telefone no formato correto (DDD + número)
3. **Preencha o formulário de reserva**:
   - Selecione o espaço desejado
   - Escolha a data
   - Defina horário de início e término
   - Adicione observações (opcional)
4. **Permita notificações** (recomendado):
   - Marque a opção "Permitir receber notificações e lembretes sobre as reservas"
   - Você receberá confirmações e lembretes via WhatsApp
5. **Confirme a reserva**
   - Clique em "Confirmar Reserva"
   - Aguarde a confirmação

### Visualizar e Gerenciar Reservas

- **Minhas Reservas**: Acesse a página "Reservas" para ver todas suas reservas ativas
- **Cancelar Reserva**: Clique no botão "Cancelar" na reserva desejada
  - Um diálogo de confirmação aparecerá
  - Confirme o cancelamento
  - Você receberá uma notificação de cancelamento via WhatsApp (se tiver notificações habilitadas)

### Visualizar Agenda

- Acesse "Agenda" no menu para ver a ocupação dos espaços
- Visualize por dia ou semana
- Use o calendário lateral para navegar entre datas

### Explorar Espaços

- Acesse "Espaços" no menu
- Use os filtros para encontrar espaços por tipo (Salas, Coworking, Auditórios, Laboratórios)
- Use a busca para encontrar espaços específicos

## 📦 Instalação e Execução Local

### Pré-requisitos
- Node.js 18+ (recomendado usar nvm)
- npm ou yarn
- Conta no Supabase

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/jeffjr007/locahubaju-project.git
cd locahubaju-project
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

## 🔔 Integração com n8n (Notificações WhatsApp)

O sistema está integrado com n8n para envio automático de notificações via WhatsApp.

<img width="1153" height="410" alt="image" src="https://github.com/user-attachments/assets/024bae43-62ae-4add-9005-cda7e7c51bb5" />


### Como Funciona

1. **Acionamento do Webhook**
   - Quando o usuário confirma uma reserva (e permite notificações) ou cancela uma reserva
   - O sistema aciona automaticamente o webhook do n8n configurado
   - Os dados da reserva e do cliente são enviados via POST em formato JSON

2. **Dados Enviados ao Webhook**
   ```json
   {
     "nome": "Nome do Cliente",
     "telefone": "79 988226170",
     "email": "cliente@email.com",
     "espaco": "Sala de Reunião Alpha",
     "tipoEspaco": "sala",
     "capacidade": 10,
     "descricaoEspaco": "Descrição do espaço",
     "data": "15/12/2024",
     "horarioInicio": "09:00",
     "horarioFim": "11:00",
     "horarioCompleto": "15/12/2024 das 09:00 às 11:00",
     "observacoes": "Observações adicionais",
     "reservationId": "uuid-da-reserva",
     "acao": "confirmada" // ou "cancelada" para cancelamentos
   }
   ```

3. **Processamento no n8n**
   - O n8n recebe os dados do webhook
   - Os dados são organizados e processados
   - Um código JavaScript gera um delay aleatório entre 20 e 40 segundos
   - Durante esse tempo, é enviada uma mensagem de "digitando..." para simular digitação humana
   - Após o delay, é enviada a mensagem de confirmação ou cancelamento via WhatsApp

### Configuração do Telefone

**⚠️ IMPORTANTE:** O telefone deve estar no formato correto para o envio funcionar:
- ✅ **Formato correto:** `79988226170` (DDD + número)
- ❌ **Formatos incorretos:** 
  - `(79) 98822-6170`
  - `79988226170`
  - `+55 79 98822-6170`

O sistema valida o formato durante o cadastro, mas é importante seguir o padrão: **DDD + espaço + número completo**.

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

**Desenvolvido por:** Jeferson Junior  
**Email:** jeffjr007z@gmail.com  
**Telefone:** (79) 98822-6170

Desenvolvido para o ecossistema de inovação de Aracaju.

---

**LocaHubAju** - Transforme suas ideias em realidade 🚀

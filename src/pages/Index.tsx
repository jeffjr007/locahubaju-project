import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SpaceCard } from "@/components/spaces/SpaceCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { OccupancyBar } from "@/components/dashboard/OccupancyBar";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Building2, 
  Users, 
  Calendar, 
  TrendingUp,
  Sparkles,
  Zap,
  Shield
} from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useSpaces } from "@/hooks/useSpaces";

const features = [
  {
    icon: Sparkles,
    title: "Espaços Modernos",
    description: "Ambientes projetados para estimular criatividade e produtividade."
  },
  {
    icon: Zap,
    title: "Reserva Instantânea",
    description: "Reserve seu espaço em segundos, sem burocracia."
  },
  {
    icon: Shield,
    title: "Infraestrutura Completa",
    description: "WiFi de alta velocidade, equipamentos audiovisuais e suporte técnico."
  }
];

export default function Index() {
  const { data: spaces, isLoading } = useSpaces();
  const featuredSpaces = spaces?.slice(0, 4) ?? [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={heroBg} 
            alt="Espaço de inovação" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm text-accent px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Plataforma de Inovação em Aracaju
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-background mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Seu espaço de{" "}
              <span className="text-accent">inovação</span>{" "}
              está aqui
            </h1>

            <p className="text-lg md:text-xl text-background/80 mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Reserve salas de reunião, coworkings, auditórios e laboratórios 
              de tecnologia. Conecte-se ao ecossistema de inovação de Aracaju.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <Link to="/espacos">
                <Button variant="accent" size="xl" className="gap-2 w-full sm:w-auto">
                  Explorar Espaços
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/reservas">
                <Button variant="hero-outline" size="xl" className="w-full sm:w-auto">
                  Fazer Reserva
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Espaços Disponíveis"
              value={spaces?.length ?? 0}
              icon={Building2}
              description="Prontos para uso"
            />
            <StatCard
              title="Usuários Ativos"
              value="500+"
              icon={Users}
              description="Empreendedores conectados"
            />
            <StatCard
              title="Reservas/Mês"
              value={240}
              icon={Calendar}
              trend={{ value: 12, positive: true }}
            />
            <StatCard
              title="Taxa de Ocupação"
              value="78%"
              icon={TrendingUp}
              description="Média semanal"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Por que escolher o <span className="text-primary">LocaHubAju</span>?
            </h2>
            <p className="text-muted-foreground">
              Uma plataforma completa para impulsionar sua jornada de inovação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-card rounded-2xl p-8 border border-border/50 hover-lift text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Spaces */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Espaços em Destaque
              </h2>
              <p className="text-muted-foreground">
                Conheça os ambientes mais procurados
              </p>
            </div>
            <Link to="/espacos" className="hidden md:block">
              <Button variant="outline" className="gap-2">
                Ver Todos
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredSpaces.map((space) => (
                <SpaceCard 
                  key={space.id} 
                  space={{
                    id: space.id,
                    nome: space.nome,
                    tipo: space.tipo,
                    capacidade: space.capacidade,
                    descricao: space.descricao ?? "",
                    ativo: space.ativo,
                    imagem_url: space.imagem_url,
                  }} 
                />
              ))}
            </div>
          )}

          <div className="md:hidden mt-8 text-center">
            <Link to="/espacos">
              <Button variant="outline" className="gap-2">
                Ver Todos os Espaços
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Occupancy Dashboard */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Taxa de Ocupação
              </h2>
              <p className="text-muted-foreground">
                Acompanhe em tempo real a disponibilidade dos espaços
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 border border-border/50 shadow-soft">
              <div className="space-y-6">
                <OccupancyBar label="Salas de Reunião" value={75} />
                <OccupancyBar label="Coworking" value={60} />
                <OccupancyBar label="Auditório" value={85} />
                <OccupancyBar label="Laboratórios" value={45} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-background rounded-full translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Pronto para inovar?
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Faça parte do maior hub de inovação de Aracaju. 
              Reserve seu espaço agora e comece a transformar suas ideias em realidade.
            </p>
            <Link to="/reservas">
              <Button variant="accent" size="xl" className="gap-2">
                Reservar Espaço
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}

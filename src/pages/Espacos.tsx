import { Layout } from "@/components/layout/Layout";
import { SpaceCard } from "@/components/spaces/SpaceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Search, Filter, Building2, Users2, Presentation, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpaces } from "@/hooks/useSpaces";

const filterOptions = [
  { id: "all", label: "Todos", icon: Filter },
  { id: "sala", label: "Salas", icon: Building2 },
  { id: "coworking", label: "Coworking", icon: Users2 },
  { id: "auditorio", label: "Auditórios", icon: Presentation },
  { id: "laboratorio", label: "Laboratórios", icon: FlaskConical },
];

export default function Espacos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const { data: spaces, isLoading } = useSpaces();

  const filteredSpaces = spaces?.filter((space) => {
    const matchesSearch = space.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (space.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesFilter = selectedFilter === "all" || space.tipo === selectedFilter;
    return matchesSearch && matchesFilter;
  }) ?? [];

  return (
    <Layout>
      {/* Header */}
      <section className="pt-12 pb-8 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nossos <span className="text-primary">Espaços</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Encontre o ambiente perfeito para suas necessidades. 
              De salas de reunião a laboratórios de tecnologia.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border/50 sticky top-16 bg-background/95 backdrop-blur-sm z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar espaços..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.id}
                    variant={selectedFilter === option.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(option.id)}
                    className={cn(
                      "gap-2",
                      selectedFilter === option.id && "shadow-soft"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Spaces Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredSpaces.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-6">
                {filteredSpaces.length} espaço{filteredSpaces.length !== 1 && "s"} encontrado{filteredSpaces.length !== 1 && "s"}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSpaces.map((space) => (
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
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Nenhum espaço encontrado
              </h3>
              <p className="text-muted-foreground">
                Tente ajustar seus filtros ou termo de busca.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

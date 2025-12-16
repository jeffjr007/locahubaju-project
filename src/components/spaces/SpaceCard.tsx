import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export interface Space {
  id: string;
  nome: string;
  tipo: "sala" | "coworking" | "auditorio" | "laboratorio";
  capacidade: number;
  descricao: string;
  ativo: boolean;
  imagem_url?: string | null;
}

interface SpaceCardProps {
  space: Space;
  className?: string;
}

const tipoLabels: Record<string, string> = {
  sala: "Sala de Reunião",
  coworking: "Coworking",
  auditorio: "Auditório",
  laboratorio: "Laboratório",
};

const tipoColors: Record<string, string> = {
  sala: "bg-primary/10 text-primary",
  coworking: "bg-accent/10 text-accent",
  auditorio: "bg-info/10 text-info",
  laboratorio: "bg-success/10 text-success",
};

export function SpaceCard({ space, className }: SpaceCardProps) {
  return (
    <div
      className={cn(
        "group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover-lift",
        className
      )}
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        {space.imagem_url ? (
          <img
            src={space.imagem_url}
            alt={space.nome}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-primary/40" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <Badge className={cn("font-medium", tipoColors[space.tipo])}>
            {tipoLabels[space.tipo]}
          </Badge>
          {space.ativo ? (
            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
              Disponível
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
              Indisponível
            </Badge>
          )}
        </div>

        <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
          {space.nome}
        </h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {space.descricao}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">{space.capacidade} pessoas</span>
          </div>

          <Link to={`/reservas?espaco=${space.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="group/btn gap-1"
              disabled={!space.ativo}
            >
              Reservar
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

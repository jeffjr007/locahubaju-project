import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, Instagram, Linkedin, Facebook } from "lucide-react";
import logoIcon from "@/assets/icone.png";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                <img 
                  src={logoIcon} 
                  alt="LocaHubAju Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-background leading-tight">LocaHub</span>
                <span className="text-xs text-accent font-semibold -mt-1">Aju</span>
              </div>
            </div>
            <p className="text-background/70 max-w-md">
              Plataforma inteligente para locação de espaços de inovação em Aracaju. 
              Conectando pessoas, ideias e oportunidades.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-background/60 hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-accent transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-accent transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-background mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/espacos" className="text-background/70 hover:text-accent transition-colors">
                  Espaços
                </Link>
              </li>
              <li>
                <Link to="/agenda" className="text-background/70 hover:text-accent transition-colors">
                  Agenda
                </Link>
              </li>
              <li>
                <Link to="/reservas" className="text-background/70 hover:text-accent transition-colors">
                  Reservas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-background mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/70">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Aracaju, SE - Brasil</span>
              </li>
              <li className="flex items-center gap-2 text-background/70">
                <Mail className="h-4 w-4 text-accent" />
                <span>contato@locahubaju.com.br</span>
              </li>
              <li className="flex items-center gap-2 text-background/70">
                <Phone className="h-4 w-4 text-accent" />
                <span>(79) 9999-9999</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8">
          <div className="text-center text-background/50 text-sm space-y-2">
            <p>© {new Date().getFullYear()} LocaHubAju. Todos os direitos reservados.</p>
            <p className="flex items-center justify-center gap-2 flex-wrap">
              <span>Desenvolvido por</span>
              <span className="text-accent font-semibold">Jeferson Junior</span>
              <span className="mx-1">•</span>
              <a 
                href="mailto:jeffjr007z@gmail.com" 
                className="text-background/70 hover:text-accent transition-colors flex items-center gap-1"
              >
                <Mail className="h-3 w-3" />
                jeffjr007z@gmail.com
              </a>
              <span className="mx-1">•</span>
              <a 
                href="tel:+5579988226170" 
                className="text-background/70 hover:text-accent transition-colors flex items-center gap-1"
              >
                <Phone className="h-3 w-3" />
                (79) 98822-6170
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

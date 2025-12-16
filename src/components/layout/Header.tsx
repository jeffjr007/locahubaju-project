import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Home, 
  Building2, 
  Calendar, 
  ClipboardList, 
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  Shield,
  BarChart3
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import logoIcon from "@/assets/icone.png";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/espacos", label: "Espaços", icon: Building2 },
  { href: "/agenda", label: "Agenda", icon: Calendar },
  { href: "/reservas", label: "Reservas", icon: ClipboardList },
];

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, loading } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:shadow-glow transition-all duration-300 overflow-hidden">
              <img 
                src={logoIcon} 
                alt="LocaHubAju Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground leading-tight">LocaHub</span>
              <span className="text-xs text-accent font-semibold -mt-1">Aju</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2",
                      isActive && "shadow-soft"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            {isAdmin && (
              <>
                <Link to="/admin/espacos">
                  <Button
                    variant={location.pathname === "/admin/espacos" ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2",
                      location.pathname === "/admin/espacos" && "shadow-soft"
                    )}
                  >
                    <Shield className="h-4 w-4" />
                    Espaços
                  </Button>
                </Link>
                <Link to="/admin/relatorios">
                  <Button
                    variant={location.pathname === "/admin/relatorios" ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "gap-2",
                      location.pathname === "/admin/relatorios" && "shadow-soft"
                    )}
                  >
                    <BarChart3 className="h-4 w-4" />
                    Relatórios
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <User className="h-4 w-4" />
                        {profile?.nome?.split(" ")[0] || "Perfil"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-muted-foreground">
                        {profile?.email || user.email}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/reservas">Minhas Reservas</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to="/auth">
                    <Button variant="outline" className="gap-2">
                      <LogIn className="h-4 w-4" />
                      Entrar
                    </Button>
                  </Link>
                )}
                <Link to="/reservas">
                  <Button variant="accent" size="default">
                    Reservar Agora
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-slide-down">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              {isAdmin && (
                <>
                  <Link 
                    to="/admin/espacos"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={location.pathname === "/admin/espacos" ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Espaços
                    </Button>
                  </Link>
                  <Link 
                    to="/admin/relatorios"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={location.pathname === "/admin/relatorios" ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Relatórios
                    </Button>
                  </Link>
                </>
              )}
              
              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    {profile?.nome || user.email}
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-destructive"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full gap-2">
                    <LogIn className="h-4 w-4" />
                    Entrar
                  </Button>
                </Link>
              )}

              <Link to="/reservas" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="accent" className="w-full mt-2">
                  Reservar Agora
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

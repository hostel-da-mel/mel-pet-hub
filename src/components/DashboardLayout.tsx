import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  PawPrint,
  User,
  LogOut,
  Home,
  Calendar,
  Menu,
  X,
  Users,
  CalendarOff,
  CalendarCheck,
  ClipboardList,
  ChevronDown,
  Shield,
  MessageSquare,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Pages that go inside the user dropdown
const userMenuItems: MenuItem[] = [
  { path: "/dashboard", label: "Painel", icon: Home },
  { path: "/dashboard/pets", label: "Meus Pets", icon: PawPrint },
  { path: "/dashboard/perfil", label: "Meu Perfil", icon: User },
  { path: "/booking", label: "Reservas", icon: Calendar },
];

const adminMenuItems: MenuItem[] = [
  { path: "/admin/reservas", label: "Gerenciar Reservas", icon: ClipboardList },
  { path: "/admin/usuarios", label: "Gerenciar Usuarios", icon: Users },
  { path: "/admin/datas-bloqueadas", label: "Datas Bloqueadas", icon: CalendarOff },
  { path: "/admin/disponibilidade", label: "Disponibilidade", icon: CalendarCheck },
];

// Static pages shown in the top nav bar
const staticLinks = [
  { path: "/", label: "Inicio" },
  { path: "/sobre-nos", label: "Sobre Nos" },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === "admin";
  const firstName = user?.nome?.split(" ")[0] || "Usuario";
  const initials = user?.nome
    ? user.nome
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  // Close user menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-cream">
      {/* Top navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <PawPrint className="w-7 h-7 sm:w-8 sm:h-8 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-honey-gold to-honey-dark bg-clip-text text-transparent">
                Hostel da Mel
              </span>
            </Link>

            {/* Desktop nav — static pages only */}
            <div className="hidden md:flex items-center gap-6">
              {staticLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.path) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button asChild variant="outline" size="sm" className="hidden sm:flex">
                <Link to="/contact">
                  <MessageSquare className="w-4 h-4" />
                  Contato
                </Link>
              </Button>

              {/* Desktop user dropdown */}
              <div className="hidden sm:block relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${
                    userMenuOpen ? "bg-primary/10" : "hover:bg-muted"
                  }`}
                >
                  {user?.picture ? (
                    <img src={user.picture} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-honey-gold to-honey-dark flex items-center justify-center text-white text-xs font-bold">
                      {initials}
                    </div>
                  )}
                  <span className="font-medium text-sm text-foreground max-w-[120px] lg:max-w-[150px] truncate">
                    {firstName}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-background rounded-xl border border-border shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-border bg-muted/30">
                      <p className="font-semibold text-sm truncate">{user?.nome}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-honey-dark bg-honey-gold/10 px-2 py-0.5 rounded-full">
                          <Shield className="w-3 h-3" />
                          Administrador
                        </span>
                      )}
                    </div>

                    {/* User pages */}
                    <div className="py-1.5 border-b border-border">
                      {userMenuItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            isActive(item.path)
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Link>
                      ))}
                    </div>

                    {/* Admin links */}
                    {isAdmin && (
                      <div className="py-1.5 border-b border-border">
                        <p className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Administracao
                        </p>
                        {adminMenuItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                              isActive(item.path)
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-foreground hover:bg-muted"
                            }`}
                          >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Logout */}
                    <div className="py-1.5">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <div className="px-4 py-3 space-y-1">
              {/* Static pages */}
              {staticLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive("/contact")
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Contato
              </Link>

              {/* User pages */}
              <div className="border-t border-border my-2" />
              <p className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Minha Area
              </p>
              {userMenuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}

              {/* Admin items */}
              {isAdmin && (
                <>
                  <div className="border-t border-border my-2" />
                  <p className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Administracao
                  </p>
                  {adminMenuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive(item.path)
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  ))}
                </>
              )}

              {/* Mobile user info + logout */}
              <div className="border-t border-border mt-2 pt-3">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2">
                    {user?.picture ? (
                      <img src={user.picture} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-honey-gold to-honey-dark flex items-center justify-center text-white text-xs font-bold">
                        {initials}
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-sm font-medium truncate block max-w-[180px]">
                        {user?.nome}
                      </span>
                      <span className="text-xs text-muted-foreground truncate block max-w-[180px]">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="flex-1 pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="container mx-auto px-4">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 sm:py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-xs sm:text-sm">
          <p>&copy; 2026 Hostel da Mel. Todos os direitos reservados.</p>
          <p className="text-xs mt-1 opacity-50">
            Desenvolvido por{" "}
            <a
              href="https://l2.tec.br"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 underline"
            >
              l2.tec.br
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;

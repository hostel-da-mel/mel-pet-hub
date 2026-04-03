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
} from "lucide-react";
import { useMemo, useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  separator?: boolean;
}

const allMenuItems: MenuItem[] = [
  { path: "/dashboard", label: "Painel", icon: Home },
  { path: "/dashboard/pets", label: "Meus Pets", icon: PawPrint },
  { path: "/dashboard/perfil", label: "Meu Perfil", icon: User },
  { path: "/booking", label: "Reservas", icon: Calendar },
  { path: "/admin/usuarios", label: "Usuarios", icon: Users, adminOnly: true, separator: true },
  { path: "/admin/datas-bloqueadas", label: "Datas Bloqueadas", icon: CalendarOff, adminOnly: true },
  { path: "/admin/disponibilidade", label: "Disponibilidade", icon: CalendarCheck, adminOnly: true },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === "admin";

  const menuItems = useMemo(
    () => allMenuItems.filter((item) => !item.adminOnly || isAdmin),
    [isAdmin]
  );

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
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

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => (
                <div key={item.path} className="flex items-center">
                  {item.separator && (
                    <div className="w-px h-6 bg-border mx-1" />
                  )}
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-foreground max-w-[120px] lg:max-w-[150px] truncate">
                  {user?.nome?.split(" ")[0]}
                </span>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive hidden sm:flex"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>

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
              {menuItems.map((item) => (
                <div key={item.path}>
                  {item.separator && (
                    <div className="border-t border-border my-2 mx-4" />
                  )}
                  <Link
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
                </div>
              ))}

              {/* Mobile user info + logout */}
              <div className="border-t border-border mt-2 pt-3">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium truncate max-w-[180px]">
                      {user?.nome}
                    </span>
                  </div>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
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

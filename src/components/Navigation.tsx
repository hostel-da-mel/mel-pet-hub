import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PawPrint, User, MessageSquare, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    navigate("/", { replace: true });
  };

  const staticLinks = [
    { path: "/", label: "Inicio" },
    ...(!isAuthenticated ? [{ path: "/register", label: "Cadastro" }] : []),
    { path: "/sobre-nos", label: "Sobre Nos" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
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
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="hidden sm:flex">
              <Link to="/contact">
                <MessageSquare className="w-4 h-4" />
                Contato
              </Link>
            </Button>
            {isAuthenticated ? (
              <>
                <Button asChild size="sm">
                  <Link to="/dashboard">
                    <LayoutDashboard className="w-4 h-4" />
                    Minha Area
                  </Link>
                </Button>
                <Button onClick={handleLogout} variant="ghost" size="sm" className="hidden sm:flex">
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </>
            ) : (
              <Button asChild size="sm">
                <Link to="/login">
                  <User className="w-4 h-4" />
                  Entrar
                </Link>
              </Button>
            )}

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
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain">
          <div className="px-4 py-3 space-y-1">
            {staticLinks.filter((link) => link.path !== "/").map((link) => (
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

            {/* Mobile auth actions */}
            <div className="border-t border-border mt-2 pt-3">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-primary bg-primary/10"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Minha Area
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-primary bg-primary/10"
                >
                  <User className="w-4 h-4" />
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;

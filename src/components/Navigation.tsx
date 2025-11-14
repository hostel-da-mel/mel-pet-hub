import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PawPrint, Calendar, User, MessageSquare, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <PawPrint className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold bg-gradient-to-r from-honey-gold to-honey-dark bg-clip-text text-transparent">
              Hostel da Mel
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Início
            </Link>
            <Link 
              to="/register" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/register") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Cadastro
            </Link>
            <Link 
              to="/booking" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/booking") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Reservas
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="hidden sm:flex">
              <Link to="/contact">
                <MessageSquare className="w-4 h-4" />
                Contato
              </Link>
            </Button>
            {isAuthenticated ? (
              <>
                <Button asChild variant="outline" size="sm">
                  <Link to="/pet-register">
                    <PawPrint className="w-4 h-4" />
                    Meus Pets
                  </Link>
                </Button>
                <Button onClick={handleLogout} variant="ghost" size="sm">
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

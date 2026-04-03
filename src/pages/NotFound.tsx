import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PawPrint, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-cream">
      <div className="text-center px-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <PawPrint className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Pagina nao encontrada</h2>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          Parece que essa pagina se perdeu. Mas nao se preocupe, vamos te levar de volta!
        </p>
        <Button asChild size="lg">
          <Link to="/">
            <Home className="w-4 h-4" />
            Voltar ao Inicio
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

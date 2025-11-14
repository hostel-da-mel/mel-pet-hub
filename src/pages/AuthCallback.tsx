import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAuthenticatedUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get("code");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError("Autenticação cancelada ou falhou.");
        toast({
          title: "Erro na autenticação",
          description: "A autenticação com Google foi cancelada ou falhou.",
          variant: "destructive",
        });
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      if (!code) {
        setError("Código de autenticação não encontrado.");
        toast({
          title: "Erro",
          description: "Código de autenticação não encontrado.",
          variant: "destructive",
        });
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      try {
        const response = await api.handleGoogleCallback(code);

        toast({
          title: "Login realizado!",
          description: response?.user?.nome
            ? `Bem-vindo, ${response.user.nome}!`
            : "Bem-vindo!",
        });

        setAuthenticatedUser(response.user ?? null);
        navigate("/pet-register");
      } catch (error: any) {
        console.error("Erro no callback:", error);
        setError(error.message || "Erro ao processar autenticação.");
        toast({
          title: "Erro ao fazer login",
          description: error.message || "Não foi possível completar a autenticação.",
          variant: "destructive",
        });
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    processCallback();
  }, [searchParams, navigate, toast, setAuthenticatedUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-cream">
      <div className="text-center space-y-4">
        {!error ? (
          <>
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
            <h2 className="text-2xl font-semibold">Processando autenticação...</h2>
            <p className="text-muted-foreground">Aguarde enquanto completamos seu login.</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-semibold text-destructive">Erro na autenticação</h2>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground">Redirecionando para o login...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;

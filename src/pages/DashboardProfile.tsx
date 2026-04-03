import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Phone, Shield } from "lucide-react";

const DashboardProfile = () => {
  const { user } = useAuth();

  const initials = user?.nome
    ? user.nome
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "??";

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <User className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          Meu Perfil
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Visualize suas informacoes de cadastro
        </p>
      </div>

      <div className="max-w-2xl">
        {/* Profile card */}
        <Card className="mb-6">
          <CardContent className="pt-6 pb-6">
            {/* Avatar + name row */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-honey-gold to-honey-dark rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-2xl font-bold text-white">{initials}</span>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold">{user?.nome}</h2>
                <p className="text-sm text-muted-foreground mb-2">
                  {user?.email}
                </p>
                <Badge
                  variant="secondary"
                  className="bg-accent/10 text-accent border-0 text-xs"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Cliente
                </Badge>
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Info fields */}
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                    Nome completo
                  </p>
                  <p className="font-medium truncate">{user?.nome || "—"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                    E-mail
                  </p>
                  <p className="font-medium truncate">{user?.email || "—"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                    Telefone
                  </p>
                  <p className="font-medium">
                    {user?.telefone || "Nao informado"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-4 px-4 sm:px-6">
            <div className="flex gap-3">
              <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  Seguranca dos seus dados
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Suas informacoes estao protegidas. Para alterar dados cadastrais
                  como nome, e-mail ou telefone, entre em contato conosco pelo
                  canal de atendimento.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DashboardProfile;

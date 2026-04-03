import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  Mail,
  Phone,
  Shield,
} from "lucide-react";

const DashboardProfile = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User className="w-8 h-8 text-primary" />
          Meu Perfil
        </h1>
        <p className="text-muted-foreground mt-1">
          Visualize suas informacoes de cadastro
        </p>
      </div>

      <div className="max-w-3xl">
        {/* Profile card */}
        <Card className="mb-6 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-honey-gold to-honey-dark" />
          <div className="px-6 pb-6">
            <div className="flex items-end gap-4 -mt-10 mb-6">
              <div className="w-20 h-20 bg-card rounded-2xl border-4 border-card flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div className="pb-1">
                <h2 className="text-xl font-bold">{user?.nome}</h2>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-accent/10 text-accent border-0 text-xs"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Cliente
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome completo
                </Label>
                <Input
                  value={user?.nome || ""}
                  disabled
                  className="bg-muted/50 font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  E-mail
                </Label>
                <Input
                  value={user?.email || ""}
                  disabled
                  className="bg-muted/50 font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefone
                </Label>
                <Input
                  value={user?.telefone || "Nao informado"}
                  disabled
                  className="bg-muted/50 font-medium"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Info card */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">
                  Seguranca dos seus dados
                </h3>
                <p className="text-sm text-muted-foreground">
                  Suas informacoes estao protegidas. Para alterar dados cadastrais
                  como nome, e-mail ou telefone, entre em contato conosco pelo canal
                  de atendimento.
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

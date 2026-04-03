import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { formatPhoneNumber } from "@/lib/phone-mask";
import {
  User,
  Mail,
  Phone,
  Shield,
  Pencil,
  X,
  Loader2,
  Check,
  Lock,
} from "lucide-react";

const DashboardProfile = () => {
  const { user, setAuthenticatedUser } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nome: user?.nome || "",
    telefone: user?.telefone || "",
  });

  const initials = user?.nome
    ? user.nome
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "??";

  const startEditing = () => {
    setFormData({
      nome: user?.nome || "",
      telefone: user?.telefone || "",
    });
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    if (!formData.nome.trim()) {
      toast({
        title: "Campo obrigatorio",
        description: "O nome nao pode ficar vazio.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const updatedUser = await api.updateProfile({
        nome: formData.nome.trim(),
        telefone: formData.telefone.trim(),
      });

      setAuthenticatedUser(updatedUser);
      setEditing(false);
      toast({
        title: "Perfil atualizado",
        description: "Seus dados foram salvos com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <User className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            Meu Perfil
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {editing
              ? "Edite suas informacoes abaixo"
              : "Visualize e gerencie suas informacoes"}
          </p>
        </div>

        {!editing && (
          <Button onClick={startEditing} variant="outline" size="sm">
            <Pencil className="w-4 h-4" />
            Editar Perfil
          </Button>
        )}
      </div>

      <div className="max-w-2xl">
        {/* Profile card */}
        <Card className="mb-6">
          <CardContent className="pt-6 pb-6">
            {/* Avatar + name row */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-honey-gold to-honey-dark rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <span className="text-2xl font-bold text-white">
                  {initials}
                </span>
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

            {editing ? (
              /* Edit mode */
              <div className="space-y-5">
                {/* Email - read only */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4" />
                    E-mail
                    <span className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full ml-1">
                      <Lock className="w-3 h-3" />
                      Nao editavel
                    </span>
                  </Label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="bg-muted/50"
                  />
                </div>

                {/* Name - editable */}
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-nome"
                    className="flex items-center gap-2 text-sm"
                  >
                    <User className="w-4 h-4 text-primary" />
                    Nome completo *
                  </Label>
                  <Input
                    id="edit-nome"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    placeholder="Seu nome completo"
                    className="border-primary/30 focus-visible:ring-primary"
                  />
                </div>

                {/* Phone - editable */}
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-telefone"
                    className="flex items-center gap-2 text-sm"
                  >
                    <Phone className="w-4 h-4 text-primary" />
                    Telefone
                  </Label>
                  <Input
                    id="edit-telefone"
                    value={formData.telefone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        telefone: formatPhoneNumber(e.target.value),
                      })
                    }
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    className="border-primary/30 focus-visible:ring-primary"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 sm:flex-none"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Salvar Alteracoes
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={cancelEditing}
                    variant="outline"
                    disabled={saving}
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              /* View mode */
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                      Nome completo
                    </p>
                    <p className="font-medium truncate">
                      {user?.nome || "\u2014"}
                    </p>
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
                    <p className="font-medium truncate">
                      {user?.email || "\u2014"}
                    </p>
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
            )}
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
                  Sobre a edicao do perfil
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Voce pode alterar seu nome e telefone a qualquer momento.
                  O e-mail nao pode ser alterado pois e utilizado como identificador
                  da sua conta.
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

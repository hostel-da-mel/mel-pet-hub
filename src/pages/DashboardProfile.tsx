import { useRef, useState } from "react";
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
  MapPin,
  Cake,
  Camera,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";

const DashboardProfile = () => {
  const { user, setAuthenticatedUser } = useAuth();
  const { toast } = useToast();
  const isGoogleUser = user?.provider === "google";
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });
  const [formData, setFormData] = useState({
    nome: user?.nome || "",
    telefone: user?.telefone || "",
    endereco: user?.endereco || "",
    aniversario: user?.aniversario || "",
  });

  const initials = user?.nome
    ? user.nome
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "??";

  const profilePhotoUrl = user?.picture || null;

  const startEditing = () => {
    setFormData({
      nome: user?.nome || "",
      telefone: user?.telefone || "",
      endereco: user?.endereco || "",
      aniversario: user?.aniversario || "",
    });
    setPhotoPreview(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    setPhotoPreview(null);
    setEditing(false);
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Arquivo invalido",
        description: "Selecione uma imagem (JPG, PNG, etc).",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no maximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload
    if (!user?.email) return;
    setUploadingPhoto(true);
    try {
      const photoUrl = await api.uploadProfilePhoto(user.email, file);

      // Save URL in Cognito profile
      const updatedUser = await api.updateProfile({ picture: photoUrl });
      setAuthenticatedUser(updatedUser);

      toast({
        title: "Foto atualizada",
        description: "Sua foto de perfil foi salva com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao enviar foto",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
      setPhotoPreview(null);
    } finally {
      setUploadingPhoto(false);
    }
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
        endereco: formData.endereco.trim() || undefined,
        aniversario: formData.aniversario || undefined,
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

  const handleChangePassword = async () => {
    if (!passwordData.senhaAtual || !passwordData.novaSenha || !passwordData.confirmarSenha) {
      toast({
        title: "Campos obrigatorios",
        description: "Preencha todos os campos de senha.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.novaSenha !== passwordData.confirmarSenha) {
      toast({
        title: "Senhas nao conferem",
        description: "A nova senha e a confirmacao devem ser iguais.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.novaSenha.length < 8) {
      toast({
        title: "Senha muito curta",
        description: "A nova senha deve ter no minimo 8 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setSavingPassword(true);
    try {
      await api.changePassword(passwordData.senhaAtual, passwordData.novaSenha);
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso.",
      });
      setPasswordData({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
      setShowPasswordForm(false);
    } catch (error: any) {
      toast({
        title: "Erro ao alterar senha",
        description: error.message || "Verifique a senha atual e tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const avatarSrc = photoPreview || profilePhotoUrl;

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
              <div className="relative group">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="Foto de perfil"
                    className="w-20 h-20 rounded-full object-cover shadow-md flex-shrink-0"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <div
                  className={`w-20 h-20 bg-gradient-to-br from-honey-gold to-honey-dark rounded-full flex items-center justify-center shadow-md flex-shrink-0 ${
                    avatarSrc ? "hidden" : ""
                  }`}
                >
                  <span className="text-2xl font-bold text-white">
                    {initials}
                  </span>
                </div>

                {/* Photo upload overlay */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="absolute inset-0 w-20 h-20 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  {uploadingPhoto ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>

              <div className="text-center sm:text-left">
                <h2 className="text-xl font-bold">{user?.nome}</h2>
                <p className="text-sm text-muted-foreground mb-1">
                  {user?.email}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  Clique na foto para alterar
                </p>
                <Badge
                  variant="secondary"
                  className="bg-accent/10 text-accent border-0 text-xs"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {user?.role === "admin" ? "Administrador" : "Cliente"}
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
                    Telefone *
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

                {/* Address - editable */}
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-endereco"
                    className="flex items-center gap-2 text-sm"
                  >
                    <MapPin className="w-4 h-4 text-primary" />
                    Endereco Completo
                  </Label>
                  <Input
                    id="edit-endereco"
                    value={formData.endereco}
                    onChange={(e) =>
                      setFormData({ ...formData, endereco: e.target.value })
                    }
                    placeholder="Rua, numero, bairro, cidade"
                    className="border-primary/30 focus-visible:ring-primary"
                  />
                </div>

                {/* Birthday - editable */}
                <div className="space-y-2">
                  <Label
                    htmlFor="edit-aniversario"
                    className="flex items-center gap-2 text-sm"
                  >
                    <Cake className="w-4 h-4 text-primary" />
                    Data de Aniversario
                  </Label>
                  <Input
                    id="edit-aniversario"
                    type="date"
                    value={formData.aniversario}
                    onChange={(e) =>
                      setFormData({ ...formData, aniversario: e.target.value })
                    }
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

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                      Endereco
                    </p>
                    <p className="font-medium">
                      {user?.endereco || "Nao informado"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Cake className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
                      Aniversario
                    </p>
                    <p className="font-medium">
                      {user?.aniversario
                        ? new Date(user.aniversario + "T00:00:00").toLocaleDateString("pt-BR")
                        : "Nao informado"}
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
                  Voce pode alterar seu nome, telefone, endereco e data de aniversario a qualquer momento.
                  O e-mail nao pode ser alterado pois e utilizado como identificador
                  da sua conta. O telefone e obrigatorio para realizar reservas.
                  Para alterar a foto, basta passar o mouse sobre ela e clicar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password change section — only for email/password users */}
        {!isGoogleUser && (
          <Card className="mt-6">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-primary" />
                  Alterar Senha
                </h3>
                {!showPasswordForm && (
                  <Button
                    onClick={() => setShowPasswordForm(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Pencil className="w-4 h-4" />
                    Alterar
                  </Button>
                )}
              </div>

              {showPasswordForm ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="senha-atual" className="flex items-center gap-2 text-sm">
                      <Lock className="w-4 h-4 text-primary" />
                      Senha atual *
                    </Label>
                    <div className="relative">
                      <Input
                        id="senha-atual"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.senhaAtual}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, senhaAtual: e.target.value })
                        }
                        placeholder="Digite sua senha atual"
                        className="border-primary/30 focus-visible:ring-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nova-senha" className="flex items-center gap-2 text-sm">
                      <KeyRound className="w-4 h-4 text-primary" />
                      Nova senha *
                    </Label>
                    <div className="relative">
                      <Input
                        id="nova-senha"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.novaSenha}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, novaSenha: e.target.value })
                        }
                        placeholder="Digite a nova senha"
                        className="border-primary/30 focus-visible:ring-primary pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmar-senha" className="flex items-center gap-2 text-sm">
                      <KeyRound className="w-4 h-4 text-primary" />
                      Confirmar nova senha *
                    </Label>
                    <Input
                      id="confirmar-senha"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.confirmarSenha}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmarSenha: e.target.value })
                      }
                      placeholder="Confirme a nova senha"
                      className="border-primary/30 focus-visible:ring-primary"
                    />
                    {passwordData.novaSenha && passwordData.confirmarSenha && passwordData.novaSenha !== passwordData.confirmarSenha && (
                      <p className="text-xs text-destructive">As senhas nao conferem</p>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    A senha deve ter no minimo 8 caracteres, com letras maiusculas, minusculas, numeros e caracteres especiais.
                  </p>

                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={handleChangePassword}
                      disabled={savingPassword}
                      className="flex-1 sm:flex-none"
                    >
                      {savingPassword ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Alterando...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Alterar Senha
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
                      }}
                      variant="outline"
                      disabled={savingPassword}
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Voce pode alterar sua senha a qualquer momento. Sera necessario informar a senha atual.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Google user info */}
        {isGoogleUser && (
          <Card className="mt-6 border-blue-200 bg-blue-50/50">
            <CardContent className="py-4 px-4 sm:px-6">
              <div className="flex gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">
                    Conta Google
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Sua conta esta vinculada ao Google. A autenticacao e gerenciada pela sua conta Google,
                    por isso nao e possivel alterar a senha por aqui.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardProfile;

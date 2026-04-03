import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import type { AdminUser, Pet } from "@/types/api";
import {
  Users,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Ban,
  CheckCircle,
  Mail,
  Phone,
  PawPrint,
  ChevronDown,
  ChevronUp,
  MailCheck,
  MailX,
} from "lucide-react";

const AdminUsers = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [userPets, setUserPets] = useState<Record<string, Pet[]>>({});
  const [loadingPets, setLoadingPets] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      const data = await api.adminListUsers();
      setUsers(data);
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao carregar usuarios.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const toggleUserPets = async (sub: string) => {
    if (expandedUser === sub) {
      setExpandedUser(null);
      return;
    }

    setExpandedUser(sub);

    if (userPets[sub]) return;

    setLoadingPets(sub);
    try {
      const pets = await api.adminListUserPets(sub);
      setUserPets((prev) => ({ ...prev, [sub]: pets }));
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao carregar pets do usuario.",
        variant: "destructive",
      });
    } finally {
      setLoadingPets(null);
    }
  };

  const handleDisable = async (sub: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja bloquear "${nome}"?`)) return;
    setActionLoading(sub);
    try {
      await api.adminDisableUser(sub);
      toast({ title: "Usuario bloqueado", description: `${nome} foi bloqueado.` });
      await loadUsers();
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao bloquear usuario.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleEnable = async (sub: string, nome: string) => {
    setActionLoading(sub);
    try {
      await api.adminEnableUser(sub);
      toast({ title: "Usuario desbloqueado", description: `${nome} foi desbloqueado.` });
      await loadUsers();
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao desbloquear usuario.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (sub: string, nome: string) => {
    if (
      !confirm(
        `ATENCAO: Essa acao e irreversivel!\n\nTem certeza que deseja excluir "${nome}" permanentemente?`
      )
    )
      return;
    setActionLoading(sub);
    try {
      await api.adminDeleteUser(sub);
      toast({ title: "Usuario excluido", description: `${nome} foi removido.` });
      await loadUsers();
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao excluir usuario.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "ativo":
        return (
          <Badge className="bg-accent/10 text-accent border-0 text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Ativo
          </Badge>
        );
      case "bloqueado":
        return (
          <Badge className="bg-destructive/10 text-destructive border-0 text-xs">
            <Ban className="w-3 h-3 mr-1" />
            Bloqueado
          </Badge>
        );
      case "pendente":
        return (
          <Badge className="bg-honey-gold/10 text-honey-dark border-0 text-xs">
            <ShieldAlert className="w-3 h-3 mr-1" />
            Pendente
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const roleBadge = (role: string) => {
    if (role === "admin") {
      return (
        <Badge className="bg-primary/10 text-primary border-0 text-xs">
          <ShieldCheck className="w-3 h-3 mr-1" />
          Admin
        </Badge>
      );
    }
    return null;
  };

  const emailVerifiedBadge = (verified: boolean) => {
    if (verified) {
      return (
        <Badge className="bg-accent/10 text-accent border-0 text-xs">
          <MailCheck className="w-3 h-3 mr-1" />
          Verificado
        </Badge>
      );
    }
    return (
      <Badge className="bg-honey-gold/10 text-honey-dark border-0 text-xs">
        <MailX className="w-3 h-3 mr-1" />
        Nao verificado
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <Users className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          Gerenciar Usuarios
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Visualize, bloqueie ou exclua contas de usuarios
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {users.length} usuario(s) encontrado(s)
          </p>

          <div className="space-y-3">
            {users.map((u) => {
              const isCurrentUser = u.sub === currentUser?.sub;
              const isLoading = actionLoading === u.sub;
              const isExpanded = expandedUser === u.sub;
              const pets = userPets[u.sub];
              const isPetsLoading = loadingPets === u.sub;

              return (
                <Card
                  key={u.sub}
                  className={`overflow-hidden transition-colors ${
                    u.status === "bloqueado" ? "opacity-70" : ""
                  }`}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* User info */}
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold truncate">
                              {u.nome || "Sem nome"}
                            </p>
                            {roleBadge(u.role)}
                            {statusBadge(u.status)}
                            {emailVerifiedBadge(u.email_verified)}
                            {isCurrentUser && (
                              <Badge variant="outline" className="text-xs">
                                Voce
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1 truncate">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              {u.email}
                            </span>
                            {u.telefone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 flex-shrink-0" />
                                {u.telefone}
                              </span>
                            )}
                          </div>
                          {u.created_at && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Cadastro:{" "}
                              {new Date(u.created_at).toLocaleDateString("pt-BR")}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserPets(u.sub)}
                          className="text-primary border-primary/30 hover:bg-primary/10"
                        >
                          <PawPrint className="w-4 h-4" />
                          <span className="hidden sm:inline">Pets</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </Button>

                        {!isCurrentUser && (
                          <>
                            {isLoading ? (
                              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                            ) : (
                              <>
                                {u.status === "bloqueado" ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleEnable(u.sub, u.nome || u.email)
                                    }
                                    className="text-accent border-accent/30 hover:bg-accent/10"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="hidden sm:inline">
                                      Desbloquear
                                    </span>
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleDisable(u.sub, u.nome || u.email)
                                    }
                                    className="text-honey-dark border-honey-gold/30 hover:bg-honey-gold/10"
                                  >
                                    <Ban className="w-4 h-4" />
                                    <span className="hidden sm:inline">
                                      Bloquear
                                    </span>
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleDelete(u.sub, u.nome || u.email)
                                  }
                                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span className="hidden sm:inline">
                                    Excluir
                                  </span>
                                </Button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Expanded pets section */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <PawPrint className="w-4 h-4 text-primary" />
                          Pets de {u.nome || u.email}
                        </h4>

                        {isPetsLoading ? (
                          <div className="flex items-center gap-2 py-4 justify-center text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Carregando pets...</span>
                          </div>
                        ) : pets && pets.length > 0 ? (
                          <div className="grid gap-3 sm:grid-cols-2">
                            {pets.map((pet) => (
                              <div
                                key={pet.id}
                                className="p-3 rounded-lg border bg-muted/30"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <PawPrint className="w-4 h-4 text-primary" />
                                  <span className="font-semibold text-sm">
                                    {pet.nome}
                                  </span>
                                </div>
                                <div className="space-y-1 text-xs text-muted-foreground">
                                  <p>
                                    Raca: <span className="text-foreground">{pet.raca}</span>
                                  </p>
                                  <p>
                                    Peso: <span className="text-foreground">{pet.peso}kg</span>
                                  </p>
                                  {pet.aniversario && (
                                    <p>
                                      Aniversario:{" "}
                                      <span className="text-foreground">{pet.aniversario}</span>
                                    </p>
                                  )}
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {pet.castrado && (
                                      <Badge variant="secondary" className="text-xs py-0">
                                        Castrado
                                      </Badge>
                                    )}
                                    {pet.adestrado && (
                                      <Badge variant="secondary" className="text-xs py-0">
                                        Adestrado
                                      </Badge>
                                    )}
                                    {pet.frequenta_creche && (
                                      <Badge variant="secondary" className="text-xs py-0">
                                        Creche
                                      </Badge>
                                    )}
                                  </div>
                                  {pet.alimentacao && (
                                    <p className="mt-1">
                                      Alimentacao:{" "}
                                      <span className="text-foreground">{pet.alimentacao}</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground py-2">
                            Nenhum pet cadastrado.
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminUsers;

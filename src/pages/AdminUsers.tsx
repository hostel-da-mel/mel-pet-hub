import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import type { AdminUser } from "@/types/api";
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
} from "lucide-react";

const AdminUsers = () => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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
                      {!isCurrentUser && (
                        <div className="flex items-center gap-2 flex-shrink-0">
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
                        </div>
                      )}
                    </div>
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

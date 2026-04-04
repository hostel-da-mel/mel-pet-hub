import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import type { Booking } from "@/types/api";
import {
  CalendarCheck,
  Loader2,
  CheckCircle,
  XCircle,
  Hourglass,
  PawPrint,
  Calendar,
  Clock,
  User,
  CreditCard,
  ClipboardList,
} from "lucide-react";

const periodoLabels: Record<string, string> = {
  manha: "Manha (8h - 12h)",
  tarde: "Tarde (12h - 18h)",
  noite: "Noite (18h - 20h)",
};

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

type StatusFilter = "todas" | "pendente" | "confirmada" | "rejeitada";

const AdminBookings = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectMotivo, setRejectMotivo] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("todas");

  const loadBookings = useCallback(async () => {
    try {
      const data = await api.adminListBookings();
      setBookings(data);
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao carregar reservas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleConfirm = async (id: string) => {
    setActionLoading(id);
    try {
      await api.adminConfirmBooking(id);
      toast({ title: "Reserva confirmada" });
      await loadBookings();
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao confirmar reserva.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await api.adminRejectBooking(id, rejectMotivo);
      toast({ title: "Reserva rejeitada" });
      setRejectingId(null);
      setRejectMotivo("");
      await loadBookings();
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao rejeitar reserva.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const statusConfig = {
    pendente: {
      label: "Pendente",
      icon: Hourglass,
      className: "bg-honey-gold/10 text-honey-dark border-0",
    },
    confirmada: {
      label: "Confirmada",
      icon: CheckCircle,
      className: "bg-accent/10 text-accent border-0",
    },
    rejeitada: {
      label: "Rejeitada",
      icon: XCircle,
      className: "bg-destructive/10 text-destructive border-0",
    },
  };

  const filtered = bookings
    .filter((b) => filter === "todas" || b.status === filter)
    .sort((a, b) => {
      // Pendentes first, then by date desc
      if (a.status === "pendente" && b.status !== "pendente") return -1;
      if (a.status !== "pendente" && b.status === "pendente") return 1;
      return b.created_at.localeCompare(a.created_at);
    });

  const pendingCount = bookings.filter((b) => b.status === "pendente").length;

  return (
    <DashboardLayout>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <ClipboardList className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          Gerenciar Reservas
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Confirme ou rejeite solicitacoes de reservas dos clientes
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card
          className={`cursor-pointer transition-colors ${
            filter === "todas" ? "border-primary border-2" : ""
          }`}
          onClick={() => setFilter("todas")}
        >
          <CardContent className="p-3 sm:p-4 text-center">
            <p className="text-2xl font-bold">{bookings.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-colors ${
            filter === "pendente" ? "border-honey-gold border-2" : ""
          }`}
          onClick={() => setFilter("pendente")}
        >
          <CardContent className="p-3 sm:p-4 text-center">
            <p className="text-2xl font-bold text-honey-dark">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-colors ${
            filter === "confirmada" ? "border-accent border-2" : ""
          }`}
          onClick={() => setFilter("confirmada")}
        >
          <CardContent className="p-3 sm:p-4 text-center">
            <p className="text-2xl font-bold text-accent">
              {bookings.filter((b) => b.status === "confirmada").length}
            </p>
            <p className="text-xs text-muted-foreground">Confirmadas</p>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-colors ${
            filter === "rejeitada" ? "border-destructive border-2" : ""
          }`}
          onClick={() => setFilter("rejeitada")}
        >
          <CardContent className="p-3 sm:p-4 text-center">
            <p className="text-2xl font-bold text-destructive">
              {bookings.filter((b) => b.status === "rejeitada").length}
            </p>
            <p className="text-xs text-muted-foreground">Rejeitadas</p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarCheck className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {filter === "todas"
                  ? "Nenhuma reserva encontrada"
                  : `Nenhuma reserva ${filter}`}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {filter === "pendente"
                  ? "Nao ha reservas aguardando confirmacao no momento."
                  : "As reservas dos clientes aparecerao aqui."}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking) => {
            const sc = statusConfig[booking.status];
            const StatusIcon = sc.icon;
            const isLoading = actionLoading === booking.id;
            const isRejecting = rejectingId === booking.id;

            return (
              <Card
                key={booking.id}
                className={`overflow-hidden ${
                  booking.status === "pendente"
                    ? "border-honey-gold/40 border-2"
                    : ""
                }`}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4">
                    {/* Header: status + user */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {booking.usuario_nome || booking.usuario_email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {booking.usuario_email}
                          </p>
                        </div>
                      </div>
                      <Badge className={sc.className}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {sc.label}
                      </Badge>
                    </div>

                    {/* Details */}
                    <div className="grid sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="capitalize">
                          {formatDate(booking.data_entrada)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span>
                          {periodoLabels[booking.periodo] || booking.periodo} — {booking.duracao} dia(s)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <PawPrint className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span>
                          {booking.pets.map((p) => p.nome).join(", ")} ({booking.pets.length} pet{booking.pets.length > 1 ? "s" : ""})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span>
                          R$ {booking.valor_total.toFixed(2).replace(".", ",")} — {booking.pagamento === "pix" ? "PIX" : "Cartao"}
                        </span>
                      </div>
                    </div>

                    {booking.status === "rejeitada" && booking.motivo_rejeicao && (
                      <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                        <p className="text-sm text-destructive">
                          <strong>Motivo:</strong> {booking.motivo_rejeicao}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Solicitada em{" "}
                      {new Date(booking.created_at).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>

                    {/* Actions for pending bookings */}
                    {booking.status === "pendente" && (
                      <div className="border-t border-border pt-4">
                        {isRejecting ? (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor={`motivo-${booking.id}`}>
                                Motivo da rejeicao (opcional)
                              </Label>
                              <Input
                                id={`motivo-${booking.id}`}
                                placeholder="Ex: Sem vagas disponiveis, data indisponivel..."
                                value={rejectMotivo}
                                onChange={(e) => setRejectMotivo(e.target.value)}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleReject(booking.id)}
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <XCircle className="w-4 h-4" />
                                )}
                                Confirmar Rejeicao
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setRejectingId(null);
                                  setRejectMotivo("");
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleConfirm(booking.id)}
                              disabled={isLoading}
                              className="bg-accent hover:bg-accent/90"
                            >
                              {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                              Confirmar Reserva
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setRejectingId(booking.id)}
                              className="text-destructive border-destructive/30 hover:bg-destructive/10"
                            >
                              <XCircle className="w-4 h-4" />
                              Rejeitar
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminBookings;

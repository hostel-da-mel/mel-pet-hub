import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import type { BlockedDate } from "@/types/api";
import {
  CalendarOff,
  Plus,
  Trash2,
  Loader2,
  X,
  CalendarDays,
} from "lucide-react";

const AdminBlockedDates = () => {
  const { toast } = useToast();
  const [dates, setDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ date: "", reason: "" });

  const loadDates = useCallback(async () => {
    try {
      const data = await api.adminListBlockedDates();
      // Sort by date ascending
      data.sort((a, b) => a.date.localeCompare(b.date));
      setDates(data);
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao carregar datas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDates();
  }, [loadDates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date) return;
    setSubmitting(true);
    try {
      await api.adminCreateBlockedDate(formData.date, formData.reason);
      toast({
        title: "Data adicionada",
        description: `${formatDate(formData.date)} foi bloqueada.`,
      });
      setFormData({ date: "", reason: "" });
      setShowForm(false);
      await loadDates();
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao adicionar data.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, date: string) => {
    if (!confirm(`Remover o bloqueio de ${formatDate(date)}?`)) return;
    setDeletingId(id);
    try {
      await api.adminDeleteBlockedDate(id);
      toast({ title: "Data removida", description: "Bloqueio removido." });
      await loadDates();
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao remover data.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const isPast = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateStr + "T00:00:00") < today;
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <CalendarOff className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            Datas Bloqueadas
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Gerencie feriados e dias sem funcionamento
          </p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) setFormData({ date: "", reason: "" });
          }}
          variant={showForm ? "outline" : "default"}
        >
          {showForm ? (
            <>
              <X className="w-4 h-4" />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Adicionar Data
            </>
          )}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="mb-6 border-2 border-primary/20 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="w-5 h-5 text-primary" />
              Nova Data Bloqueada
            </CardTitle>
            <CardDescription>
              Adicione uma data em que o hostel nao ira funcionar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Data *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Motivo</Label>
                  <Input
                    id="reason"
                    placeholder="Ex: Feriado, manutencao, ferias"
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <CalendarOff className="w-4 h-4" />
                    Bloquear Data
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : dates.length === 0 && !showForm ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarDays className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Nenhuma data bloqueada
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Adicione datas de feriados ou dias em que o hostel nao vai
                funcionar para manter o calendario atualizado.
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4" />
                Adicionar Primeira Data
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {dates.map((d) => (
            <Card
              key={d.id}
              className={`overflow-hidden transition-colors ${
                isPast(d.date) ? "opacity-60" : ""
              }`}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isPast(d.date)
                          ? "bg-muted"
                          : "bg-destructive/10"
                      }`}
                    >
                      <CalendarOff
                        className={`w-5 h-5 ${
                          isPast(d.date)
                            ? "text-muted-foreground"
                            : "text-destructive"
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold capitalize">
                        {formatDate(d.date)}
                      </p>
                      {d.reason && (
                        <p className="text-sm text-muted-foreground truncate">
                          {d.reason}
                        </p>
                      )}
                      {isPast(d.date) && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Data passada
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(d.id, d.date)}
                    disabled={deletingId === d.id}
                    className="text-destructive border-destructive/30 hover:bg-destructive/10 flex-shrink-0"
                  >
                    {deletingId === d.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">Remover</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminBlockedDates;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import type { Pet, Booking } from "@/types/api";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar as CalendarIcon,
  Clock,
  FileText,
  Loader2,
  PawPrint,
  Plus,
  Send,
  CheckCircle,
  XCircle,
  Hourglass,
  CreditCard,
  AlertTriangle,
  User,
} from "lucide-react";

const DAILY_RATE = 80;

const durationOptions = [
  { value: "1", label: "1 dia" },
  { value: "2", label: "2 dias" },
  { value: "3", label: "3 dias" },
  { value: "5", label: "5 dias" },
  { value: "7", label: "1 semana" },
  { value: "14", label: "2 semanas" },
];

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

const BookingPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const hasTelefone = !!(user?.telefone && user.telefone.trim().length > 0);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [periodo, setPeriodo] = useState("manha");
  const [duracao, setDuracao] = useState("3");
  const [pagamento, setPagamento] = useState("pix");
  const [submitting, setSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const petsData = await api.getPets();
        setPets(petsData);
      } catch {
        // handled by empty state
      } finally {
        setLoadingPets(false);
      }

      try {
        const bookingsData = await api.getMyBookings();
        setBookings(bookingsData);
      } catch {
        // bookings table may not exist yet
      } finally {
        setLoadingBookings(false);
      }
    };
    loadData();
  }, []);

  const togglePet = (petId: string) => {
    setSelectedPets((prev) =>
      prev.includes(petId)
        ? prev.filter((id) => id !== petId)
        : [...prev, petId]
    );
  };

  const totalPerPet = DAILY_RATE * parseInt(duracao);
  const total = totalPerPet * Math.max(selectedPets.length, 1);
  const duracaoLabel = durationOptions.find((d) => d.value === duracao)?.label || "";

  const canSubmit = date && selectedPets.length > 0 && duracao && acceptedTerms && !submitting && hasTelefone;

  const handleBooking = async () => {
    if (!canSubmit || !date) return;

    setSubmitting(true);
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dataEntrada = `${year}-${month}-${day}`;

      const newBooking = await api.createBooking({
        pet_ids: selectedPets,
        data_entrada: dataEntrada,
        periodo,
        duracao: parseInt(duracao),
        pagamento,
      });

      setBookings((prev) => [newBooking, ...prev]);
      setDate(undefined);
      setSelectedPets([]);
      setDuracao("3");
      setPeriodo("manha");
      setPagamento("pix");

      toast({
        title: "Reserva enviada!",
        description:
          "Sua reserva foi enviada para confirmacao. Em poucos instantes voce recebera uma resposta da anfitria.",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao enviar reserva. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const statusConfig = {
    pendente: {
      label: "Aguardando confirmacao",
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

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">Faca sua Reserva</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Escolha a data e periodo para a hospedagem do seu pet
          </p>
        </div>

        {/* Phone missing alert */}
        {!hasTelefone && (
          <Card className="mb-6 sm:mb-8 border-2 border-honey-gold/50 bg-honey-gold/5">
            <CardContent className="py-4 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 bg-honey-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-honey-dark" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-honey-dark mb-1">
                    Complete seu cadastro para fazer reservas
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Para realizar uma reserva, e necessario ter o telefone cadastrado no seu perfil.
                    Precisamos do seu telefone para entrar em contato sobre a reserva.
                  </p>
                </div>
                <Button asChild size="sm" className="flex-shrink-0">
                  <Link to="/dashboard/perfil">
                    <User className="w-4 h-4" />
                    Completar Perfil
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Selecione a Data</CardTitle>
              <CardDescription>
                Escolha o dia de entrada do seu pet
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                disabled={(d) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return d < today;
                }}
              />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes da Reserva</CardTitle>
                <CardDescription>
                  Preencha as informacoes da hospedagem
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Data de Entrada</Label>
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    {date
                      ? date.toLocaleDateString("pt-BR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Selecione uma data no calendario"}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="periodo">Periodo de Entrada</Label>
                  <Select value={periodo} onValueChange={setPeriodo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o periodo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manha">Manha (8h - 12h)</SelectItem>
                      <SelectItem value="tarde">Tarde (12h - 18h)</SelectItem>
                      <SelectItem value="noite">Noite (18h - 20h)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Selecione os Pets</Label>
                  {loadingPets ? (
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Carregando pets...
                    </div>
                  ) : pets.length === 0 ? (
                    <div className="p-4 border-2 border-dashed rounded-lg text-center">
                      <PawPrint className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-3">
                        Voce ainda nao tem pets cadastrados
                      </p>
                      <Button asChild size="sm" variant="outline">
                        <Link to="/dashboard/pets">
                          <Plus className="w-4 h-4" />
                          Cadastrar Pet
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {pets.map((pet) => (
                        <label
                          key={pet.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedPets.includes(pet.id)
                              ? "border-primary bg-primary/5"
                              : "border-border hover:bg-muted"
                          }`}
                        >
                          <Checkbox
                            checked={selectedPets.includes(pet.id)}
                            onCheckedChange={() => togglePet(pet.id)}
                          />
                          <PawPrint className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm font-medium">
                            {pet.nome} — {pet.raca} ({pet.peso}kg)
                          </span>
                        </label>
                      ))}
                      {selectedPets.length > 0 && (
                        <p className="text-xs text-muted-foreground">
                          {selectedPets.length} pet(s) selecionado(s)
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duracao">Duracao</Label>
                  <Select value={duracao} onValueChange={setDuracao}>
                    <SelectTrigger>
                      <SelectValue placeholder="Quantos dias?" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Summary and submit - no payment details until confirmed */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
                <CardDescription>
                  Confira os detalhes antes de enviar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      Valor da diaria (por pet)
                    </span>
                    <span className="font-medium">
                      R$ {DAILY_RATE.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      Duracao
                    </span>
                    <span className="font-medium">{duracaoLabel}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      Quantidade de pets
                    </span>
                    <span className="font-medium">
                      {selectedPets.length || "—"}
                    </span>
                  </div>
                  {selectedPets.length > 1 && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">
                        Subtotal por pet
                      </span>
                      <span className="font-medium">
                        R$ {totalPerPet.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Total estimado</span>
                      <span className="text-2xl font-bold text-primary">
                        R${" "}
                        {selectedPets.length > 0
                          ? total.toFixed(2).replace(".", ",")
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  A forma de pagamento sera informada apos a confirmacao da reserva pela anfitria.
                </p>

                {/* Terms acceptance */}
                <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  acceptedTerms
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted"
                }`}>
                  <Checkbox
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                    className="mt-0.5"
                  />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    Li e concordo com os{" "}
                    <Link
                      to="/termos-de-uso"
                      target="_blank"
                      className="text-primary underline hover:text-primary/80 font-medium"
                    >
                      <FileText className="w-3 h-3 inline mr-0.5" />
                      Termos de Uso
                    </Link>{" "}
                    do Hostel da Mel. Declaro que meu pet esta com a vacinacao em dia
                    e que as informacoes cadastradas estao corretas.
                  </span>
                </label>

                <Button
                  onClick={handleBooking}
                  size="lg"
                  className="w-full"
                  variant="hero"
                  disabled={!canSubmit}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Solicitar Reserva
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* My bookings */}
        <div className="mt-10">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary" />
            Minhas Reservas
          </h2>

          {loadingBookings ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : bookings.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-12 text-center">
                <CalendarIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Voce ainda nao possui reservas.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {bookings
                .sort((a, b) => b.created_at.localeCompare(a.created_at))
                .map((booking) => {
                  const sc = statusConfig[booking.status];
                  const StatusIcon = sc.icon;

                  return (
                    <Card key={booking.id}>
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={sc.className}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {sc.label}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                              <span className="capitalize">
                                {formatDate(booking.data_entrada)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {periodoLabels[booking.periodo] || booking.periodo} — {booking.duracao} dia(s)
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <PawPrint className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {booking.pets.map((p) => p.nome).join(", ")}
                              </span>
                            </div>

                            {booking.status === "rejeitada" && booking.motivo_rejeicao && (
                              <div className="mt-2 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                                <p className="text-sm text-destructive">
                                  <strong>Motivo:</strong> {booking.motivo_rejeicao}
                                </p>
                              </div>
                            )}

                            {booking.status === "pendente" && (
                              <div className="mt-2 p-3 bg-honey-gold/5 border border-honey-gold/20 rounded-lg">
                                <p className="text-sm text-honey-dark">
                                  Sua reserva foi enviada para confirmacao. Em poucos instantes voce recebera uma resposta da anfitria.
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Payment info only for confirmed bookings */}
                          {booking.status === "confirmada" && (
                            <div className="sm:text-right flex-shrink-0">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                                <CreditCard className="w-4 h-4" />
                                Pagamento
                              </div>
                              <p className="text-2xl font-bold text-primary">
                                R$ {booking.valor_total.toFixed(2).replace(".", ",")}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                via {booking.pagamento === "pix" ? "PIX" : "Cartao de Credito"}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookingPage;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import type { Pet } from "@/types/api";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, Loader2, PawPrint, Plus } from "lucide-react";

const DAILY_RATE = 80;

const durationOptions = [
  { value: "1", label: "1 dia" },
  { value: "2", label: "2 dias" },
  { value: "3", label: "3 dias" },
  { value: "5", label: "5 dias" },
  { value: "7", label: "1 semana" },
  { value: "14", label: "2 semanas" },
];

const Booking = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [periodo, setPeriodo] = useState("manha");
  const [duracao, setDuracao] = useState("3");
  const [pagamento, setPagamento] = useState("pix");

  useEffect(() => {
    const loadPets = async () => {
      try {
        const data = await api.getPets();
        setPets(data);
      } catch {
        // handled by empty state
      } finally {
        setLoadingPets(false);
      }
    };
    loadPets();
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

  const canSubmit = date && selectedPets.length > 0 && duracao;

  const handleBooking = () => {
    if (!canSubmit) {
      toast({
        title: "Preencha todos os campos",
        description: "Selecione a data, pelo menos um pet e a duracao.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Reserva solicitada!",
      description: "Em breve voce recebera uma confirmacao por WhatsApp.",
    });
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

            <Card>
              <CardHeader>
                <CardTitle>Pagamento</CardTitle>
                <CardDescription>
                  Escolha a forma de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pagamento">Forma de Pagamento</Label>
                  <Select value={pagamento} onValueChange={setPagamento}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="credito">Cartao de Credito</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

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
                      <span className="font-bold">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        R${" "}
                        {selectedPets.length > 0
                          ? total.toFixed(2).replace(".", ",")
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleBooking}
                  size="lg"
                  className="w-full"
                  variant="hero"
                  disabled={!canSubmit}
                >
                  <CreditCard className="w-5 h-5" />
                  Confirmar Reserva
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Booking;

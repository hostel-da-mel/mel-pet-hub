import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard } from "lucide-react";

const Booking = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleBooking = () => {
    toast({
      title: "Reserva solicitada!",
      description: "Em breve você receberá uma confirmação por WhatsApp.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-cream">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Faça sua Reserva</h1>
            <p className="text-muted-foreground">
              Escolha a data e período para a hospedagem do seu pet
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
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
                  disabled={(date) => date < new Date()}
                />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes da Reserva</CardTitle>
                  <CardDescription>
                    Preencha as informações da hospedagem
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Data de Entrada</Label>
                    <div className="p-3 bg-muted rounded-lg">
                      {date ? date.toLocaleDateString('pt-BR') : "Selecione uma data"}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="periodo">Período de Entrada</Label>
                    <Select defaultValue="manha">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manha">Manhã (8h - 12h)</SelectItem>
                        <SelectItem value="tarde">Tarde (12h - 18h)</SelectItem>
                        <SelectItem value="noite">Noite (18h - 20h)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pet">Selecione o Pet</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha qual pet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pet1">Rex - Yorkshire</SelectItem>
                        <SelectItem value="pet2">Mel - Bulldog</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duracao">Duração (dias)</Label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue placeholder="Quantos dias?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 dia</SelectItem>
                        <SelectItem value="2">2 dias</SelectItem>
                        <SelectItem value="3">3 dias</SelectItem>
                        <SelectItem value="5">5 dias</SelectItem>
                        <SelectItem value="7">1 semana</SelectItem>
                        <SelectItem value="14">2 semanas</SelectItem>
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
                    <Select defaultValue="pix">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="credito">Cartão de Crédito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Valor da diária</span>
                      <span className="font-medium">R$ 80,00</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Duração</span>
                      <span className="font-medium">3 dias</span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Total</span>
                        <span className="text-2xl font-bold text-primary">R$ 240,00</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleBooking} size="lg" className="w-full" variant="hero">
                    <CreditCard className="w-5 h-5" />
                    Confirmar Reserva
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;

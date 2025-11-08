import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MessageSquare, Phone, Mail, MapPin } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve.",
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
            <h1 className="text-4xl font-bold mb-4">Entre em Contato</h1>
            <p className="text-muted-foreground">
              Tire suas dúvidas ou solicite informações adicionais
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Envie uma Mensagem</CardTitle>
                  <CardDescription>
                    Preencha o formulário e responderemos em breve
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome</Label>
                      <Input id="nome" placeholder="Seu nome" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone</Label>
                      <Input id="telefone" type="tel" placeholder="(00) 00000-0000" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mensagem">Mensagem</Label>
                      <Textarea 
                        id="mensagem" 
                        placeholder="Escreva sua mensagem aqui..." 
                        rows={6}
                        required 
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      <MessageSquare className="w-5 h-5" />
                      Enviar Mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="font-medium">Telefone</div>
                      <div className="text-sm text-muted-foreground">(00) 99999-9999</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="font-medium">E-mail</div>
                      <div className="text-sm text-muted-foreground">contato@hosteldamel.com</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="font-medium">Endereço</div>
                      <div className="text-sm text-muted-foreground">
                        Rua dos Pets, 123<br />
                        Bairro Feliz - Cidade
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-honey-gold to-honey-dark text-white border-0">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-2">Horário de Funcionamento</h3>
                  <div className="space-y-2 text-sm text-white/90">
                    <div className="flex justify-between">
                      <span>Segunda - Sexta</span>
                      <span>8h - 20h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sábado</span>
                      <span>8h - 18h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domingo</span>
                      <span>10h - 16h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

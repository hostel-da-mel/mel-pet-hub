import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MessageSquare, Phone, Mail } from "lucide-react";
import { contact } from "@/config/contact";

const Contact = () => {
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
                    O envio pelo formulário ainda não está disponível. Use nosso WhatsApp ou e-mail para falar com a anfitriã.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <fieldset disabled className="space-y-6 opacity-60">
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
                      Envio pelo formulário indisponível
                    </Button>
                  </fieldset>
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
                      <div className="font-medium">WhatsApp</div>
                      <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">
                        {contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <div className="font-medium">E-mail</div>
                      <a href={`mailto:${contact.email}`} className="text-sm text-primary underline break-all">
                        {contact.email}
                      </a>
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

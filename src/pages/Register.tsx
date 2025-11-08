import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { User, PawPrint, ArrowLeft } from "lucide-react";

const Register = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("cliente");

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Cadastro realizado!",
      description: "Seu cadastro foi criado com sucesso. Agora você pode cadastrar seus pets.",
    });
    setActiveTab("pet");
  };

  const handlePetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Pet cadastrado!",
      description: "Os dados do seu pet foram salvos com sucesso.",
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
            <h1 className="text-4xl font-bold mb-4">Faça seu Cadastro</h1>
            <p className="text-muted-foreground">
              Cadastre-se e seus pets para começar a fazer reservas
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="cliente" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Dados do Cliente
              </TabsTrigger>
              <TabsTrigger value="pet" className="flex items-center gap-2">
                <PawPrint className="w-4 h-4" />
                Dados do Pet
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cliente">
              <Card>
                <CardHeader>
                  <CardTitle>Cadastro de Cliente</CardTitle>
                  <CardDescription>
                    Preencha seus dados pessoais para criar sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleClientSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input id="nome" placeholder="Seu nome" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone *</Label>
                        <Input id="telefone" type="tel" placeholder="(00) 00000-0000" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endereco">Endereço Completo *</Label>
                      <Input id="endereco" placeholder="Rua, número, bairro, cidade" required />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="aniversario">Data de Aniversário</Label>
                        <Input id="aniversario" type="date" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="qtd-pets">Quantidade de Pets</Label>
                        <Select defaultValue="1">
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 pet</SelectItem>
                            <SelectItem value="2">2 pets</SelectItem>
                            <SelectItem value="3">3 pets</SelectItem>
                            <SelectItem value="4">4 ou mais pets</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Continuar para Cadastro do Pet
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pet">
              <Card>
                <CardHeader>
                  <CardTitle>Cadastro de Pet</CardTitle>
                  <CardDescription>
                    Cadastre as informações do seu pet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePetSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="pet-nome">Nome do Pet *</Label>
                        <Input id="pet-nome" placeholder="Nome" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="raca">Raça *</Label>
                        <Input id="raca" placeholder="Ex: Yorkshire, Bulldog" required />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="peso">Peso (kg) *</Label>
                        <Input id="peso" type="number" step="0.1" placeholder="0.0" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="pet-aniversario">Data de Nascimento</Label>
                        <Input id="pet-aniversario" type="date" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Informações Adicionais</Label>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox id="creche" />
                        <label htmlFor="creche" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Frequenta creche
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox id="adestrado" />
                        <label htmlFor="adestrado" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Adestrado
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox id="castrado" />
                        <label htmlFor="castrado" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Castrado
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alimentacao">Tipo de Alimentação</Label>
                      <Input id="alimentacao" placeholder="Ex: Ração premium, alimentação natural" />
                    </div>

                    <div className="space-y-2">
                      <Label>Documentos (Opcional)</Label>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="carteira-vacina" className="text-sm">Carteira de Vacinação</Label>
                          <Input id="carteira-vacina" type="file" accept="image/*" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="carteira-convenio" className="text-sm">Carteira do Convênio</Label>
                          <Input id="carteira-convenio" type="file" accept="image/*" />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" size="lg" className="flex-1">
                        Salvar Pet
                      </Button>
                      <Button type="button" variant="outline" size="lg">
                        Adicionar Outro Pet
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Register;

import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { ArrowLeft, PawPrint } from "lucide-react";

const PetRegister = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    raca: "",
    peso: "",
    aniversario: "",
    frequenta_creche: false,
    adestrado: false,
    castrado: false,
    alimentacao: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.registerPet({
        nome: formData.nome,
        raca: formData.raca,
        peso: parseFloat(formData.peso),
        aniversario: formData.aniversario || undefined,
        frequenta_creche: formData.frequenta_creche,
        adestrado: formData.adestrado,
        castrado: formData.castrado,
        alimentacao: formData.alimentacao || undefined,
      });

      toast({
        title: "Pet cadastrado!",
        description: "Os dados do seu pet foram salvos com sucesso.",
      });

      setFormData({
        nome: "",
        raca: "",
        peso: "",
        aniversario: "",
        frequenta_creche: false,
        adestrado: false,
        castrado: false,
        alimentacao: "",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar pet",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <PawPrint className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Cadastrar Pet</h1>
            </div>
            <p className="text-muted-foreground">
              Olá, {user?.nome}! Cadastre as informações do seu pet
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Dados do Pet</CardTitle>
              <CardDescription>
                Preencha as informações do seu pet para completar o cadastro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Pet *</Label>
                    <Input
                      id="nome"
                      placeholder="Nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="raca">Raça *</Label>
                    <Input
                      id="raca"
                      placeholder="Ex: Yorkshire, Bulldog"
                      value={formData.raca}
                      onChange={(e) => setFormData({ ...formData, raca: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="peso">Peso (kg) *</Label>
                    <Input
                      id="peso"
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      value={formData.peso}
                      onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="aniversario">Data de Nascimento</Label>
                    <Input
                      id="aniversario"
                      type="date"
                      value={formData.aniversario}
                      onChange={(e) => setFormData({ ...formData, aniversario: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Informações Adicionais</Label>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="creche"
                      checked={formData.frequenta_creche}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, frequenta_creche: checked as boolean })
                      }
                    />
                    <label htmlFor="creche" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Frequenta creche
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="adestrado"
                      checked={formData.adestrado}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, adestrado: checked as boolean })
                      }
                    />
                    <label htmlFor="adestrado" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Adestrado
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="castrado"
                      checked={formData.castrado}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, castrado: checked as boolean })
                      }
                    />
                    <label htmlFor="castrado" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Castrado
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alimentacao">Tipo de Alimentação</Label>
                  <Input
                    id="alimentacao"
                    placeholder="Ex: Ração premium, alimentação natural"
                    value={formData.alimentacao}
                    onChange={(e) => setFormData({ ...formData, alimentacao: e.target.value })}
                  />
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
                  <Button type="submit" size="lg" className="flex-1" disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Pet"}
                  </Button>
                  <Button type="button" variant="outline" size="lg" disabled={loading}>
                    Adicionar Outro Pet
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PetRegister;

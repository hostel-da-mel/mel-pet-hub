import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import type { Pet } from "@/types/api";
import {
  PawPrint,
  Plus,
  Loader2,
  Heart,
  Scale,
  Cake,
  Utensils,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const DashboardPets = () => {
  const { toast } = useToast();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedPet, setExpandedPet] = useState<string | null>(null);
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

  const loadPets = useCallback(async () => {
    try {
      const data = await api.getPets();
      setPets(data);
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao carregar pets. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPets();
  }, [loadPets]);

  const resetForm = () => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

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
        description: `${formData.nome} foi adicionado com sucesso.`,
      });

      resetForm();
      setShowForm(false);
      await loadPets();
    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar pet",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR");
    } catch {
      return dateStr;
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <PawPrint className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
            Meus Pets
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Gerencie os pets cadastrados na sua conta
          </p>
        </div>
        <Button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) resetForm();
          }}
          className={showForm ? "" : ""}
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
              Cadastrar Pet
            </>
          )}
        </Button>
      </div>

      {/* Register Form */}
      {showForm && (
        <Card className="mb-8 border-2 border-primary/20 shadow-lg animate-in slide-in-from-top-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Novo Pet
            </CardTitle>
            <CardDescription>
              Preencha os dados do seu pet para cadastra-lo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Pet *</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Rex, Luna, Max"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="raca">Raca *</Label>
                  <Input
                    id="raca"
                    placeholder="Ex: Yorkshire, Bulldog Frances"
                    value={formData.raca}
                    onChange={(e) =>
                      setFormData({ ...formData, raca: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="peso">Peso (kg) *</Label>
                  <Input
                    id="peso"
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="0.0"
                    value={formData.peso}
                    onChange={(e) =>
                      setFormData({ ...formData, peso: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aniversario">Data de Nascimento</Label>
                  <Input
                    id="aniversario"
                    type="date"
                    value={formData.aniversario}
                    onChange={(e) =>
                      setFormData({ ...formData, aniversario: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alimentacao">Tipo de Alimentacao</Label>
                <Input
                  id="alimentacao"
                  placeholder="Ex: Racao premium, alimentacao natural"
                  value={formData.alimentacao}
                  onChange={(e) =>
                    setFormData({ ...formData, alimentacao: e.target.value })
                  }
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id="creche"
                    checked={formData.frequenta_creche}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        frequenta_creche: checked as boolean,
                      })
                    }
                  />
                  <label
                    htmlFor="creche"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Frequenta creche
                  </label>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id="adestrado"
                    checked={formData.adestrado}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        adestrado: checked as boolean,
                      })
                    }
                  />
                  <label
                    htmlFor="adestrado"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Adestrado
                  </label>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id="castrado"
                    checked={formData.castrado}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        castrado: checked as boolean,
                      })
                    }
                  />
                  <label
                    htmlFor="castrado"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Castrado
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <PawPrint className="w-4 h-4" />
                      Salvar Pet
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Pet List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-3" />
            <p className="text-muted-foreground">Carregando seus pets...</p>
          </div>
        </div>
      ) : pets.length === 0 && !showForm ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Nenhum pet cadastrado ainda
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Cadastre seu primeiro pet para comecar a fazer reservas de
                hospedagem no Hostel da Mel.
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4" />
                Cadastrar Primeiro Pet
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pets.map((pet) => (
            <Card
              key={pet.id}
              className="overflow-hidden hover:shadow-md transition-shadow border-2 hover:border-primary/20"
            >
              <div
                className="flex items-center justify-between p-4 sm:p-5 cursor-pointer"
                onClick={() =>
                  setExpandedPet(expandedPet === pet.id ? null : pet.id)
                }
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                    <PawPrint className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-base sm:text-lg truncate">{pet.nome}</h3>
                    <p className="text-sm text-muted-foreground truncate">{pet.raca}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2">
                    {pet.castrado && (
                      <Badge variant="secondary" className="bg-accent/10 text-accent border-0">
                        Castrado
                      </Badge>
                    )}
                    {pet.adestrado && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                        Adestrado
                      </Badge>
                    )}
                    {pet.frequenta_creche && (
                      <Badge variant="secondary" className="bg-honey-gold/10 text-honey-dark border-0">
                        Creche
                      </Badge>
                    )}
                  </div>
                  {expandedPet === pet.id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {expandedPet === pet.id && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 border-t bg-muted/30 animate-in slide-in-from-top-1">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4">
                    <div className="flex items-center gap-3 p-3 bg-card rounded-xl">
                      <Scale className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Peso</p>
                        <p className="font-semibold">{pet.peso} kg</p>
                      </div>
                    </div>

                    {pet.aniversario && (
                      <div className="flex items-center gap-3 p-3 bg-card rounded-xl">
                        <Cake className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Nascimento
                          </p>
                          <p className="font-semibold">
                            {formatDate(pet.aniversario)}
                          </p>
                        </div>
                      </div>
                    )}

                    {pet.alimentacao && (
                      <div className="flex items-center gap-3 p-3 bg-card rounded-xl sm:col-span-2">
                        <Utensils className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Alimentacao
                          </p>
                          <p className="font-semibold">{pet.alimentacao}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile badges */}
                  <div className="flex flex-wrap gap-2 mt-4 sm:hidden">
                    {pet.castrado && (
                      <Badge variant="secondary" className="bg-accent/10 text-accent border-0">
                        Castrado
                      </Badge>
                    )}
                    {pet.adestrado && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                        Adestrado
                      </Badge>
                    )}
                    {pet.frequenta_creche && (
                      <Badge variant="secondary" className="bg-honey-gold/10 text-honey-dark border-0">
                        Creche
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mt-4">
                    Cadastrado em{" "}
                    {new Date(pet.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardPets;

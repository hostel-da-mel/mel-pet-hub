import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import type { Pet } from "@/types/api";
import {
  PawPrint,
  User,
  Calendar,
  Plus,
  ChevronRight,
  Heart,
  Loader2,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const data = await api.getPets();
        setPets(data);
      } catch {
        // silently handle - user will see empty state
      } finally {
        setLoadingPets(false);
      }
    };
    loadPets();
  }, []);

  const firstName = user?.nome?.split(" ")[0] || "Cliente";

  return (
    <DashboardLayout>
      {/* Welcome */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Bem-vindo(a),{" "}
          <span className="bg-gradient-to-r from-honey-gold to-honey-dark bg-clip-text text-transparent">
            {firstName}
          </span>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Gerencie seus pets e acompanhe suas reservas
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <Card className="border-2 hover:border-primary/30 transition-colors">
          <CardContent className="p-4 sm:pt-6 sm:px-6">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Pets cadastrados</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">
                  {loadingPets ? (
                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                  ) : (
                    pets.length
                  )}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <PawPrint className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/30 transition-colors">
          <CardContent className="p-4 sm:pt-6 sm:px-6">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Reservas ativas</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">0</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/30 transition-colors col-span-2 lg:col-span-1">
          <CardContent className="p-4 sm:pt-6 sm:px-6">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">Perfil</p>
                <p className="text-sm font-medium mt-1 text-foreground truncate">
                  {user?.email}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-honey-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-honey-gold" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions + Pets list */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pets section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <PawPrint className="w-5 h-5 text-primary" />
                Meus Pets
              </CardTitle>
              <Button asChild size="sm">
                <Link to="/dashboard/pets">
                  Ver todos
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {loadingPets ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : pets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    Nenhum pet cadastrado
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">
                    Cadastre seu primeiro pet para poder fazer reservas no
                    Hostel da Mel
                  </p>
                  <Button asChild>
                    <Link to="/dashboard/pets">
                      <Plus className="w-4 h-4" />
                      Cadastrar Pet
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {pets.slice(0, 3).map((pet) => (
                    <div
                      key={pet.id}
                      className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <PawPrint className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{pet.nome}</p>
                          <p className="text-sm text-muted-foreground">
                            {pet.raca} &middot; {pet.peso}kg
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {pet.castrado && (
                          <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                            Castrado
                          </span>
                        )}
                        {pet.adestrado && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Adestrado
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {pets.length > 3 && (
                    <p className="text-center text-sm text-muted-foreground pt-2">
                      E mais {pets.length - 3} pet(s)...
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar actions */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-honey-gold to-honey-dark text-white border-0">
            <CardContent className="pt-6">
              <Calendar className="w-8 h-8 mb-3" />
              <h3 className="font-bold text-lg mb-2">Fazer Reserva</h3>
              <p className="text-white/85 text-sm mb-4">
                Reserve a hospedagem do seu pet com antecedencia
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full bg-white text-primary hover:bg-white/90 border-0"
              >
                <Link to="/booking">
                  <Calendar className="w-4 h-4" />
                  Reservar Agora
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Acesso Rapido
              </h3>
              <div className="space-y-2">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Link to="/dashboard/perfil">
                    <User className="w-4 h-4" />
                    Editar Perfil
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Link to="/dashboard/pets">
                    <Plus className="w-4 h-4" />
                    Cadastrar Novo Pet
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <Link to="/sobre-nos">
                    <Heart className="w-4 h-4" />
                    Sobre o Hostel
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

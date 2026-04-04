import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import type { Pet, Booking, AdminUser } from "@/types/api";
import {
  PawPrint,
  User,
  Calendar,
  Plus,
  ChevronRight,
  Heart,
  Loader2,
  Users,
  ClipboardList,
  Hourglass,
  CheckCircle,
  AlertTriangle,
  CalendarOff,
  Shield,
} from "lucide-react";

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return dateStr;
  }
};

const Dashboard = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);

  // Admin state
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const loadData = async () => {
      try {
        const [petsData, bookingsData] = await Promise.all([
          api.getPets(),
          api.getMyBookings(),
        ]);
        setPets(petsData);
        setBookings(bookingsData);
      } catch {
        // silently handle
      } finally {
        setLoadingPets(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      setLoadingAdmin(false);
      return;
    }
    const loadAdmin = async () => {
      try {
        const [bookingsData, usersData] = await Promise.all([
          api.adminListBookings(),
          api.adminListUsers(),
        ]);
        setAllBookings(bookingsData);
        setAdminUsers(usersData);
      } catch {
        // silently handle
      } finally {
        setLoadingAdmin(false);
      }
    };
    loadAdmin();
  }, [isAdmin]);

  const firstName = user?.nome?.split(" ")[0] || "Cliente";
  const pendingBookings = allBookings.filter((b) => b.status === "pendente");
  const confirmedBookings = allBookings.filter((b) => b.status === "confirmada");
  const activeUsers = adminUsers.filter((u) => u.status === "ativo");

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
          {isAdmin
            ? "Painel administrativo — gerencie reservas, usuarios e o hostel"
            : "Gerencie seus pets e acompanhe suas reservas"}
        </p>
      </div>

      {/* Admin overview */}
      {isAdmin && (
        <div className="mb-8">
          {/* Admin stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <Link to="/admin/reservas">
              <Card className="border-2 hover:border-honey-gold/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 sm:pt-6 sm:px-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">Reservas pendentes</p>
                      <p className="text-2xl sm:text-3xl font-bold mt-1 text-honey-dark">
                        {loadingAdmin ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          pendingBookings.length
                        )}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-honey-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Hourglass className="w-5 h-5 sm:w-6 sm:h-6 text-honey-dark" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/reservas">
              <Card className="border-2 hover:border-accent/50 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 sm:pt-6 sm:px-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">Confirmadas</p>
                      <p className="text-2xl sm:text-3xl font-bold mt-1 text-accent">
                        {loadingAdmin ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          confirmedBookings.length
                        )}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/usuarios">
              <Card className="border-2 hover:border-primary/30 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 sm:pt-6 sm:px-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">Usuarios ativos</p>
                      <p className="text-2xl sm:text-3xl font-bold mt-1">
                        {loadingAdmin ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          activeUsers.length
                        )}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/reservas">
              <Card className="border-2 hover:border-primary/30 transition-colors cursor-pointer h-full">
                <CardContent className="p-4 sm:pt-6 sm:px-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">Total reservas</p>
                      <p className="text-2xl sm:text-3xl font-bold mt-1">
                        {loadingAdmin ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          allBookings.length
                        )}
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                      <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Pending bookings preview */}
          {!loadingAdmin && pendingBookings.length > 0 && (
            <Card className="border-honey-gold/40 border-2 mb-6">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-honey-dark" />
                  Reservas aguardando aprovacao
                </CardTitle>
                <Button asChild size="sm">
                  <Link to="/admin/reservas">
                    Ver todas
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pendingBookings.slice(0, 5).map((b) => (
                    <Link
                      key={b.id}
                      to="/admin/reservas"
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 bg-honey-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Hourglass className="w-4 h-4 text-honey-dark" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">
                            {b.usuario_nome || b.usuario_email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {b.pets.map((p) => p.nome).join(", ")} — {formatDate(b.data_entrada)} — {b.duracao} dia(s)
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-honey-gold/10 text-honey-dark border-0 text-xs flex-shrink-0">
                        R$ {b.valor_total.toFixed(0)}
                      </Badge>
                    </Link>
                  ))}
                  {pendingBookings.length > 5 && (
                    <p className="text-center text-xs text-muted-foreground pt-1">
                      E mais {pendingBookings.length - 5} reserva(s)...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin quick actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1">
              <Link to="/admin/reservas">
                <ClipboardList className="w-5 h-5 text-primary" />
                <span className="text-xs">Reservas</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1">
              <Link to="/admin/usuarios">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-xs">Usuarios</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1">
              <Link to="/admin/datas-bloqueadas">
                <CalendarOff className="w-5 h-5 text-primary" />
                <span className="text-xs">Datas Bloqueadas</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-3 flex-col gap-1">
              <Link to="/admin/disponibilidade">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-xs">Disponibilidade</span>
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Client stats */}
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
                <p className="text-2xl sm:text-3xl font-bold mt-1">
                  {bookings.filter((b) => b.status === "pendente" || b.status === "confirmada").length}
                </p>
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
                  <Link to="/termos-de-uso">
                    <Heart className="w-4 h-4" />
                    Termos de Uso
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

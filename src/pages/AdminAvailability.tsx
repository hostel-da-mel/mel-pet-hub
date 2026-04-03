import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarCheck } from "lucide-react";

const AdminAvailability = () => {
  return (
    <DashboardLayout>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <CalendarCheck className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          Disponibilidade
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Gerencie a disponibilidade de vagas do hostel
        </p>
      </div>

      <Card className="border-dashed border-2">
        <CardContent className="py-16">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarCheck className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Em breve</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              O cadastro de disponibilidade estara disponivel em breve.
              Aqui voce podera gerenciar as vagas disponiveis por dia.
            </p>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AdminAvailability;

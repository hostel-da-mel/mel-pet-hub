import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  PawPrint,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Heart,
  Phone,
  Calendar,
  CreditCard,
  Stethoscope,
} from "lucide-react";

const sections = [
  {
    icon: Calendar,
    title: "1. Reservas e Confirmacao",
    items: [
      "Todas as reservas devem ser realizadas atraves da plataforma do Hostel da Mel.",
      "Cada reserva esta sujeita a confirmacao pela anfitria. Uma reserva so e considerada valida apos a confirmacao.",
      "A informacao de pagamento sera disponibilizada somente apos a confirmacao da reserva.",
      "O Hostel da Mel se reserva o direito de recusar reservas sem necessidade de justificativa.",
    ],
  },
  {
    icon: Stethoscope,
    title: "2. Saude e Vacinacao",
    items: [
      "Todos os pets devem estar com a vacinacao em dia (V8/V10, antirrabica e gripe canina).",
      "E obrigatorio apresentar a carteira de vacinacao atualizada no momento do check-in.",
      "Pets com sinais de doencas infecciosas ou parasitarias nao serao aceitos.",
      "Recomendamos fortemente que o pet esteja com o tratamento antipulgas e carrapatos em dia.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "3. Comportamento e Convivencia",
    items: [
      "Os pets devem ser sociáveis e nao apresentar comportamento agressivo.",
      "Caso o pet apresente comportamento agressivo durante a estadia, o tutor sera contatado imediatamente para retirada.",
      "Pets que frequentam creche ou sao adestrados devem ter essa informacao registrada no cadastro.",
      "A equipe do hostel se reserva o direito de avaliar a compatibilidade do pet com o ambiente.",
    ],
  },
  {
    icon: Clock,
    title: "4. Check-in e Check-out",
    items: [
      "O check-in deve ser realizado no periodo selecionado na reserva (manha, tarde ou noite).",
      "Atrasos no check-in devem ser comunicados com antecedencia.",
      "O check-out deve ser realizado ate o horario combinado. Atrasos podem gerar cobranca de diaria adicional.",
      "O tutor deve trazer os pertences do pet (racao, medicamentos, brinquedo favorito) devidamente identificados.",
    ],
  },
  {
    icon: CreditCard,
    title: "5. Pagamento e Cancelamento",
    items: [
      "O valor da diaria e de R$ 80,00 por pet por dia.",
      "O pagamento deve ser realizado apos a confirmacao da reserva, nas formas aceitas (PIX ou Cartao de Credito).",
      "Cancelamentos com mais de 48h de antecedencia nao geram cobranca.",
      "Cancelamentos com menos de 48h de antecedencia podem gerar cobranca de 50% do valor total.",
      "Nao comparecimento (no-show) gera cobranca integral.",
    ],
  },
  {
    icon: PawPrint,
    title: "6. Alimentacao e Cuidados",
    items: [
      "O tutor deve informar a dieta e rotina alimentar do pet no momento do cadastro.",
      "Racao e alimentos devem ser enviados pelo tutor em quantidade suficiente para toda a estadia.",
      "Medicamentos, se necessarios, devem ser entregues com receita e instrucoes claras de administracao.",
      "O hostel nao se responsabiliza por reacoes adversas a medicamentos administrados conforme instrucao do tutor.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "7. Responsabilidades e Emergencias",
    items: [
      "O Hostel da Mel se compromete a zelar pelo bem-estar dos pets durante toda a estadia.",
      "Em caso de emergencia veterinaria, o tutor sera contatado imediatamente. Se nao localizado, o hostel tomara as providencias necessarias.",
      "Custos de atendimento veterinario emergencial serao de responsabilidade do tutor.",
      "O tutor deve manter telefone de contato atualizado e acessivel durante toda a estadia.",
      "O hostel nao se responsabiliza por condicoes pre-existentes nao informadas pelo tutor.",
    ],
  },
  {
    icon: Heart,
    title: "8. Castração e Cio",
    items: [
      "Recomendamos fortemente que os pets sejam castrados para melhor convivencia no hostel.",
      "Femeas em periodo de cio nao serao aceitas para hospedagem.",
      "Essa informacao deve estar atualizada no cadastro do pet.",
    ],
  },
  {
    icon: Phone,
    title: "9. Contato e Comunicacao",
    items: [
      "Atualizacoes sobre o pet poderao ser enviadas via WhatsApp durante a estadia.",
      "O tutor pode solicitar informacoes sobre o pet a qualquer momento durante o horario de funcionamento.",
      "Qualquer alteracao na reserva deve ser comunicada com a maior antecedencia possivel.",
    ],
  },
];

const TermsOfUse = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold mb-3">
            Termos de Uso
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Leia atentamente os termos abaixo antes de realizar sua reserva.
            Ao solicitar uma reserva no Hostel da Mel, voce concorda com todos os termos descritos.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.title}>
                <CardContent className="p-5 sm:p-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                    {section.title}
                  </h2>
                  <ul className="space-y-2">
                    {section.items.map((item, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="p-5 sm:p-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Ao solicitar uma reserva, voce declara que leu e concorda com todos os termos acima.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="hero" size="lg">
                <Link to="/booking">
                  <Calendar className="w-5 h-5" />
                  Fazer Reserva
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contact">
                  <Phone className="w-5 h-5" />
                  Fale Conosco
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Ultima atualizacao: Abril de 2026. O Hostel da Mel se reserva o direito de alterar estes termos a qualquer momento.
        </p>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfUse;

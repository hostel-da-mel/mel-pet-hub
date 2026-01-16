import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Heart, Award, GraduationCap, Shield, Star } from "lucide-react";
import lilianeImage from "@/assets/liliane-anfitria.png";
import melImage from "@/assets/mel.png";

const certificates = [
  {
    id: 1,
    title: "Primeiros Socorros para Animais",
    institution: "Instituto Brasileiro de Cuidados Animais",
    year: "2022",
    description: "Capacitação completa em atendimento emergencial para cães e gatos, incluindo técnicas de reanimação e estabilização.",
    icon: Shield,
  },
  {
    id: 2,
    title: "Comportamento e Bem-Estar Animal",
    institution: "Universidade Pet Care",
    year: "2021",
    description: "Formação em análise comportamental, linguagem corporal e técnicas de manejo para promover o bem-estar dos pets.",
    icon: Heart,
  },
  {
    id: 3,
    title: "Nutrição e Alimentação Pet",
    institution: "Centro de Estudos Veterinários",
    year: "2023",
    description: "Especialização em dietas balanceadas, necessidades nutricionais específicas e cuidados alimentares para diferentes raças e idades.",
    icon: Award,
  },
  {
    id: 4,
    title: "Hospedagem e Hotelaria Animal",
    institution: "Academia Pet Sitter Brasil",
    year: "2020",
    description: "Curso completo sobre gestão de hospedagem animal, protocolos de higiene, organização de espaços e rotinas de cuidados diários.",
    icon: Star,
  },
  {
    id: 5,
    title: "Manejo de Cães de Pequeno Porte",
    institution: "Escola Canina Especializada",
    year: "2023",
    description: "Técnicas específicas para cuidados com raças de pequeno porte, incluindo Bulldogs Franceses, Pugs e outras raças braquicefálicas.",
    icon: GraduationCap,
  },
  {
    id: 6,
    title: "Higiene e Banho Pet",
    institution: "Instituto de Estética Animal",
    year: "2021",
    description: "Formação em técnicas de banho, tosa higiênica, cuidados com pelagem e identificação de problemas dermatológicos.",
    icon: Award,
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-cream">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Conheça Nossa Equipe
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-6 mb-4">
              Anfitriã{" "}
              <span className="bg-gradient-to-r from-honey-gold to-honey-dark bg-clip-text text-transparent">
                Liliane
              </span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A pessoa por trás de todo o carinho e dedicação que seu pet recebe no Hostel da Mel
            </p>
          </div>

          {/* Profile Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={lilianeImage}
                  alt="Liliane e Mike - Anfitriã do Hostel da Mel com seu buldogue francês"
                  className="w-full h-auto object-cover max-h-[600px]"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl max-w-xs hidden lg:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">+5 Anos</div>
                    <div className="text-sm text-muted-foreground">De experiência com pets</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="border-2 border-primary/20">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Heart className="w-6 h-6 text-primary" />
                    Sobre Liliane
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Olá! Sou a <strong className="text-foreground">Liliane</strong>, apaixonada por animais desde sempre.
                      Minha jornada com os pets começou há mais de 5 anos, quando decidi transformar
                      esse amor em minha profissão.
                    </p>
                    <p>
                      No Hostel da Mel, cada pet é tratado como membro da família. Acredito que
                      cuidar de um animal vai muito além de alimentar e abrigar - é entender suas
                      necessidades emocionais, respeitar sua personalidade e criar um ambiente
                      onde eles se sintam verdadeiramente em casa.
                    </p>
                    <p>
                      Na foto ao lado estou com o <strong className="text-foreground">Mike</strong>, meu buldogue francês
                      que me acompanha no dia a dia do hostel. Ele é um ótimo anfitrião e ajuda
                      a receber os hóspedes com muito carinho!
                    </p>
                    <p>
                      Busco constantemente me atualizar através de cursos e treinamentos para
                      oferecer sempre o melhor cuidado aos nossos hóspedes peludos. Confira
                      abaixo algumas das minhas certificações!
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-4">
                <Card className="text-center p-4">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-xs text-muted-foreground">Pets hospedados</div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-2xl font-bold text-primary">5.0</div>
                  <div className="text-xs text-muted-foreground">Avaliação média</div>
                </Card>
                <Card className="text-center p-4">
                  <div className="text-2xl font-bold text-primary">6</div>
                  <div className="text-xs text-muted-foreground">Certificações</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mel Tribute Section */}
      <section className="py-16 bg-gradient-to-b from-cream/50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="px-4 py-2 bg-honey-gold/20 text-honey-dark rounded-full text-sm font-medium">
                Em Memória
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mt-6 mb-4">
                A História da{" "}
                <span className="bg-gradient-to-r from-honey-gold to-honey-dark bg-clip-text text-transparent">
                  Mel
                </span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A pequena yorkshire que inspirou o nome do nosso hostel e deixou um legado de amor
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <Card className="border-2 border-honey-gold/30 bg-gradient-to-br from-white to-cream/30 order-2 lg:order-1">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="w-6 h-6 text-honey-gold fill-honey-gold" />
                    <h3 className="text-2xl font-bold text-foreground">Mel</h3>
                    <span className="text-muted-foreground text-sm">(Yorkshire Terrier)</span>
                  </div>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      A <strong className="text-foreground">Mel</strong> chegou na minha vida quando tinha
                      9 anos de idade. Ela havia sido abandonada por estar muito doente, considerada em
                      estado terminal. Quando a resgatei, todos me diziam que ela não teria muito tempo.
                      Mas a Mel tinha outros planos.
                    </p>
                    <p>
                      Minha pequena guerreira desafiou todas as expectativas e ficou comigo por mais
                      <strong className="text-foreground"> 10 anos</strong>, chegando aos 19 aninhos!
                      Ela me provou que o amor, o cuidado e uma segunda chance podem fazer verdadeiros milagres.
                    </p>
                    <p>
                      A Mel tinha uma personalidade única: sempre muito animada, com sua linguinha de
                      fora que era sua marca registrada, e um carinho sem fim para dar. Ela recebia
                      cada pessoa que chegava em casa como se fosse um amigo de longa data.
                    </p>
                    <p>
                      Foi através dela que descobri minha verdadeira vocação. Resgatar a Mel me mostrou
                      que cuidar de pets era mais do que um trabalho — era minha missão de vida. Desde
                      então, levar amor e cuidado a cada pet se tornou o propósito que guia meus dias.
                    </p>
                    <p>
                      Mesmo já bem velhinha, a Mel nunca perdeu sua alegria de viver. Quando ela partiu,
                      deixou um vazio enorme no meu coração, mas também um legado de amor que me inspira
                      todos os dias.
                    </p>
                    <p className="italic border-l-4 border-honey-gold pl-4 bg-honey-gold/5 py-2 rounded-r">
                      "O Hostel da Mel carrega o nome dela como minha homenagem a essa pequena grande
                      guerreira que me ensinou que todo pet merece amor, cuidado e uma segunda chance."
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="relative order-1 lg:order-2">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-honey-gold/20">
                  <img
                    src={melImage}
                    alt="Mel - A yorkshire que deu nome ao Hostel da Mel"
                    className="w-full h-auto object-cover max-h-[500px]"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl hidden lg:block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-honey-gold/20 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-honey-gold fill-honey-gold" />
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-sm">Para Sempre</div>
                      <div className="text-xs text-muted-foreground">Em nossos corações</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <GraduationCap className="w-10 h-10 text-primary" />
              Certificações e Treinamentos
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Invisto constantemente em capacitação para garantir o melhor cuidado para seu pet
            </p>
          </div>

          <div className="max-w-5xl mx-auto px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {certificates.map((cert) => (
                  <CarouselItem key={cert.id} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="h-full border-2 hover:border-primary transition-colors hover:shadow-lg">
                      <CardContent className="pt-6 h-full flex flex-col">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                          <cert.icon className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{cert.title}</h3>
                        <p className="text-sm text-primary font-medium mb-1">
                          {cert.institution}
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          Ano: {cert.year}
                        </p>
                        <p className="text-muted-foreground text-sm flex-grow">
                          {cert.description}
                        </p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-honey-gold to-honey-dark text-white border-0 overflow-hidden relative">
              <CardContent className="p-12 relative z-10">
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Nossos Valores
                  </h2>
                  <div className="grid md:grid-cols-3 gap-8 mt-8">
                    <div>
                      <Heart className="w-10 h-10 mx-auto mb-3" />
                      <h3 className="font-bold text-lg mb-2">Amor</h3>
                      <p className="text-white/90 text-sm">
                        Cada pet é tratado com o mesmo amor que dedicamos aos nossos próprios animais
                      </p>
                    </div>
                    <div>
                      <Shield className="w-10 h-10 mx-auto mb-3" />
                      <h3 className="font-bold text-lg mb-2">Segurança</h3>
                      <p className="text-white/90 text-sm">
                        Ambiente seguro e protocolos rigorosos para o bem-estar do seu pet
                      </p>
                    </div>
                    <div>
                      <Star className="w-10 h-10 mx-auto mb-3" />
                      <h3 className="font-bold text-lg mb-2">Excelência</h3>
                      <p className="text-white/90 text-sm">
                        Busca constante por conhecimento e melhoria nos serviços oferecidos
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 z-0" />
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Hostel da Mel. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;

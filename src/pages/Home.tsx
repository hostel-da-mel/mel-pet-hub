import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Heart, Shield, Calendar, Camera, Star } from "lucide-react";
import heroImage from "@/assets/hero-pets.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-cream">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  🐾 Hotel Pet de Confiança
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Aqui o amor e o cuidado{" "}
                <span className="bg-gradient-to-r from-honey-gold to-honey-dark bg-clip-text text-transparent">
                  nunca tiram férias
                </span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                Reserve a vaga do seu pet para o fim do ano e garanta o melhor cuidado 
                enquanto você aproveita suas férias. Hospedagem com todo carinho e atenção 
                que seu melhor amigo merece.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button asChild variant="hero" size="lg">
                  <Link to="/booking">
                    <Calendar className="w-5 h-5" />
                    Reserve Já 💜
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/register">
                    Fazer Cadastro
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  <span className="text-sm font-medium">5.0 avaliação</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Vagas limitadas
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={heroImage} 
                  alt="Pets felizes no Hostel da Mel" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl max-w-xs hidden lg:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-foreground">500+ Pets</div>
                    <div className="text-sm text-muted-foreground">Hospedados com amor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por que escolher o Hostel da Mel?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Oferecemos o melhor em hospedagem e cuidados para seu pet
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-primary transition-colors hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Cuidado 24/7</h3>
                <p className="text-muted-foreground text-sm">
                  Monitoria e cuidado constante com seu pet durante toda a estadia
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary transition-colors hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-lg mb-2">Segurança Total</h3>
                <p className="text-muted-foreground text-sm">
                  Ambiente seguro e higienizado com protocolos rigorosos
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary transition-colors hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Fotos Diárias</h3>
                <p className="text-muted-foreground text-sm">
                  Receba fotos e vídeos do seu pet todos os dias
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-2 hover:border-primary transition-colors hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-lg mb-2">Reserva Fácil</h3>
                <p className="text-muted-foreground text-sm">
                  Sistema de reservas online simples e rápido
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-honey-gold to-honey-dark text-white border-0 overflow-hidden relative">
            <CardContent className="p-12 relative z-10">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Não deixe para a última hora!
                </h2>
                <p className="text-white/90 mb-8 text-lg">
                  As vagas para o fim de ano são limitadas. Reserve agora e garanta 
                  tranquilidade para você e conforto para seu pet.
                </p>
                <Button asChild size="lg" variant="outline" className="bg-white text-primary hover:bg-white/90">
                  <Link to="/booking">
                    <Calendar className="w-5 h-5" />
                    Consultar Disponibilidade
                  </Link>
                </Button>
              </div>
            </CardContent>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 z-0" />
          </Card>
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

export default Home;

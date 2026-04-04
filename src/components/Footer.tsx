import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; 2026 Hostel da Mel. Todos os direitos reservados.</p>
        <div className="flex items-center justify-center gap-3 mt-2 text-xs">
          <Link
            to="/termos-de-uso"
            className="hover:text-primary transition-colors underline"
          >
            Termos de Uso
          </Link>
          <span className="opacity-30">|</span>
          <Link
            to="/contact"
            className="hover:text-primary transition-colors underline"
          >
            Contato
          </Link>
          <span className="opacity-30">|</span>
          <a
            href="https://l2.tec.br"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors underline opacity-50"
          >
            l2.tec.br
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

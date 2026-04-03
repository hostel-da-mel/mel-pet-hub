const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; 2026 Hostel da Mel. Todos os direitos reservados.</p>
        <p className="text-xs mt-2 opacity-50">
          Desenvolvido por{" "}
          <a
            href="https://l2.tec.br"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 underline"
          >
            l2.tec.br
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

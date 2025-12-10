const Footer = () => {
  return (
    <div className="bg-accent w-full gap-1 p-8">
      <div className="flex flex-col items-center justify-center gap-2 w-full lg:max-w-[1024px] mx-auto">
        <p className="text-xs font-medium">© 2025 Copyright BEWEAR</p>
        <p className="text-muted-foreground text-xs font-medium">
          Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default Footer;

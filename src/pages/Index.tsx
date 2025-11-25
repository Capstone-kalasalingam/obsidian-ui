const Index = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-4xl text-center">
        <h1 className="animate-fade-in text-[clamp(3rem,10vw,8rem)] font-bold leading-none tracking-tighter text-foreground">
          alone
        </h1>
        
        <p className="animate-fade-in-delayed mt-8 text-lg text-muted-foreground md:text-xl">
          in the silence, clarity emerges
        </p>

        <div className="animate-slide-up mt-16 flex justify-center gap-4">
          <div className="h-px w-20 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </div>
    </main>
  );
};

export default Index;

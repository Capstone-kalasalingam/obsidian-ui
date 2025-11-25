import { Building2, Users2, Rocket } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Building2,
      title: "Onboard School",
      description: "Quick and simple setup process. Register your school with basic details and customize your platform settings.",
      step: "01",
    },
    {
      icon: Users2,
      title: "Add Classes & Staff",
      description: "Import or manually add all classes, teachers, and students. Organize your school structure in minutes.",
      step: "02",
    },
    {
      icon: Rocket,
      title: "Start Teaching & Tracking",
      description: "Begin using all platform features immediately. Track attendance, share content, and monitor progress in real-time.",
      step: "03",
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 md:py-24 bg-soft-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 px-4">
            How It Works for Schools
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Get started in three simple steps
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Timeline line - hidden on mobile */}
            <div className="hidden md:block absolute top-0 left-1/2 w-1 h-full bg-border -translate-x-1/2"></div>

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div
                  key={step.title}
                  className={`relative mb-8 sm:mb-12 md:mb-16 last:mb-0 animate-slide-up px-2`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`flex flex-col md:flex-row gap-6 sm:gap-8 items-center ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    {/* Content */}
                    <div className={`flex-1 ${isEven ? "md:text-right" : "md:text-left"} text-center md:text-left`}>
                      <div className="inline-block md:hidden mb-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
                          <Icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground" />
                        </div>
                      </div>
                      <div className={`inline-block px-3 sm:px-4 py-1 rounded-full bg-primary text-primary-foreground font-bold text-xs sm:text-sm mb-2 sm:mb-3`}>
                        Step {step.step}
                      </div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 sm:mb-3">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed px-2 sm:px-0">
                        {step.description}
                      </p>
                    </div>

                    {/* Icon Circle - Desktop only */}
                    <div className="hidden md:block relative z-10">
                      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-xl border-4 border-background">
                        <Icon className="h-10 w-10 text-primary-foreground" />
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden md:block flex-1"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

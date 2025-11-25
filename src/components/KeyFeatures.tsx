import { BarChart3, UserCheck, Upload, Bell } from "lucide-react";

const KeyFeatures = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Principal Dashboard",
      description: "Comprehensive school analytics, staff management, class organization, and detailed performance reports all in one central hub.",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: UserCheck,
      title: "Teacher Tools",
      description: "Streamlined student attendance tracking, marks entry, content upload capabilities, and instant announcement distribution.",
      color: "bg-accent/10 text-accent",
    },
    {
      icon: Upload,
      title: "Student Learning Hub",
      description: "Access study notes, view attendance history, check marks and grades, and receive personalized learning suggestions.",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Bell,
      title: "Parent Access",
      description: "Real-time fee payment status, attendance monitoring, school announcements, and detailed performance insights for your child.",
      color: "bg-accent/10 text-accent",
    },
  ];

  return (
    <section id="features" className="py-12 sm:py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 px-4">
            Key Features
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Everything your school needs to thrive in the digital age
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-slide-up p-4 sm:p-0"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl ${feature.color} flex items-center justify-center flex-shrink-0 shadow-md mx-auto sm:mx-0`}>
                  <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default KeyFeatures;

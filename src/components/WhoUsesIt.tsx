import { Users, GraduationCap, BookOpen, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const WhoUsesIt = () => {
  const users = [
    {
      icon: Users,
      title: "Principal",
      description: "Monitor school-wide performance, manage staff, track attendance, and generate comprehensive reports with powerful analytics.",
    },
    {
      icon: GraduationCap,
      title: "Teacher",
      description: "Take attendance, record marks, upload study materials, make announcements, and engage with students effortlessly.",
    },
    {
      icon: BookOpen,
      title: "Student",
      description: "Access notes, check attendance records, view marks, receive suggestions, and stay connected with teachers.",
    },
    {
      icon: Heart,
      title: "Parent",
      description: "Monitor fee status, track attendance, view performance insights, and stay informed about school announcements.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-soft-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 px-4">
            Who Uses the Platform?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Built for every member of your school community
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {users.map((user, index) => {
            const Icon = user.icon;
            return (
              <Card
                key={user.title}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-slide-up bg-card"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl font-bold">{user.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                    {user.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhoUsesIt;

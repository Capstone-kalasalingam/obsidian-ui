import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "This platform has transformed how we manage our school. Attendance tracking is seamless, and communication with parents has never been better. Highly recommended!",
      name: "Dr. Sarah Mitchell",
      role: "Principal, Riverside High School",
      avatar: "SM",
    },
    {
      quote: "As a teacher, I love how easy it is to upload materials and track student progress. My students are more engaged, and parents appreciate the transparency.",
      name: "James Rodriguez",
      role: "Math Teacher, Oak Valley Academy",
      avatar: "JR",
    },
    {
      quote: "Finally, a platform that connects everyone in the school community. I can monitor my daughter's progress, pay fees online, and stay informed about school events all in one place.",
      name: "Priya Sharma",
      role: "Parent, Lincoln Elementary",
      avatar: "PS",
    },
  ];

  return (
    <section className="py-12 md:py-20 lg:py-24 bg-soft-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 lg:mb-16 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4 px-4">
            What Our Community Says
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Trusted by schools, loved by users
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.name}
              className="border-0 shadow-md hover:shadow-lg transition-all duration-300 animate-slide-up bg-background h-full"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-5 sm:p-6 md:p-8 h-full flex flex-col">
                <Quote className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 text-primary/10 mb-3 md:mb-4" />
                <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="space-y-1">
                  <p className="font-bold text-foreground text-sm md:text-base">{testimonial.name}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

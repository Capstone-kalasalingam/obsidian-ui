import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Kalvion and Login */}
      <header className="flex items-center justify-between p-4 md:p-6">
        <h2 className="text-xl md:text-2xl font-bold text-primary">
          Kalvion
        </h2>
      </header>

      {/* Centered Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 md:px-8 pb-12">
        <div className="w-full max-w-lg space-y-6 md:space-y-8 text-center animate-fade-in">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight">
            All-in-One School Learning & Management Platform
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Empowering principals, teachers, students, and parents with seamless 
            communication, real-time tracking, and powerful insights. Everything your 
            school needs in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 pt-4">
            <Link to="/auth" className="w-full">
              <Button size="lg" className="w-full text-base md:text-lg h-12 md:h-14">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Hero;

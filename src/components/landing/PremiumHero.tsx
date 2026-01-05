import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap, Users, Sparkles, ArrowRight } from "lucide-react";
const PremiumHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    scrollYProgress
  } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Book animation transforms - creates the story effect
  const bookScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.15]);
  const bookRotateY = useTransform(scrollYProgress, [0, 0.3], [5, -10]);
  const bookY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  // Content parallax
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  // Floating elements parallax
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden bg-gradient-mesh noise-overlay">
      {/* Animated Background Orbs */}
      <motion.div style={{
      y: orb1Y
    }} className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
      <motion.div style={{
      y: orb2Y
    }} className="absolute bottom-20 right-[15%] w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      <motion.div style={{
      y: orb3Y
    }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-soft-purple blur-3xl opacity-50" />

      <div className="container mx-auto px-6 lg:px-12 pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div style={{
          y: textY,
          opacity
        }} className="text-center lg:text-left z-10">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6
          }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-primary">AI-Powered School Platform</span>
            </motion.div>

            <motion.h1 initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.7,
            delay: 0.1
          }} className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-foreground leading-[1.1] tracking-tight mb-6">
              The Intelligent{" "}
              <span className="text-gradient-primary">School Platform</span>
            </motion.h1>

            <motion.p initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.7,
            delay: 0.2
          }} className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
              From teacher guidance to student understanding — Kalvion brings
              clarity, control, and confidence to education.
            </motion.p>

            <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.7,
            delay: 0.3
          }} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="h-14 px-8 rounded-full shadow-glow text-base font-semibold">
                Request Demo
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-base font-semibold border-2" onClick={() => scrollToSection("features")}>
                Explore Platform
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.7,
            delay: 0.4
          }} className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border/50">
              {[{
              value: "500+",
              label: "Schools Trust Us"
            }, {
              value: "50K+",
              label: "Students Growing"
            }, {
              value: "98%",
              label: "Satisfaction"
            }].map((stat, i) => <div key={i} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>)}
            </motion.div>
          </motion.div>

          {/* Right Visual - Book to Student Story */}
          <motion.div style={{
          y: bookY
        }} className="relative hidden lg:flex items-center justify-center">
            <motion.div style={{
            scale: bookScale,
            rotateY: bookRotateY
          }} initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.8,
            delay: 0.3
          }} className="relative perspective-1000">
              {/* Main Book/Knowledge Card */}
              

              {/* Floating Teacher Card */}
              

              {/* Floating Student Card */}
              

              {/* Decorative glow effects */}
              <motion.div animate={{
              y: [0, -10, 0]
            }} transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }} className="absolute -top-8 right-0 w-20 h-20 rounded-full bg-soft-yellow/60 blur-2xl" />
              <motion.div animate={{
              y: [0, 10, 0]
            }} transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }} className="absolute -bottom-8 left-0 w-24 h-24 rounded-full bg-soft-pink/60 blur-2xl" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 1.2,
      duration: 0.5
    }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div animate={{
        y: [0, 8, 0]
      }} transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }} className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <motion.div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>;
};
export default PremiumHero;
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

const PremiumHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-mesh noise-overlay"
    >
      {/* Animated gradient orbs */}
      <motion.div
        style={{ y: y3 }}
        className="absolute top-20 left-[10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl animate-pulse-soft"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-20 right-[5%] w-[600px] h-[600px] rounded-full bg-primary/8 blur-3xl animate-pulse-soft"
        initial={{ opacity: 0.5 }}
      />
      <motion.div
        style={{ y: y1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-soft-indigo blur-3xl opacity-60"
      />

      <motion.div
        style={{ opacity, scale }}
        className="container mx-auto px-6 lg:px-12 relative z-10"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">
                Next-Generation School Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold text-foreground leading-[1.1] tracking-tight"
            >
              The Intelligent{" "}
              <span className="text-gradient-primary">School</span>{" "}
              Operating System
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed"
            >
              Kalvion helps schools deliver quality education, maintain complete
              administrative control, and guide every student with clarity.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button
                size="lg"
                className="h-14 px-8 text-base font-semibold rounded-xl shadow-glow hover:shadow-glow-strong transition-all duration-300"
              >
                Request a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-base font-semibold rounded-xl border-2 hover:bg-secondary/80 transition-all duration-300"
              >
                <Play className="mr-2 h-4 w-4" />
                Explore Features
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="flex items-center gap-8 pt-8 border-t border-border/50"
            >
              <div>
                <p className="text-3xl font-bold text-foreground">50+</p>
                <p className="text-sm text-muted-foreground">Schools Trust Us</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <p className="text-3xl font-bold text-foreground">10K+</p>
                <p className="text-sm text-muted-foreground">Students Growing</p>
              </div>
              <div className="w-px h-12 bg-border hidden sm:block" />
              <div className="hidden sm:block">
                <p className="text-3xl font-bold text-foreground">99%</p>
                <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Dashboard Mockups */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[600px] perspective-1000">
              {/* Main dashboard card */}
              <motion.div
                style={{ y: y1 }}
                className="absolute top-0 right-0 w-[90%] rounded-2xl overflow-hidden shadow-hover border border-border/50 bg-card"
                whileHover={{ scale: 1.02, rotateY: -2 }}
                transition={{ duration: 0.4 }}
              >
                <div className="p-4 border-b border-border/50 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-soft-yellow" />
                    <div className="w-3 h-3 rounded-full bg-soft-green" />
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-4 w-32 bg-muted rounded" />
                      <div className="h-3 w-24 bg-muted/60 rounded" />
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-primary/10" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 rounded-xl bg-muted/40 space-y-2">
                        <div className="h-8 w-8 rounded-lg bg-primary/20" />
                        <div className="h-3 w-16 bg-muted rounded" />
                        <div className="h-5 w-12 bg-foreground/20 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="h-40 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 flex items-end p-4">
                    <div className="flex items-end gap-2 w-full">
                      {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-primary/30 rounded-t"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Secondary floating card */}
              <motion.div
                style={{ y: y2 }}
                className="absolute bottom-16 -left-8 w-[280px] rounded-2xl p-5 shadow-card border border-border/50 bg-card/95 backdrop-blur-sm"
                whileHover={{ scale: 1.04, rotate: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-soft-green flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-accent/60" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Attendance Today</p>
                    <p className="text-xs text-muted-foreground">Real-time tracking</p>
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold">94.2%</p>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    +2.4%
                  </span>
                </div>
              </motion.div>

              {/* Third floating card */}
              <motion.div
                style={{ y: y3 }}
                className="absolute top-32 -left-4 w-[200px] rounded-2xl p-4 shadow-card border border-border/50 bg-card/95 backdrop-blur-sm"
                whileHover={{ scale: 1.04, rotate: -1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-soft-purple flex items-center justify-center">
                    <div className="w-4 h-4 rounded bg-primary/40" />
                  </div>
                  <p className="font-medium text-sm">Staff Overview</p>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-muted border-2 border-card"
                    />
                  ))}
                  <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-medium">
                    +12
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PremiumHero;

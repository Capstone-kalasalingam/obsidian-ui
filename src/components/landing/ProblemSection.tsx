import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

const ProblemSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const chaosItems = [
    "Scattered records",
    "Manual tracking",
    "No visibility",
    "Parent complaints",
  ];

  const orderItems = [
    "Centralized data",
    "Automated tracking",
    "Complete visibility",
    "Parent satisfaction",
  ];

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-soft-bg via-background to-background" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-4">
            The Challenge
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
            Schools don't struggle because of{" "}
            <span className="text-muted-foreground">lack of effort</span>.
          </h2>
          <p className="text-xl md:text-2xl font-display font-medium text-foreground">
            They struggle because of lack of{" "}
            <span className="text-gradient-primary">visibility</span>,{" "}
            <span className="text-gradient-primary">structure</span>, and{" "}
            <span className="text-gradient-primary">control</span>.
          </p>
        </motion.div>

        {/* Chaos to Order Visual */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-20 max-w-5xl mx-auto items-center">
          {/* Chaos Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="text-center mb-6">
              <span className="text-sm font-medium text-destructive/80 uppercase tracking-wide">
                Without Kalvion
              </span>
            </div>
            <div className="relative h-72 lg:h-80">
              {chaosItems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { 
                    opacity: 1, 
                    scale: 1,
                    x: [0, (Math.random() - 0.5) * 12, 0],
                    y: [0, (Math.random() - 0.5) * 12, 0],
                    rotate: [0, (Math.random() - 0.5) * 8, 0],
                  } : {}}
                  transition={{ 
                    opacity: { duration: 0.5, delay: 0.3 + i * 0.1 },
                    scale: { duration: 0.5, delay: 0.3 + i * 0.1 },
                    x: { duration: 3.5 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
                    y: { duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 4.5 + i * 0.4, repeat: Infinity, ease: "easeInOut" },
                  }}
                  className="absolute p-4 rounded-xl bg-card border border-destructive/20 shadow-soft"
                  style={{
                    top: `${12 + (i * 20) % 55}%`,
                    left: `${8 + (i * 22) % 45}%`,
                    transform: `rotate(${-10 + i * 6}deg)`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-destructive/60" />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{item}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Arrow in middle for desktop */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowRight className="w-7 h-7 text-primary" />
            </div>
          </motion.div>

          {/* Order Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div className="text-center mb-6">
              <span className="text-sm font-medium text-primary uppercase tracking-wide">
                With Kalvion
              </span>
            </div>
            <div className="space-y-3">
              {orderItems.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="p-4 rounded-xl bg-card border border-primary/20 shadow-soft cursor-default transition-shadow hover:shadow-glow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{item}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;

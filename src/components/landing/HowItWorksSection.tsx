import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Building2, GraduationCap, BookOpen, Users } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Building2,
    title: "Admin Creates Structure",
    description: "Set up academic years, classes, and staff with complete control.",
    color: "from-primary to-primary/70",
  },
  {
    number: "02",
    icon: GraduationCap,
    title: "Teachers Manage Classes",
    description: "Track attendance, enter marks, and guide students effectively.",
    color: "from-emerald-500 to-emerald-400",
  },
  {
    number: "03",
    icon: BookOpen,
    title: "Students Learn Consistently",
    description: "Receive guidance, track progress, and grow with clarity.",
    color: "from-amber-500 to-amber-400",
  },
  {
    number: "04",
    icon: Users,
    title: "Parents Stay Informed",
    description: "Get real-time updates on attendance, marks, and announcements.",
    color: "from-rose-500 to-rose-400",
  },
];

const HowItWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.15, 0.85], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      className="py-24 lg:py-32 bg-background relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-mesh opacity-30 blur-3xl" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Four pillars.{" "}
            <span className="text-muted-foreground">One unified system.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A seamless journey from administration to learning
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Animated connecting line */}
          <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-0.5 bg-border hidden md:block">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-primary via-emerald-500 via-amber-500 to-rose-500"
            />
          </div>

          {/* Steps */}
          <div className="space-y-12 lg:space-y-20">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
                className={`relative flex items-center gap-8 lg:gap-16 ${
                  i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Step Number Circle */}
                <div className="relative z-10 flex-shrink-0 hidden md:block">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-glow`}
                  >
                    <step.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  {/* Pulse effect */}
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} -z-10`}
                  />
                </div>

                {/* Content Card */}
                <div
                  className={`flex-1 ${
                    i % 2 === 0 ? "lg:text-left lg:pr-16" : "lg:text-right lg:pl-16"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="p-6 rounded-2xl bg-card border border-border/50 shadow-soft"
                  >
                    <div className={`flex items-center gap-3 mb-3 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center md:hidden`}>
                        <step.icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs font-bold text-primary">STEP {step.number}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </motion.div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Settings, BookOpen, TrendingUp, MessageSquare } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Settings,
    title: "Admin Creates Structure",
    description:
      "Principals set up classes, assign teachers, and define the academic year. Complete control from day one.",
    color: "bg-primary",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Teachers Manage Classes",
    description:
      "Attendance, marks, study materials, and daily tasks. Everything a teacher needs, simplified.",
    color: "bg-accent",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Students Grow Consistently",
    description:
      "Personalized learning paths, AI-guided study assistance, and clear progress tracking.",
    color: "bg-amber-500",
  },
  {
    number: "04",
    icon: MessageSquare,
    title: "Parents Stay Informed",
    description:
      "Real-time updates on attendance, performance, fees, and announcements. Always connected.",
    color: "bg-pink-500",
  },
];

const HowItWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      className="relative py-32 lg:py-40 overflow-hidden bg-background"
    >
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center mb-20 lg:mb-28"
        >
          <p className="text-sm font-medium text-primary mb-6 tracking-wide uppercase">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight">
            Four pillars.{" "}
            <span className="text-muted-foreground">One unified system.</span>
          </h2>
        </motion.div>

        {/* Steps with connecting line */}
        <div className="relative max-w-4xl mx-auto">
          {/* Animated line */}
          <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px bg-border hidden md:block">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-primary via-accent to-pink-500"
            />
          </div>

          {/* Steps */}
          <div className="space-y-16 lg:space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Number indicator */}
                <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center shadow-glow z-10`}
                  >
                    <step.icon className="w-7 h-7 text-white" />
                  </motion.div>
                </div>

                {/* Content card */}
                <div
                  className={`flex-1 ${
                    index % 2 === 1 ? "lg:text-right" : ""
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="card-premium p-8 lg:p-10"
                  >
                    <div
                      className={`flex items-center gap-4 mb-4 ${
                        index % 2 === 1 ? "lg:flex-row-reverse" : ""
                      }`}
                    >
                      <span className="text-4xl font-display font-bold text-muted-foreground/30">
                        {step.number}
                      </span>
                      <div
                        className={`w-12 h-12 rounded-xl ${step.color}/10 flex items-center justify-center md:hidden`}
                      >
                        <step.icon className={`w-6 h-6 ${step.color.replace('bg-', 'text-')}`} />
                      </div>
                    </div>

                    <h3 className="text-2xl font-display font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {step.description}
                    </p>
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

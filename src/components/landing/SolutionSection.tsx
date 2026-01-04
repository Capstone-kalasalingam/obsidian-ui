import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Eye, Users, TrendingUp, Calendar, Sparkles } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Admin Control & Visibility",
    description: "Complete oversight of every aspect of your school operations.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "Teacher-Guided Management",
    description: "Empower teachers with tools that simplify class operations.",
    color: "bg-soft-green text-accent",
  },
  {
    icon: TrendingUp,
    title: "Student Growth Tracking",
    description: "Monitor and nurture every student's educational journey.",
    color: "bg-soft-purple text-primary",
  },
  {
    icon: Calendar,
    title: "Academic Year Control",
    description: "Seamless management of terms, promotions, and transitions.",
    color: "bg-soft-yellow text-amber-600",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description: "Intelligent guidance, not answers. Learning, not cheating.",
    color: "bg-soft-pink text-pink-600",
  },
];

const SolutionSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section
      ref={containerRef}
      className="relative py-32 lg:py-40 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-soft-indigo/30 to-background" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-sm font-medium text-primary mb-6 tracking-wide uppercase"
          >
            The Kalvion Solution
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight mb-6"
          >
            Everything your school needs.{" "}
            <span className="text-muted-foreground">Nothing it doesn't.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground"
          >
            A unified platform designed with intention. Every feature serves a
            purpose.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.3 + index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group"
            >
              <div className="card-premium p-8 h-full hover:border-primary/30 transition-all duration-400">
                <div
                  className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating dashboard preview */}
        <motion.div
          style={{ y }}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-20 lg:mt-28 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />

          <div className="max-w-5xl mx-auto">
            <div className="rounded-3xl overflow-hidden shadow-hover border border-border/50 bg-card">
              <div className="p-4 border-b border-border/50 bg-muted/30 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-full bg-muted text-xs text-muted-foreground">
                    kalvion.dashboard
                  </div>
                </div>
              </div>

              <div className="p-8 lg:p-12">
                <div className="grid grid-cols-4 gap-6 mb-8">
                  {[
                    { label: "Total Students", value: "2,847" },
                    { label: "Attendance Rate", value: "94.2%" },
                    { label: "Active Teachers", value: "126" },
                    { label: "Classes Today", value: "48" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                      className="text-center p-4 rounded-xl bg-muted/40"
                    >
                      <p className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="h-48 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 flex items-end p-6">
                  <div className="flex items-end gap-3 w-full">
                    {[35, 55, 45, 70, 60, 85, 75, 90, 80, 65, 70, 55].map(
                      (h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={isInView ? { height: `${h}%` } : {}}
                          transition={{
                            duration: 0.8,
                            delay: 1.2 + i * 0.05,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="flex-1 bg-primary/40 rounded-t-md"
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;

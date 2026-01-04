import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ProblemSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const cards = [
    { label: "Scattered Data", delay: 0 },
    { label: "Manual Processes", delay: 0.1 },
    { label: "No Visibility", delay: 0.2 },
    { label: "Lost Insights", delay: 0.3 },
  ];

  return (
    <section
      ref={ref}
      className="relative py-32 lg:py-40 overflow-hidden bg-background"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-soft-bg via-background to-background" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-sm font-medium text-primary mb-6 tracking-wide uppercase"
          >
            The Challenge
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight mb-8"
          >
            Schools don't fail because of{" "}
            <span className="text-muted-foreground">lack of effort</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl sm:text-2xl lg:text-3xl font-display font-semibold text-foreground leading-tight"
          >
            They fail because of lack of{" "}
            <span className="text-gradient-primary">visibility</span>,{" "}
            <span className="text-gradient-primary">structure</span>, and{" "}
            <span className="text-gradient-primary">control</span>.
          </motion.p>
        </div>

        {/* Visual representation: Chaos to Order */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 lg:mt-28"
        >
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
            {/* Chaos side */}
            <div className="relative w-full max-w-sm">
              <div className="text-center mb-6">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Without Kalvion
                </p>
              </div>
              <div className="relative h-48">
                {cards.map((card, i) => (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, rotate: (i - 1.5) * 15, x: (i - 1.5) * 20 }}
                    animate={
                      isInView
                        ? {
                            opacity: 1,
                            rotate: (i - 1.5) * 12,
                            x: (i - 1.5) * 30,
                            y: Math.abs(i - 1.5) * 10,
                          }
                        : {}
                    }
                    transition={{
                      duration: 0.6,
                      delay: 0.5 + card.delay,
                      type: "spring",
                      stiffness: 100,
                    }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-24 rounded-xl bg-card border border-border shadow-soft flex items-center justify-center"
                  >
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 1 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </motion.div>

            {/* Order side */}
            <div className="relative w-full max-w-sm">
              <div className="text-center mb-6">
                <p className="text-sm font-medium text-primary uppercase tracking-wide">
                  With Kalvion
                </p>
              </div>
              <div className="relative h-48 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="grid grid-cols-2 gap-3"
                >
                  {["Unified Data", "Automation", "Full Visibility", "AI Insights"].map(
                    (label, i) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 1.3 + i * 0.1 }}
                        className="w-36 h-20 rounded-xl bg-card border border-primary/20 shadow-card flex items-center justify-center hover:shadow-glow transition-shadow duration-300"
                      >
                        <p className="text-sm font-medium text-foreground">{label}</p>
                      </motion.div>
                    )
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;

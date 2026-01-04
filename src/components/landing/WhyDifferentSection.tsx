import { motion } from "framer-motion";
import { Target, Layers, BarChart3, Zap } from "lucide-react";

const differences = [
  {
    icon: Target,
    title: "Not marks-focused",
    description: "We build understanding, not just scores.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Layers,
    title: "Not ERP clutter",
    description: "Clean, purposeful features. No bloat.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: BarChart3,
    title: "Not student ranking",
    description: "Individual growth over competition.",
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
  {
    icon: Zap,
    title: "Not manual chaos",
    description: "Automation that actually works.",
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
];

const WhyDifferentSection = () => {
  return (
    <section className="relative py-32 lg:py-40 overflow-hidden bg-background">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto text-center mb-16 lg:mb-20"
        >
          <p className="text-sm font-medium text-primary mb-6 tracking-wide uppercase">
            Why We're Different
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight">
            What Kalvion is{" "}
            <span className="text-muted-foreground">not</span>.
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {differences.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div className="h-full p-8 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-hover hover:border-primary/20 transition-all duration-400">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className={`w-14 h-14 rounded-2xl ${item.bgColor} flex items-center justify-center mb-6`}
                >
                  <item.icon className={`w-7 h-7 ${item.color}`} />
                </motion.div>

                <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                  {item.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-center mt-16 lg:mt-20"
        >
          <p className="text-xl lg:text-2xl font-display text-muted-foreground max-w-2xl mx-auto">
            Kalvion is{" "}
            <span className="text-foreground font-semibold">
              clarity, structure, and growth
            </span>{" "}
            — designed for schools that care about real education.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyDifferentSection;

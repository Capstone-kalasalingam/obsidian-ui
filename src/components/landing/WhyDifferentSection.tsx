import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { X, Target, Layers, BarChart3, Zap } from "lucide-react";

const differences = [
  {
    icon: Target,
    notThis: "Marks-focused ranking",
    butThis: "Growth-focused guidance",
    description: "We track progress, not just scores",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Layers,
    notThis: "ERP complexity",
    butThis: "Simple clarity",
    description: "Tools that work, not confuse",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: BarChart3,
    notThis: "Student competition",
    butThis: "Student development",
    description: "Every child grows at their pace",
    color: "text-amber-600",
    bgColor: "bg-soft-yellow",
  },
  {
    icon: Zap,
    notThis: "Manual chaos",
    butThis: "Automated harmony",
    description: "Less admin work, more teaching",
    color: "text-rose-600",
    bgColor: "bg-soft-pink",
  },
];

const WhyDifferentSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Why Kalvion
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            What Kalvion is{" "}
            <span className="text-muted-foreground">not</span>.
          </h2>
          <p className="text-lg text-muted-foreground">
            Focused on what truly matters in education
          </p>
        </motion.div>

        {/* Differences Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {differences.map((diff, i) => (
            <motion.div
              key={diff.notThis}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              whileHover={{ y: -4 }}
              className="group p-6 rounded-2xl bg-card border border-border/50 shadow-soft transition-all duration-300 hover:shadow-hover cursor-default"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${diff.bgColor} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
                  <diff.icon className={`w-6 h-6 ${diff.color}`} />
                </div>
                <div className="flex-1">
                  {/* Not this */}
                  <div className="flex items-center gap-2 mb-2">
                    <X className="w-4 h-4 text-destructive/60" />
                    <span className="text-sm text-muted-foreground line-through">
                      {diff.notThis}
                    </span>
                  </div>
                  {/* But this */}
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {diff.butThis}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {diff.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-xl md:text-2xl font-display font-medium text-foreground">
            Kalvion is{" "}
            <span className="text-gradient-primary">clarity, structure, and growth</span>{" "}
            — designed for schools that care.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyDifferentSection;

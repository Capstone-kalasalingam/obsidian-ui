import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Award, Building, Eye, Lock, CheckCircle2 } from "lucide-react";

const trustPoints = [
  {
    icon: Eye,
    title: "Complete Visibility",
    description: "See everything across your school in real-time",
  },
  {
    icon: Lock,
    title: "Full Control",
    description: "Manage permissions, data, and access with precision",
  },
  {
    icon: CheckCircle2,
    title: "Quality Assurance",
    description: "Ensure standards are met across all classrooms",
  },
];

const TrustSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      id="about"
      className="py-24 lg:py-32 bg-soft-bg relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            {/* Abstract Leadership Visual */}
            <div className="relative w-full max-w-md mx-auto aspect-square">
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-primary/20"
              />
              
              {/* Middle ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 rounded-full border border-primary/30"
              />

              {/* Central shield */}
              <div className="absolute inset-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-glow"
                >
                  <Shield className="w-12 h-12 text-primary-foreground" />
                </motion.div>
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-8 p-4 rounded-2xl bg-card shadow-card border border-border/50"
              >
                <Award className="w-7 h-7 text-amber-500" />
              </motion.div>

              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-14 left-6 p-4 rounded-2xl bg-card shadow-card border border-border/50"
              >
                <Building className="w-7 h-7 text-primary" />
              </motion.div>

              <motion.div
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 right-0 p-4 rounded-2xl bg-card shadow-card border border-border/50"
              >
                <Eye className="w-7 h-7 text-emerald-500" />
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Built for Principals
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
              Built for principals who{" "}
              <span className="text-gradient-primary">demand clarity</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Kalvion gives you the tools to see your school clearly, act
              decisively, and lead with confidence. No noise, no clutter.
            </p>

            {/* Trust Points */}
            <div className="space-y-4">
              {trustPoints.map((point, i) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border/50 shadow-soft cursor-default transition-shadow hover:shadow-glow"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <point.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {point.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {point.description}
                    </p>
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

export default TrustSection;

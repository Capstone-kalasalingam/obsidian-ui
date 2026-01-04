import { motion } from "framer-motion";
import { Shield, Award, Building } from "lucide-react";

const TrustSection = () => {
  return (
    <section className="relative py-32 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-soft-purple/20 to-background" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - Visual */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="relative">
                {/* Abstract leadership illustration */}
                <div className="aspect-square max-w-md mx-auto relative">
                  {/* Outer ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-dashed border-primary/20"
                  />

                  {/* Middle ring */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-8 rounded-full border border-primary/30"
                  />

                  {/* Inner gradient circle */}
                  <div className="absolute inset-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-glow"
                    >
                      <Building className="w-12 h-12 text-primary-foreground" />
                    </motion.div>
                  </div>

                  {/* Floating badges */}
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-12 right-8 p-4 rounded-2xl bg-card shadow-card border border-border/50"
                  >
                    <Shield className="w-8 h-8 text-primary" />
                  </motion.div>

                  <motion.div
                    animate={{ y: [5, -5, 5] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-16 left-4 p-4 rounded-2xl bg-card shadow-card border border-border/50"
                  >
                    <Award className="w-8 h-8 text-accent" />
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Right - Content */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              <div>
                <p className="text-sm font-medium text-primary mb-4 tracking-wide uppercase">
                  Built for Leaders
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight mb-6">
                  Built for real schools.
                </h2>
                <p className="text-2xl lg:text-3xl font-display font-medium text-muted-foreground leading-snug">
                  Designed for principals who demand{" "}
                  <span className="text-foreground">clarity</span>.
                </p>
              </div>

              <div className="space-y-6 pt-4">
                {[
                  {
                    title: "Complete Visibility",
                    description:
                      "See every classroom, every student, every metric. Nothing hidden, nothing missed.",
                  },
                  {
                    title: "Trusted Control",
                    description:
                      "Your school, your rules. Kalvion empowers without overstepping.",
                  },
                  {
                    title: "Calm Confidence",
                    description:
                      "Make decisions backed by data, not guesswork. Lead with certainty.",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-1.5 rounded-full bg-primary/30 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {item.title}
                      </h4>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

const CTASection = () => {
  return (
    <section className="relative py-32 lg:py-40 overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-dark" />

      {/* Animated gradient mesh */}
      <motion.div
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, hsl(245 50% 40% / 0.4) 0%, transparent 40%), radial-gradient(circle at 80% 70%, hsl(265 40% 35% / 0.3) 0%, transparent 40%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Floating shapes */}
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[15%] w-32 h-32 rounded-full bg-primary/10 blur-2xl"
      />
      <motion.div
        animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-[15%] w-40 h-40 rounded-full bg-primary/15 blur-2xl"
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-white leading-tight mb-6"
          >
            See your school clearly.
            <br />
            <span className="text-white/70">Lead confidently.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg lg:text-xl text-white/60 max-w-2xl mx-auto mb-12"
          >
            Join the growing number of schools transforming their operations with
            Kalvion. Start your journey today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="h-14 px-8 text-base font-semibold rounded-xl bg-white text-foreground hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Request a Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-base font-semibold rounded-xl border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Talk to Us
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 pt-12 border-t border-white/10"
          >
            <p className="text-sm text-white/40 mb-6">
              Trusted by forward-thinking schools
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
              {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="h-8 w-24 rounded bg-white/10 flex items-center justify-center"
                >
                  <span className="text-white/30 text-xs font-medium">
                    School {i}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

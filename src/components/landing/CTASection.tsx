import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

const CTASection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="py-24 lg:py-32 relative overflow-hidden"
    >
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-dark" />
      
      {/* Animated mesh overlay */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/10 blur-3xl"
        />
      </div>

      {/* Subtle floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0.08, 0.15, 0.08],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            className="absolute w-32 h-32 rounded-full border border-white/5"
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 20}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-white leading-tight mb-6">
            See your school clearly.{" "}
            <span className="text-white/70">Lead confidently.</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            Join schools across the country that trust Kalvion for clarity,
            control, and confidence in education.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="h-14 px-8 rounded-full text-base font-semibold shadow-lg bg-white text-foreground hover:bg-white/90"
            >
              Request a Demo
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 rounded-full text-base font-semibold border-2 border-white/30 text-white hover:bg-white/10"
            >
              <MessageCircle className="mr-2 w-4 h-4" />
              Contact Us
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 pt-10 border-t border-white/10"
          >
            <p className="text-sm text-white/40 mb-5">Trusted by leading schools</p>
            <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
              {["Delhi Public School", "St. Mary's Academy", "Modern School", "National Academy"].map(
                (school, i) => (
                  <motion.span
                    key={school}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="text-white/35 font-medium text-sm hover:text-white/55 transition-colors cursor-default"
                  >
                    {school}
                  </motion.span>
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;

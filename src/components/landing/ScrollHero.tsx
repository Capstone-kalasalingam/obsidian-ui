import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import teacherBookImg from "@/assets/landing/teacher-book.jpg";
import openBookImg from "@/assets/landing/open-book.jpg";
import studentReadingImg from "@/assets/landing/student-reading.jpg";

const ScrollHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Scene 1: Teacher with book (0 - 0.25)
  const scene1Opacity = useTransform(scrollYProgress, [0, 0.2, 0.25], [1, 1, 0]);
  const scene1Scale = useTransform(scrollYProgress, [0, 0.25], [1, 0.95]);
  const teacherY = useTransform(scrollYProgress, [0, 0.25], [0, -50]);

  // Scene 2: Transition (0.2 - 0.45)
  const scene2Opacity = useTransform(scrollYProgress, [0.2, 0.25, 0.4, 0.45], [0, 1, 1, 0]);
  const bookCenterY = useTransform(scrollYProgress, [0.2, 0.35], [100, 0]);
  const bookScale = useTransform(scrollYProgress, [0.2, 0.35], [0.8, 1]);

  // Scene 3: Book opening (0.4 - 0.65)
  const scene3Opacity = useTransform(scrollYProgress, [0.4, 0.45, 0.6, 0.65], [0, 1, 1, 0]);
  const bookGlow = useTransform(scrollYProgress, [0.45, 0.55], [0, 1]);
  const openBookScale = useTransform(scrollYProgress, [0.45, 0.55], [0.9, 1.05]);

  // Scene 4: Student reading (0.6 - 1)
  const scene4Opacity = useTransform(scrollYProgress, [0.6, 0.7, 1], [0, 1, 1]);
  const studentY = useTransform(scrollYProgress, [0.6, 0.75], [80, 0]);
  const studentScale = useTransform(scrollYProgress, [0.6, 0.8], [0.95, 1]);

  // Background parallax
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Text animations
  const text1Opacity = useTransform(scrollYProgress, [0, 0.05, 0.15, 0.22], [1, 1, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.22, 0.28, 0.38, 0.45], [0, 1, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.45, 0.52, 0.62, 0.68], [0, 1, 1, 0]);
  const text4Opacity = useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 1, 1]);

  return (
    <section ref={containerRef} className="relative h-[400vh]">
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden bg-gradient-to-b from-background via-soft-indigo/20 to-background">
        {/* Background gradient orbs */}
        <motion.div
          style={{ y: bgY }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-soft-purple/30 blur-3xl" />
        </motion.div>

        {/* Scene 1: Teacher with closed book */}
        <motion.div
          style={{ opacity: scene1Opacity, scale: scene1Scale, y: teacherY }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative max-w-5xl mx-auto px-6">
            <motion.div
              className="relative rounded-3xl overflow-hidden shadow-hover"
              style={{ rotateX: 5, rotateY: -3 }}
            >
              <img
                src={teacherBookImg}
                alt="Teacher holding a book"
                className="w-full h-auto max-h-[60vh] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </motion.div>
          </div>
        </motion.div>

        {/* Scene 1 Text */}
        <motion.div
          style={{ opacity: text1Opacity }}
          className="absolute bottom-24 left-0 right-0 text-center px-6"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Every great school begins with a teacher.
          </h2>
        </motion.div>

        {/* Scene 2: Book moving to center */}
        <motion.div
          style={{ opacity: scene2Opacity, y: bookCenterY, scale: bookScale }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative">
            <motion.div
              className="w-64 h-80 md:w-80 md:h-96 rounded-2xl bg-primary shadow-glow-strong overflow-hidden"
              style={{ rotateY: 5, rotateX: 10 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-dark" />
              <div className="absolute inset-4 border border-primary-foreground/20 rounded-lg" />
              <div className="absolute bottom-8 left-8 right-8 space-y-2">
                <div className="h-1 w-3/4 bg-primary-foreground/30 rounded" />
                <div className="h-1 w-1/2 bg-primary-foreground/20 rounded" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scene 2 Text */}
        <motion.div
          style={{ opacity: text2Opacity }}
          className="absolute bottom-24 left-0 right-0 text-center px-6"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Guidance turns into learning.
          </h2>
        </motion.div>

        {/* Scene 3: Book opening with glow */}
        <motion.div
          style={{ opacity: scene3Opacity, scale: openBookScale }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative max-w-4xl mx-auto px-6">
            <motion.div
              className="relative rounded-3xl overflow-hidden"
              style={{ 
                boxShadow: useTransform(
                  bookGlow, 
                  [0, 1], 
                  ["0 0 0px rgba(99, 102, 241, 0)", "0 0 100px rgba(99, 102, 241, 0.4)"]
                )
              }}
            >
              <img
                src={openBookImg}
                alt="Open book with glowing pages"
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Scene 3 Text */}
        <motion.div
          style={{ opacity: text3Opacity }}
          className="absolute bottom-24 left-0 right-0 text-center px-6"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Knowledge illuminates the path.
          </h2>
        </motion.div>

        {/* Scene 4: Student reading */}
        <motion.div
          style={{ opacity: scene4Opacity, y: studentY, scale: studentScale }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative max-w-5xl mx-auto px-6">
            <motion.div className="relative rounded-3xl overflow-hidden shadow-hover">
              <img
                src={studentReadingImg}
                alt="Student reading a book"
                className="w-full h-auto max-h-[60vh] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            </motion.div>
          </div>
        </motion.div>

        {/* Scene 4 Text & CTA */}
        <motion.div
          style={{ opacity: text4Opacity }}
          className="absolute bottom-16 md:bottom-24 left-0 right-0 text-center px-6"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Kalvion helps knowledge reach every student.
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <Button
              size="lg"
              className="h-14 px-8 text-base font-semibold rounded-xl shadow-glow hover:shadow-glow-strong transition-all duration-300"
            >
              Request a Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-base font-semibold rounded-xl border-2 hover:bg-secondary/80 transition-all duration-300"
            >
              Explore Features
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator - only visible at top */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-sm text-muted-foreground">Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full bg-primary"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ScrollHero;

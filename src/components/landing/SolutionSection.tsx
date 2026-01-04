import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Shield,
  Users,
  TrendingUp,
  Calendar,
  Sparkles,
  LayoutDashboard,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Admin Control & Visibility",
    description: "Complete oversight of school operations",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "Teacher-Guided Management",
    description: "Empower teachers to lead classrooms",
    color: "bg-soft-green text-emerald-600",
  },
  {
    icon: TrendingUp,
    title: "Student Growth Tracking",
    description: "Monitor progress and achievements",
    color: "bg-soft-yellow text-amber-600",
  },
  {
    icon: Calendar,
    title: "Academic Year Control",
    description: "Seamless promotions and transitions",
    color: "bg-soft-pink text-rose-600",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description: "Guidance-focused, not shortcut-driven",
    color: "bg-soft-purple text-primary",
  },
  {
    icon: LayoutDashboard,
    title: "Unified Dashboard",
    description: "Everything you need in one place",
    color: "bg-soft-indigo text-indigo-600",
  },
];

const SolutionSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const dashboardY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const dashboardRotate = useTransform(scrollYProgress, [0, 1], [2, -2]);

  return (
    <section
      ref={containerRef}
      id="features"
      className="py-24 lg:py-32 bg-soft-bg relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            What Kalvion Does
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
            Everything your school needs.{" "}
            <span className="text-muted-foreground">Nothing it doesn't.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A focused platform designed for clarity and control
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              whileHover={{ y: -4 }}
              className="group p-6 rounded-2xl bg-card border border-border/50 shadow-soft transition-all duration-300 hover:shadow-hover cursor-default"
            >
              <div
                className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Dashboard Preview */}
        <motion.div
          style={{ y: dashboardY, rotate: dashboardRotate }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-card border border-border/50 bg-card p-6">
            {/* Mock Dashboard Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">School Dashboard</h4>
                  <p className="text-xs text-muted-foreground">Real-time overview</p>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-soft-yellow" />
                <div className="w-3 h-3 rounded-full bg-soft-green" />
              </div>
            </div>

            {/* Mock Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Total Students", value: "1,247", change: "+12%" },
                { label: "Attendance Today", value: "94.2%", change: "+2.1%" },
                { label: "Active Teachers", value: "48", change: "—" },
                { label: "Classes Running", value: "32", change: "+4" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="p-4 rounded-xl bg-muted/50"
                >
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-foreground">{stat.value}</span>
                    <span className="text-xs text-primary">{stat.change}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mock Chart Area */}
            <div className="h-36 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 flex items-end p-4">
              <div className="flex items-end gap-2 w-full">
                {[40, 65, 45, 80, 55, 70, 60, 85, 50, 75].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={isInView ? { height: `${h}%` } : {}}
                    transition={{ delay: 0.8 + i * 0.05, duration: 0.6 }}
                    className="flex-1 bg-primary/30 rounded-t"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;

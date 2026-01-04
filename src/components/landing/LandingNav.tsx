import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const LandingNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const { scrollY } = useScroll();
  const pillOpacity = useTransform(scrollY, [0, 100], [0.6, 1]);
  const pillScale = useTransform(scrollY, [0, 50], [0.95, 1]);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = ["features", "how-it-works", "about"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features", id: "features" },
    { label: "How It Works", href: "#how-it-works", id: "how-it-works" },
    { label: "About", href: "#about", id: "about" },
  ];

  const scrollToSection = (href: string) => {
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <motion.nav
        style={{
          opacity: pillOpacity,
          scale: pillScale,
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`
          relative flex items-center justify-between gap-2
          px-2 py-2 rounded-full
          bg-background/80 backdrop-blur-xl
          border border-border/50
          shadow-lg shadow-primary/5
          transition-all duration-500
          ${hasScrolled ? "bg-background/95 shadow-xl" : ""}
        `}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center pl-4 pr-2">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-display font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
          >
            Kalvion
          </motion.span>
        </Link>

        {/* Desktop Navigation Pills */}
        <div className="hidden md:flex items-center gap-1 px-2">
          {navLinks.map((link) => (
            <motion.button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className={`
                relative px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-300
                ${activeSection === link.id 
                  ? "text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {activeSection === link.id && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute inset-0 bg-primary rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2 pl-2">
          <Link to="/auth">
            <Button 
              variant="ghost" 
              className="text-sm font-medium rounded-full px-4"
            >
              Login
            </Button>
          </Link>
          <Button className="text-sm font-medium rounded-full px-5 shadow-md shadow-primary/20">
            Request Demo
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 mr-1 rounded-full hover:bg-muted transition-colors"
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </motion.div>
        </button>
      </motion.nav>

      {/* Mobile menu dropdown */}
      <motion.div
        initial={false}
        animate={{
          opacity: isOpen ? 1 : 0,
          y: isOpen ? 0 : -10,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        transition={{ duration: 0.2 }}
        className="fixed top-20 left-4 right-4 md:hidden"
      >
        <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-4 space-y-2">
          {navLinks.map((link) => (
            <motion.button
              key={link.label}
              onClick={() => scrollToSection(link.href)}
              className={`
                w-full text-left px-4 py-3 rounded-xl text-sm font-medium
                transition-all duration-200
                ${activeSection === link.id 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
              whileTap={{ scale: 0.98 }}
            >
              {link.label}
            </motion.button>
          ))}
          <div className="pt-2 border-t border-border space-y-2">
            <Link to="/auth" onClick={() => setIsOpen(false)} className="block">
              <Button variant="outline" className="w-full rounded-xl">
                Login
              </Button>
            </Link>
            <Button className="w-full rounded-xl">Request Demo</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingNav;

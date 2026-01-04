import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const PillNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const { scrollY } = useScroll();
  
  const navWidth = useTransform(
    scrollY,
    [0, 100],
    ["100%", "auto"]
  );

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "About", href: "#about" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`
          transition-all duration-500 ease-out
          ${hasScrolled 
            ? "bg-card/95 backdrop-blur-xl shadow-card border border-border/50 rounded-full px-2 py-2" 
            : "bg-transparent px-6 py-4 w-full max-w-7xl"
          }
        `}
      >
        <div className={`flex items-center ${hasScrolled ? "gap-2" : "justify-between"}`}>
          {/* Logo */}
          <Link 
            to="/" 
            className={`flex items-center ${hasScrolled ? "px-4" : ""}`}
          >
            <span className="text-xl font-display font-bold text-foreground">
              Kalvion
            </span>
          </Link>

          {/* Desktop Navigation - Hidden when not scrolled, shown in pill */}
          <div className={`hidden md:flex items-center ${hasScrolled ? "gap-1" : "gap-8"}`}>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className={`
                  text-sm font-medium transition-colors
                  ${hasScrolled 
                    ? "px-4 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50" 
                    : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className={`hidden md:flex items-center ${hasScrolled ? "gap-1 pl-2" : "gap-4"}`}>
            <Link to="/auth">
              <Button 
                variant="ghost" 
                size={hasScrolled ? "sm" : "default"}
                className={`text-sm font-medium ${hasScrolled ? "rounded-full" : ""}`}
              >
                Login
              </Button>
            </Link>
            <Button 
              size={hasScrolled ? "sm" : "default"}
              className={`text-sm font-medium ${hasScrolled ? "rounded-full" : "rounded-lg shadow-soft"}`}
            >
              Request Demo
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-full hover:bg-muted transition-colors ${hasScrolled ? "ml-2" : ""}`}
          >
            {isOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile menu - Only show when scrolled (pill mode) */}
        {isOpen && hasScrolled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 mx-4 p-4 bg-card/95 backdrop-blur-xl rounded-2xl shadow-card border border-border/50"
          >
            <div className="space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 border-t border-border/50 space-y-2">
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full rounded-lg">
                    Login
                  </Button>
                </Link>
                <Button className="w-full rounded-lg">Request Demo</Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Mobile menu - Full width when not scrolled */}
        {isOpen && !hasScrolled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pt-4 pb-2"
          >
            <div className="space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-4 border-t border-border/50 space-y-3">
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Button className="w-full">Request Demo</Button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>
    </div>
  );
};

export default PillNav;

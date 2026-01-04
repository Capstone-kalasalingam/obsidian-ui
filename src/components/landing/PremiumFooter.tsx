import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PremiumFooter = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="py-16 bg-background border-t border-border/50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Kalvion
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6">
              The intelligent school platform that brings clarity, control, and
              confidence to education.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <Link
                  to="/auth"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@kalvion.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  hello@kalvion.com
                </a>
              </li>
              <li>
                <button className="px-4 py-2 mt-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  Request Demo
                </button>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Kalvion. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PremiumFooter;

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Mail, Phone } from "lucide-react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-primary/70 backdrop-blur-xl border-b border-accent/20 shadow-lg"
          : "bg-primary/95 border-b border-primary-foreground/10"
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-heading text-2xl font-bold text-primary-foreground tracking-wide">
          Lauture<span className="text-accent">Global</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  location.pathname === link.path ? "text-accent" : "text-primary-foreground/80"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="sky" size="sm" asChild>
              <a href="mailto:info@latureglobal.com">
                <Mail size={16} /> Email Us
              </a>
            </Button>
            <Button variant="outline-light" size="sm" asChild>
              <a href="tel:+250792866210">
                <Phone size={16} /> Phone
              </a>
            </Button>
          </div>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-primary-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/10 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`block px-6 py-3 text-sm font-medium transition-colors hover:text-accent ${
                location.pathname === link.path ? "text-accent" : "text-primary-foreground/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="px-6 pt-2 flex flex-col gap-2">
            <Button variant="sky" size="sm" className="w-full" asChild>
              <a href="mailto:info@latureglobal.com" onClick={() => setOpen(false)}>
                <Mail size={16} /> Email Us
              </a>
            </Button>
            <Button variant="outline-light" size="sm" className="w-full" asChild>
              <a href="tel:+250792866210" onClick={() => setOpen(false)}>
                <Phone size={16} /> Phone
              </a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

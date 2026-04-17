import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const services = [
  "Basic Guidance and Assistance",
  "Comprehensive Strategy and Assistance",
  "Full Premium Service",
];

const Footer = () => (
  <footer className="border-t-4 border-accent bg-background">
    <div className="container py-16 grid md:grid-cols-3 gap-12">
      {/* Quick Links */}
      <div>
        <h3 className="font-heading text-xl font-bold text-primary mb-5">Quick Links</h3>
        <ul className="space-y-3 text-sm">
          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About Us" },
            { to: "/services", label: "Services" },
            { to: "/founders", label: "Founders Profiles" },
            { to: "/contact", label: "Contact" },
          ].map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="text-foreground/80 hover:text-accent transition-colors inline-flex items-center gap-2 group"
              >
                <span className="w-0 h-px bg-accent transition-all duration-300 group-hover:w-4" />
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Our Services */}
      <div>
        <h3 className="font-heading text-xl font-bold text-primary mb-5">Our Services</h3>
        <ul className="space-y-3 text-sm">
          {services.map((s) => (
            <li key={s}>
              <Link
                to="/services"
                className="text-foreground/80 hover:text-accent transition-colors inline-flex items-center gap-2 group"
              >
                <span className="w-0 h-px bg-accent transition-all duration-300 group-hover:w-4" />
                {s}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="font-heading text-xl font-bold text-primary mb-5">Contact Info</h3>
        <ul className="space-y-4 text-sm">
          <li className="flex gap-3 text-foreground/80">
            <MapPin size={18} className="flex-shrink-0 text-accent mt-0.5" />
            <span className="leading-relaxed">
              KG 17 Avenue Remera Corner Building Suite 201,<br />
              Remera, Kigali, RWANDA
            </span>
          </li>
          <li>
            <a
              href="mailto:info@latureglobal.com"
              className="flex gap-3 text-foreground/80 hover:text-accent transition-colors"
            >
              <Mail size={18} className="flex-shrink-0 text-accent" />
              info@latureglobal.com
            </a>
          </li>
          <li>
            <a
              href="tel:+250792866210"
              className="flex gap-3 text-foreground/80 hover:text-accent transition-colors"
            >
              <Phone size={18} className="flex-shrink-0 text-accent" />
              +250 792 866 210
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div className="border-t border-border">
      <div className="container py-5 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
        <p className="font-heading text-sm font-bold text-primary">Lauture Global LTD</p>
        <p>© {new Date().getFullYear()} Lauture Global LTD. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;

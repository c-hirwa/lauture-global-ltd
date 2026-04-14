import { Link } from "react-router-dom";
import { MapPin, Mail, Phone } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="font-heading text-xl font-bold mb-3">
          Lauture<span className="text-accent">Global</span>
        </h3>
        <p className="text-primary-foreground/70 text-sm leading-relaxed">
          Your trusted partner for relocation and vacation consulting in Rwanda and beyond.
        </p>
      </div>
      <div>
        <h4 className="font-heading font-semibold mb-3">Quick Links</h4>
        <ul className="space-y-2 text-sm text-primary-foreground/70">
          {["/about", "/services", "/founders", "/contact"].map((path) => (
            <li key={path}>
              <Link to={path} className="hover:text-accent transition-colors capitalize">
                {path.slice(1)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-heading font-semibold mb-3">Contact</h4>
        <ul className="space-y-2 text-sm text-primary-foreground/70">
          <li className="flex items-center gap-2"><MapPin size={14} /> Kigali, Rwanda</li>
          <li className="flex items-center gap-2"><Mail size={14} /> info@lautureglobal.com</li>
          <li className="flex items-center gap-2"><Phone size={14} /> +250 788 000 000</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-primary-foreground/10 py-4 text-center text-xs text-primary-foreground/50">
      © {new Date().getFullYear()} Lauture Global LTD. All rights reserved.
    </div>
  </footer>
);

export default Footer;

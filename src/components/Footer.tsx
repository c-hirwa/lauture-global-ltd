import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram } from "lucide-react";

const services = [
  "Basic Guidance",
  "Comprehensive Strategy & Assistance",
  "Full Premium Service",
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/lautureglobal",
    icon: Facebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/lautureglobal",
    icon: Instagram,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@lauture.global",
    icon: ({ className, size }: { className?: string; size?: number }) => (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        width={size}
        height={size}
        aria-hidden="true"
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-6.9a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    ),
  },
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
            { to: "/resources", label: "Resources" },
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
        <ul className="space-y-4 text-sm mb-6">
          <li className="flex gap-3 text-foreground/80">
            <MapPin size={18} className="flex-shrink-0 text-accent mt-0.5" />
            <span className="leading-relaxed">
              KG 17 Avenue Remera Corner Building Suite 201,<br />
              Remera, Kigali, RWANDA
            </span>
          </li>
          <li>
            <a
              href="mailto:info@lautureglobal.com"
              className="flex gap-3 text-foreground/80 hover:text-accent transition-colors"
            >
              <Mail size={18} className="flex-shrink-0 text-accent" />
              info@lautureglobal.com
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

        <div className="flex items-center gap-4">
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Lauture Global on ${social.label}`}
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>
      </div>
    </div>

    <div className="border-t border-border">
      <div className="container py-5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p className="font-heading text-sm font-bold text-primary">Lauture Global LTD</p>
        <p>© {new Date().getFullYear()} Lauture Global LTD. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;

import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t-4 border-accent bg-background">
    <div className="container py-12 flex flex-col md:flex-row justify-between gap-8">
      <div>
        <h3 className="font-heading text-xl font-bold text-foreground mb-3">
          Lauture Global LTD
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
          KG 17 Avenue Remera Corner Building Suite 201,<br />
          Remera, Kigali, RWANDA
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          info@latureglobal.com | +250 792 866 210
        </p>
      </div>
      <div>
        <h4 className="font-heading font-semibold text-foreground mb-3">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/" className="text-foreground hover:text-accent transition-colors">Home</Link></li>
          <li><Link to="/founders" className="text-foreground hover:text-accent transition-colors">Founders Profiles</Link></li>
          <li><Link to="/contact" className="text-foreground hover:text-accent transition-colors">Contact</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
      © {new Date().getFullYear()} Lauture Global LTD. All rights reserved.
    </div>
  </footer>
);

export default Footer;

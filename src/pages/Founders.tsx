import { Linkedin, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const founders = [
  {
    name: "Jean-Pierre Lauture",
    role: "Co-Founder & CEO",
    bio: "With over a decade of experience in international business development, Jean-Pierre leads Lauture Global's strategic vision. His passion for connecting global talent with Rwanda's opportunities drives the company's mission.",
    linkedin: "#",
    email: "jp@lautureglobal.com",
  },
  {
    name: "Amina Uwimana",
    role: "Co-Founder & COO",
    bio: "Amina brings deep expertise in operations and client relations. Having guided hundreds of families through successful relocations, she ensures every client receives personalized, world-class service.",
    linkedin: "#",
    email: "amina@lautureglobal.com",
  },
];

const Founders = () => (
  <>
    <Navbar />
    <main className="pt-16">
      <section className="bg-primary py-20">
        <div className="container text-center">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Leadership</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Meet Our Founders</h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            The visionaries behind Lauture Global LTD, dedicated to making Rwanda accessible to the world.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {founders.map((f) => (
            <div key={f.name} className="bg-card rounded-lg overflow-hidden border border-border shadow-[var(--shadow-card)]">
              <div className="h-48 bg-gradient-to-br from-primary to-secondary/40 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-accent/20 border-4 border-accent flex items-center justify-center">
                  <span className="font-heading text-3xl font-bold text-accent">
                    {f.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-heading font-bold text-xl mb-1">{f.name}</h3>
                <p className="text-accent font-medium text-sm mb-4">{f.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{f.bio}</p>
                <div className="flex gap-3">
                  <a href={`mailto:${f.email}`} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-accent/15 transition-colors">
                    <Mail size={18} className="text-muted-foreground" />
                  </a>
                  <a href={f.linkedin} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-accent/15 transition-colors">
                    <Linkedin size={18} className="text-muted-foreground" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default Founders;

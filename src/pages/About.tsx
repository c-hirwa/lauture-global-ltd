import { motion } from "framer-motion";
import { Target, Eye, Heart } from "lucide-react";
import aboutImg from "@/assets/about-team.jpeg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const values = [
  { icon: Target, title: "Excellence", desc: "We deliver premium, detail-oriented services that exceed expectations." },
  { icon: Eye, title: "Transparency", desc: "Honest communication and clear processes at every step." },
  { icon: Heart, title: "Care", desc: "We treat every client like family, ensuring comfort and confidence." },
];

const services = [
  "Premium travel planning and curated tourism experiences",
  "Relocation assistance and settlement support",
  "Housing search and lifestyle guidance",
  "Business introductions and investment advisory",
  "Cultural integration services",
  "Concierge and executive support solutions",
];

const About = () => (
  <>
    <Navbar />
    <main className="pt-16">
      {/* Hero */}
      <section className="bg-primary py-20">
        <div className="container text-center">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">About Us</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Who We Are</h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            Founded in Kigali, Lauture Global LTD is a trusted consultancy helping individuals and businesses explore, invest, and integrate into Rwanda.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="container grid md:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:sticky md:top-24"
          >
            <img
              src={aboutImg}
              alt="Lauture Global team"
              className="rounded-lg shadow-[var(--shadow-elevated)]"
              loading="lazy"
              width={1200}
              height={800}
            />
          </motion.div>
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Lauture Global LTD was founded from a genuine passion for connecting people with the beauty, opportunities, and transformational potential that Rwanda offers. Having personally experienced the challenges of international relocation and cross-border integration, our founders recognized the need for a trusted, seamless, end-to-end service designed to simplify the journey for global clients.
              </p>
              <p>
                What began as a vision to bridge international communities with Rwanda has evolved into a dynamic platform supporting tourism, exploration, relocation, investment, and strategic integration into one of Africa's fastest-growing destinations.
              </p>
              <p>
                Rwanda continues to strengthen its global appeal through strong economic performance and strategic governance. In 2025, the Rwanda Development Board (RDB) set a target to surpass <span className="text-foreground font-semibold">USD 700 million in tourism revenues</span> while attracting more than <span className="text-foreground font-semibold">USD 3 billion in new investments</span>, reflecting Rwanda's growing attractiveness to travelers and investors alike.
              </p>
              <p>
                Today, Lauture Global proudly supports clients from North America, the Caribbean, Europe, and beyond, helping individuals, families, entrepreneurs, and investors confidently navigate every stage of their journey to Rwanda.
              </p>
            </div>

            <div className="mt-10">
              <h3 className="font-heading text-xl font-bold mb-4 text-foreground">Our Services Include</h3>
              <ul className="grid sm:grid-cols-2 gap-3">
                {services.map((s) => (
                  <li key={s} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-8 text-muted-foreground leading-relaxed italic border-l-2 border-accent pl-4">
              With deep local expertise, a global mindset, and a personalized client-first approach, Lauture Global is becoming a preferred strategic partner for those seeking to make Rwanda their next home, business destination, or unforgettable travel experience.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted py-20">
        <div className="container">
          <h2 className="font-heading text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.title} className="bg-card rounded-lg p-8 text-center shadow-[var(--shadow-card)]">
                <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="text-accent" size={28} />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default About;

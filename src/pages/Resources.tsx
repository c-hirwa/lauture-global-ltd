import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GuidesSection from "@/components/GuidesSection";

const Resources = () => {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative pt-40 pb-20 md:pt-48 md:pb-28 bg-primary overflow-hidden grain">
          <div className="absolute inset-0 opacity-50" style={{ background: "var(--gradient-radial)" }} />
          <div className="container relative z-10 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/15 text-accent text-xs font-semibold tracking-widest uppercase mb-5">
                Resources
              </span>
              <h1 className="font-heading text-5xl md:text-6xl font-semibold text-primary-foreground leading-[1.05] mb-6">
                Guides for life in <span className="text-gradient-gold italic">Rwanda</span>
              </h1>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">
                Practical, in-country knowledge to help you explore, invest, and settle with confidence. Click any guide to dive in.
              </p>
            </motion.div>
          </div>
        </section>

        <GuidesSection
          showAll
          showCta={false}
          eyebrow="Complete Library"
          heading={<>All <span className="text-gradient-gold italic">guides</span></>}
          subheading="Five focused playbooks covering business, community, culture, finance, and the move itself."
        />
      </main>
      <Footer />
    </>
  );
};

export default Resources;

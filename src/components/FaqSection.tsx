import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What services does Lauture Global LTD offer?",
    answer:
      "We offer three core packages: the Exploration Package ($525) for discovering Rwanda before you commit, the Relocation Package ($1,260) for a fully guided move, and the Settlement Package ($2,100) for complete, end-to-end integration support. We also offer tailored vacation packages and investment & business guidance.",
  },
  {
    question: "Do I need to visit Rwanda before relocating?",
    answer:
      "No — but we highly recommend it. Our Exploration Package is designed exactly for that: a curated discovery trip so you can experience Kigali, meet communities, and validate your plans before making the move. If you prefer to relocate directly, our Relocation Package covers everything remotely.",
  },
  {
    question: "How long does the relocation process take?",
    answer:
      "It depends on your situation — visa type, family size, housing needs, and business setup. Most clients complete their move within 4 to 12 weeks from the first consultation. During your onboarding call, we build a realistic timeline tailored to you.",
  },
  {
    question: "Can you help with visas, housing, and schools?",
    answer:
      "Yes. Through our trusted network of partners — immigration specialists, real estate agencies, schools, and hospitality providers — we coordinate visa guidance, home search, school enrollment, banking, and local registration so everything is handled in one place.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "All payments go through our secure Pesapal checkout, which accepts Mobile Money (MTN MoMo and Airtel Money) as well as card payments (Visa, Mastercard). You choose your preferred method right in the booking flow.",
  },
  {
    question: "How do I get started?",
    answer:
      "The easiest way is to book a free 30-minute discovery call from our Contact page — no commitment required. We'll walk you through your options, answer your questions, and recommend the package that fits your journey.",
  },
];

const FaqSection = () => {
  return (
    <section className="relative bg-background py-24 md:py-32 overflow-hidden">
      <div className="container relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-widest uppercase mb-4">
            FAQ
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-foreground mb-4 leading-tight">
            Frequently Asked <span className="text-gradient-gold italic">Questions</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Everything you need to know about exploring or relocating to Rwanda with Lauture Global LTD.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="rounded-2xl bg-card border border-border px-6 premium-shadow data-[state=open]:border-accent/60 transition-colors"
              >
                <AccordionTrigger className="font-heading text-left text-foreground font-semibold text-lg py-5 hover:no-underline hover:text-accent transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;

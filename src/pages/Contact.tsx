import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent!", description: "We'll get back to you within 24 hours." });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="bg-primary py-20">
          <div className="container text-center">
            <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Get In Touch</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Contact Us</h1>
            <p className="text-primary-foreground/70 max-w-2xl mx-auto">
              Ready to start your journey? Reach out and let's make it happen.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container grid md:grid-cols-5 gap-12 max-w-5xl mx-auto">
            {/* Info */}
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="font-heading font-semibold text-lg mb-4">Contact Information</h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3">
                    <MapPin size={18} className="text-accent mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">KG 17 Avenue, Remera Corner Building, Suite 201, Kigali, Rwanda</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail size={18} className="text-accent mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">info@lautureglobal.com</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone size={18} className="text-accent mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">+250 792 866 210</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg mb-2">Office Hours</h3>
                <p className="text-muted-foreground text-sm">Mon – Fri: 8:00 AM – 6:00 PM (CAT)</p>
                <p className="text-muted-foreground text-sm">Sat: 9:00 AM – 1:00 PM</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="md:col-span-3 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <Input type="email" placeholder="Email Address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
              <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
              <Textarea placeholder="Your Message" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              <Button variant="gold" size="lg" type="submit">
                Send Message <Send size={16} />
              </Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact;

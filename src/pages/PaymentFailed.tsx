import { Link } from "react-router-dom";
import { ArrowRight, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentFailed = () => (
  <div className="min-h-screen bg-[#0D1B5E] text-primary-foreground flex items-center justify-center px-4 py-16">
    <div className="w-full max-w-xl rounded-3xl border border-[#D4AF37]/30 bg-white/5 p-8 text-center shadow-2xl shadow-black/20">
      <XCircle className="mx-auto mb-4 text-[#D4AF37]" size={56} />
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Payment Cancelled</h1>
      <p className="text-sm md:text-base text-primary-foreground/70 leading-relaxed mb-8">
        Your Pesapal payment was cancelled and no payment was confirmed. You can return and try again whenever you are ready.
      </p>
      <Button variant="gold" size="lg" asChild>
        <Link to="/services" className="inline-flex items-center justify-center gap-2">Return to packages <ArrowRight size={18} /></Link>
      </Button>
    </div>
  </div>
);

export default PaymentFailed;

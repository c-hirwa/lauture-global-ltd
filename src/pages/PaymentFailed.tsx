import { Link } from "react-router-dom";
import { ArrowLeft, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentFailed = () => (
  <div className="min-h-screen bg-[hsl(226_65%_10%)] text-primary-foreground flex items-center justify-center px-4 py-16">
    <div className="w-full max-w-xl rounded-3xl border border-accent/20 bg-primary-foreground/5 p-8 text-center shadow-2xl shadow-black/20">
      <XCircle className="mx-auto mb-4 text-destructive" size={56} />
      <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">Payment Cancelled</h1>
      <p className="text-sm md:text-base text-primary-foreground/70 leading-relaxed mb-8">
        You cancelled the Mobile Money payment before completing it. No charge was made — you can restart whenever you're ready, or reach out and we'll help you through it.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="gold" size="lg" asChild>
          <Link to="/services" className="inline-flex items-center justify-center gap-2">
            Back to packages
          </Link>
        </Button>
        <Button variant="outline-light" size="lg" asChild>
          <Link to="/contact" className="inline-flex items-center justify-center gap-2">
            <ArrowLeft size={18} /> Contact us
          </Link>
        </Button>
      </div>
    </div>
  </div>
);

export default PaymentFailed;

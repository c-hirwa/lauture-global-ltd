import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Guide } from "@/data/guides";

interface GuideModalProps {
  guide: Guide | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GuideModal = ({ guide, open, onOpenChange }: GuideModalProps) => {
  if (!guide) return null;
  const Icon = guide.icon;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-background border-accent/20">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <Icon size={24} />
            </div>
            <div>
              <DialogTitle className="font-heading text-2xl md:text-3xl text-foreground">
                {guide.title}
              </DialogTitle>
              <DialogDescription className="text-accent text-sm tracking-wide uppercase">
                {guide.tagline}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <p className="text-muted-foreground leading-relaxed">{guide.intro}</p>
        <div className="mt-2 space-y-5">
          {guide.sections.map((s) => (
            <div key={s.heading} className="border-l-2 border-accent/40 pl-4">
              <h4 className="font-heading text-lg font-semibold text-foreground mb-1">{s.heading}</h4>
              <p className="text-muted-foreground leading-relaxed text-sm">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl bg-accent/10 border border-accent/30 p-5">
          <p className="text-sm text-foreground leading-relaxed italic">
            Contact us to gain access to our detailed comprehensive guides, personalized coaching, and dedicated assistance tailored to support your journey.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuideModal;

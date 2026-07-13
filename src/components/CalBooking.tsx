import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Props {
  calLink: string;
  packageId?: string;
  packageTitle?: string;
  eventType?: string;
  theme?: "light" | "dark";
}

/**
 * Embeds a Cal.com booking widget and persists successful bookings
 * to the Supabase `bookings` table.
 *
 * Update the `calLink` values in the parent config to your real
 * Cal.com event-type slugs (e.g. "your-handle/basic-guidance").
 */
const CalBooking = ({ calLink, packageId, packageTitle, eventType, theme = "dark" }: Props) => {
  const [confirmed, setConfirmed] = useState<null | { name?: string; email?: string; start?: string }>(null);
  const [sdkFailed, setSdkFailed] = useState(false);

  const normalizedCalLink = calLink.startsWith("http") ? calLink : `https://cal.com/${calLink}`;
  const embedUrl = `${normalizedCalLink}${normalizedCalLink.includes("?") ? "&" : "?"}embed=1&primaryColor=%23c9a961`;

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const cal = await getCalApi();
        if (!mounted) return;

        cal("ui", {
          theme,
          cssVarsPerTheme: {
            light: { "cal-brand": "#c9a961" },
            dark: { "cal-brand": "#c9a961" },
          },
          hideEventTypeDetails: false,
          layout: "month_view",
        });

        cal("on", {
          action: "bookingSuccessful",
          callback: async (e: any) => {
            const data = e?.detail?.data ?? {};
            const booking = data.booking ?? {};
            const attendee = (booking.attendees && booking.attendees[0]) || {};
            const name = attendee.name || data.name;
            const email = attendee.email || data.email;
            const start = booking.startTime || data.date;
            const end = booking.endTime;

            try {
              const { error } = await supabase.from("bookings" as any).insert({
                booking_uid: booking.uid || null,
                event_type: eventType || booking.eventType?.slug || calLink,
                package_id: packageId || null,
                package_title: packageTitle || null,
                attendee_name: name || null,
                attendee_email: email || null,
                start_time: start || null,
                end_time: end || null,
                status: booking.status || "confirmed",
                raw: data as any,
              });
              if (error) throw error;
            } catch (err: any) {
              console.error("Failed to save booking:", err);
              toast.error("Booking made but not saved. We'll follow up by email.");
            }

            setConfirmed({ name, email, start });
          },
        });
      } catch (error) {
        console.error("Cal embed failed to initialize:", error);
        if (mounted) {
          setSdkFailed(true);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [calLink, packageId, packageTitle, eventType, theme]);

  if (confirmed) {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 text-accent" size={40} />
        <h3 className="font-heading text-xl font-bold mb-2">Booking Confirmed</h3>
        <p className="text-sm opacity-80">
          Thanks{confirmed.name ? `, ${confirmed.name}` : ""}! A confirmation
          {confirmed.email ? ` has been sent to ${confirmed.email}` : " has been sent to your email"}.
          {confirmed.start && (
            <> Your session is scheduled for <strong>{new Date(confirmed.start).toLocaleString()}</strong>.</>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-accent/20 bg-background">
      {sdkFailed ? (
        <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 bg-primary/5 p-6 text-center">
          <AlertCircle className="text-accent" size={28} />
          <p className="text-sm font-medium text-foreground">The booking widget is temporarily unavailable.</p>
          <a
            href={normalizedCalLink}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
            title="Book a consultation"
          >
            Open booking page
          </a>
          <iframe
            title="Book a consultation"
            src={embedUrl}
            className="mt-2 h-[420px] w-full border-0"
          />
        </div>
      ) : (
        <Cal
          calLink={calLink}
          style={{ width: "100%", height: "600px", overflow: "scroll" }}
          config={{ theme, layout: "month_view" }}
        />
      )}
    </div>
  );
};

export const CAL_LINKS: Record<string, { link: string; eventType: string }> = {
  basic: { link: "https://cal.com/lauture-global/basic-guidance-consultation", eventType: "basic-guidance" },
  comprehensive: { link: "https://cal.com/lauture-global/comprehensive-strategy-session", eventType: "comprehensive-strategy" },
  premium: { link: "https://cal.com/lauture-global/full-service-coaching-call", eventType: "full-service" },
};

export default CalBooking;

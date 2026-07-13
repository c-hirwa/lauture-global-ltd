import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

/** Cal.com public origin (booking pages). Override with VITE_CAL_ORIGIN for EU etc. */
export const CAL_ORIGIN = import.meta.env.VITE_CAL_ORIGIN ?? "https://cal.com";
/** Embed script host — must match your Cal.com account region. */
export const CAL_EMBED_JS_URL =
  import.meta.env.VITE_CAL_EMBED_JS_URL ?? "https://app.cal.com/embed/embed.js";

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
 */
export const normalizeCalLink = (link: string) => {
  if (!link) return "";
  try {
    const url = new URL(link);
    return url.pathname.replace(/^\//, "").replace(/\/$/, "");
  } catch {
    return link
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/^(cal\.com|app\.cal\.com|app\.cal\.eu)\//, "")
      .replace(/\/$/, "");
  }
};

const calBookingUrl = (slug: string) => `${CAL_ORIGIN}/${slug}`;

const CalBooking = ({ calLink, packageId, packageTitle, eventType, theme = "dark" }: Props) => {
  const [confirmed, setConfirmed] = useState<null | { name?: string; email?: string; start?: string }>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const normalizedLink = normalizeCalLink(calLink);
  const embedNamespace = `lauture-${normalizedLink.replace(/\//g, "-")}`;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const cal = await getCalApi({ namespace: embedNamespace, embedJsUrl: CAL_EMBED_JS_URL });
        if (cancelled) return;

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
          callback: async (e: { detail?: { data?: Record<string, unknown> } }) => {
            const data = e?.detail?.data ?? {};
            const booking = (data.booking as Record<string, unknown>) ?? {};
            const attendees = booking.attendees as Array<Record<string, string>> | undefined;
            const attendee = attendees?.[0] ?? {};
            const eventTypeObj = booking.eventType as { slug?: string } | undefined;
            const name = attendee.name || (data.name as string);
            const email = attendee.email || (data.email as string);
            const start = (booking.startTime as string) || (data.date as string);
            const end = booking.endTime as string | undefined;

            try {
              const { error } = await supabase.from("bookings").insert({
                booking_uid: (booking.uid as string) || null,
                event_type: eventType || eventTypeObj?.slug || normalizedLink,
                package_id: packageId || null,
                package_title: packageTitle || null,
                attendee_name: name || null,
                attendee_email: email || null,
                start_time: start || null,
                end_time: end || null,
                status: (booking.status as string) || "confirmed",
                raw: data as import("@/integrations/supabase/types").Json,
              });
              if (error) throw error;
            } catch (err) {
              console.error("Failed to save booking:", err);
              toast.error("Booking made but not saved. We'll follow up by email.");
            }

            setConfirmed({ name, email, start });
          },
        });

        setIsLoaded(true);
      } catch (err) {
        console.error("Unable to initialize Cal widget", err);
        if (!cancelled) setLoadError("The booking widget could not be loaded right now.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [normalizedLink, packageId, packageTitle, eventType, theme, embedNamespace]);

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

  if (loadError) {
    return (
      <div className="rounded-xl border border-accent/20 bg-background p-6 text-center text-sm text-muted-foreground">
        <p>{loadError}</p>
        <a
          href={calBookingUrl(normalizedLink)}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center text-accent underline-offset-4 hover:underline"
        >
          Open booking link directly
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-accent/20 bg-background">
      {!isLoaded && (
        <div className="flex h-[600px] items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="animate-spin" size={18} />
          Loading booking calendar...
        </div>
      )}
      <Cal
        key={normalizedLink}
        namespace={embedNamespace}
        calLink={normalizedLink}
        calOrigin={CAL_ORIGIN}
        embedJsUrl={CAL_EMBED_JS_URL}
        style={{ width: "100%", height: "600px", overflow: "scroll", display: isLoaded ? "block" : "none" }}
        config={{ theme, layout: "month_view" }}
      />
    </div>
  );
};

/** Verified event slugs on cal.com/lauture-global */
export const CAL_LINKS: Record<string, { link: string; eventType: string }> = {
  basic: {
    link: "lauture-global/basic-guidance-consultation",
    eventType: "basic-guidance-consultation",
  },
  comprehensive: {
    link: "lauture-global/comprehensive-strategy-session",
    eventType: "comprehensive-strategy-session",
  },
  premium: {
    link: "lauture-global/full-service-coaching-call",
    eventType: "full-service-coaching-call",
  },
};

export default CalBooking;

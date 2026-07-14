import CalBooking, { CAL_LINKS } from "@/components/CalBooking";
import type { ClientRecord } from "@/hooks/useClientData";

type Props = {
  client: ClientRecord;
};

const BookSession = ({ client }: Props) => {
  const cal =
    (client.package_id && CAL_LINKS[client.package_id]) || CAL_LINKS.basic;

  return (
    <div data-booking-widget className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
      <h3 className="font-heading text-xl font-bold text-foreground mb-1">
        Book your consultation
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        Schedule a session for your{" "}
        <strong className="text-foreground">{client.package_title ?? "relocation"}</strong> package.
        Confirmations are sent to {client.email}.
      </p>
      <CalBooking
        calLink={cal.link}
        eventType={cal.eventType}
        packageId={client.package_id ?? undefined}
        packageTitle={client.package_title ?? undefined}
        theme="light"
      />
    </div>
  );
};

export default BookSession;

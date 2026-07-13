import CalBooking, { CAL_LINKS } from "@/components/CalBooking";
import type { ClientRecord } from "@/hooks/useClientData";

type Props = {
  client: ClientRecord;
};

const BookSession = ({ client }: Props) => {
  const cal =
    (client.package_id && CAL_LINKS[client.package_id]) || CAL_LINKS.basic;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-heading text-xl font-bold text-slate-900 mb-1">
        Book your consultation
      </h3>
      <p className="text-sm text-slate-600 mb-6">
        Schedule a session for your{" "}
        <strong>{client.package_title ?? "relocation"}</strong> package. Pick a
        time that works for you — confirmations are sent to {client.email}.
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

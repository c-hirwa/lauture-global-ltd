import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useClientData } from "@/hooks/useClientData";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  FileText,
  CalendarDays,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  Check,
  Download,
  MessageCircle,
  Mail,
  Loader2,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import logo from "@/assets/logo-lauture.png";
import { JOURNEY_STAGES as STAGES, prettyStatus } from "@/lib/constants";
import BookSession from "@/components/dashboard/BookSession";
import NoIntakeState from "@/components/dashboard/NoIntakeState";
import type { BookingRecord } from "@/hooks/useClientData";

const NAV = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "journey", label: "My Journey", icon: Check },
  { key: "package", label: "My Package", icon: Package },
  { key: "bookings", label: "Book a Session", icon: CalendarDays },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "support", label: "Support", icon: LifeBuoy },
] as const;

type Section = (typeof NAV)[number]["key"];

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { data, isLoading, isError, refetch } = useClientData(user?.email);
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const client = data?.client ?? null;
  const bookings = data?.bookings ?? [];
  const documents = data?.documents ?? [];
  const firstName = client?.full_name?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "there";

  const goTo = (key: Section) => {
    setSection(key);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[hsl(226_65%_10%)] text-primary-foreground z-40 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-primary-foreground/10">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Lauture Global" className="h-8 w-auto" />
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = section === item.key;
            const disabled = !client && item.key !== "overview" && item.key !== "support";
            return (
              <button
                key={item.key}
                onClick={() => !disabled && goTo(item.key)}
                disabled={disabled}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : disabled
                    ? "text-primary-foreground/30 cursor-not-allowed"
                    : "text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-primary-foreground"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-foreground/10">
          <div className="text-xs text-primary-foreground/50 mb-2 truncate">{user?.email}</div>
          <Button variant="outline-light" size="sm" className="w-full" onClick={signOut}>
            <LogOut size={14} /> Sign out
          </Button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 h-14">
          <button className="lg:hidden text-slate-700" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <h2 className="font-heading text-lg font-semibold text-slate-900">
            {NAV.find((n) => n.key === section)?.label}
          </h2>
          <div className="w-6 lg:hidden" />
        </header>

        <main className="p-4 lg:p-8 max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="animate-spin text-accent" size={28} />
            </div>
          ) : isError ? (
            <div className="text-center py-16">
              <p className="text-slate-600 mb-4">Couldn't load your dashboard data.</p>
              <Button variant="gold" onClick={() => refetch()}>Try again</Button>
            </div>
          ) : !client ? (
            <NoIntakeState />
          ) : (
            <>
              {section === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="font-heading text-3xl font-bold text-slate-900">
                      Welcome back, {firstName}
                    </h1>
                    <p className="text-slate-600 mt-1">
                      Here's a snapshot of your relocation journey with Lauture Global.
                    </p>
                  </div>
                  <JourneyTracker stage={client.stage} />
                  <div className="grid md:grid-cols-3 gap-4">
                    <StatCard label="Package" value={client.package_title ?? "—"} />
                    <StatCard label="Payment" value={prettyStatus(client.payment_status)} />
                    <StatCard label="Upcoming sessions" value={String(upcomingCount(bookings))} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <QuickAction
                      title="Book a consultation"
                      desc="Schedule your next session"
                      onClick={() => goTo("bookings")}
                    />
                    <QuickAction
                      title="View documents"
                      desc={`${documents.length} file${documents.length === 1 ? "" : "s"} shared with you`}
                      onClick={() => goTo("documents")}
                    />
                  </div>
                </div>
              )}

              {section === "journey" && (
                <div className="space-y-4">
                  <p className="text-slate-600">Your current relocation stage:</p>
                  <JourneyTracker stage={client.stage} vertical />
                </div>
              )}

              {section === "package" && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="font-heading text-xl font-bold text-slate-900 mb-1">
                    {client.package_title ?? "No package selected"}
                  </h3>
                  {client.package_price != null && (
                    <p className="text-slate-600 mb-4">
                      ${Number(client.package_price).toLocaleString()}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-xs uppercase tracking-widest text-slate-500">Payment status</span>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        client.payment_status === "paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {prettyStatus(client.payment_status)}
                    </span>
                  </div>
                  <Button variant="gold" onClick={() => goTo("bookings")}>
                    Book a consultation <ArrowRight size={16} />
                  </Button>
                </div>
              )}

              {section === "bookings" && (
                <div className="space-y-6">
                  <BookSession client={client} />
                  {bookings.length > 0 && (
                    <div>
                      <h3 className="font-heading font-bold text-slate-900 mb-3">Your sessions</h3>
                      <div className="space-y-3">
                        {bookings.map((b) => (
                          <BookingCard key={b.id} booking={b} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {section === "documents" && (
                <div className="space-y-3">
                  {documents.length === 0 ? (
                    <EmptyState
                      icon={FileText}
                      title="No documents yet"
                      desc="Files shared by the Lauture team will appear here."
                    />
                  ) : (
                    documents.map((d) => (
                      <div
                        key={d.id}
                        className="bg-white rounded-xl border border-slate-200 p-4 flex items-start justify-between gap-4 hover:border-accent/40 transition-colors"
                      >
                        <div className="min-w-0">
                          <h4 className="font-semibold text-slate-900">{d.title}</h4>
                          {d.description && (
                            <p className="text-sm text-slate-600 mt-1">{d.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                            {d.category && (
                              <span className="px-2 py-0.5 rounded bg-slate-100">{d.category}</span>
                            )}
                            <span>{new Date(d.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={d.file_url} target="_blank" rel="noreferrer" download>
                            <Download size={14} /> Download
                          </a>
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {section === "support" && (
                <div className="grid md:grid-cols-2 gap-4">
                  <a
                    href="mailto:info@lautureglobal.com"
                    className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-accent/40 hover:shadow-md transition-all flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center flex-shrink-0">
                      <Mail size={22} />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-slate-900 mb-1">Email support</h4>
                      <p className="text-sm text-slate-600">info@lautureglobal.com</p>
                      <span className="inline-flex items-center gap-1 text-xs text-accent font-semibold mt-2">
                        Send email <ExternalLink size={12} />
                      </span>
                    </div>
                  </a>
                  <a
                    href="https://wa.me/250792866210"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-accent/40 hover:shadow-md transition-all flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <MessageCircle size={22} />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-slate-900 mb-1">WhatsApp</h4>
                      <p className="text-sm text-slate-600">+250 792 866 210</p>
                      <span className="inline-flex items-center gap-1 text-xs text-accent font-semibold mt-2">
                        Message us <ExternalLink size={12} />
                      </span>
                    </div>
                  </a>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

const upcomingCount = (bs: BookingRecord[]) =>
  bs.filter((b) => b.start_time && new Date(b.start_time).getTime() > Date.now()).length;

const BookingCard = ({ booking: b }: { booking: BookingRecord }) => {
  const start = b.start_time ? new Date(b.start_time) : null;
  const past = start ? start.getTime() < Date.now() : false;
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-between gap-4">
      <div>
        <h4 className="font-semibold text-slate-900">
          {b.package_title ?? b.event_type ?? "Consultation"}
        </h4>
        <p className="text-sm text-slate-600">{start ? start.toLocaleString() : "Time TBD"}</p>
      </div>
      <span
        className={`text-xs font-semibold px-2 py-1 rounded ${
          past ? "bg-slate-100 text-slate-600" : "bg-accent/15 text-accent"
        }`}
      >
        {past ? "Past" : b.status || "Upcoming"}
      </span>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5">
    <div className="text-xs uppercase tracking-widest text-slate-500 mb-1">{label}</div>
    <div className="font-heading text-lg font-bold text-slate-900 truncate">{value}</div>
  </div>
);

const QuickAction = ({
  title,
  desc,
  onClick,
}: {
  title: string;
  desc: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="bg-white rounded-xl border border-slate-200 p-5 text-left hover:border-accent/40 hover:shadow-sm transition-all group"
  >
    <h4 className="font-heading font-bold text-slate-900 mb-1 group-hover:text-accent transition-colors">
      {title}
    </h4>
    <p className="text-sm text-slate-500">{desc}</p>
  </button>
);

const EmptyState = ({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof FileText;
  title: string;
  desc: string;
}) => (
  <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
    <Icon size={36} className="mx-auto text-slate-400 mb-3" />
    <h3 className="font-heading font-bold text-slate-900 mb-1">{title}</h3>
    <p className="text-sm text-slate-500">{desc}</p>
  </div>
);

const JourneyTracker = ({
  stage,
  vertical = false,
}: {
  stage?: string;
  vertical?: boolean;
}) => {
  const idx = Math.max(0, STAGES.findIndex((s) => s.key === (stage ?? "enquiry_received")));
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h3 className="font-heading text-lg font-bold text-slate-900 mb-5">My Journey Status</h3>
      <div
        className={
          vertical
            ? "space-y-4"
            : "flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-2"
        }
      >
        {STAGES.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <div
              key={s.key}
              className={
                vertical
                  ? "flex items-center gap-4"
                  : "flex md:flex-col items-center gap-3 md:gap-2 md:flex-1 relative"
              }
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 border-2 transition-all ${
                  done
                    ? "bg-accent border-accent text-accent-foreground"
                    : active
                    ? "bg-white border-accent text-accent ring-4 ring-accent/20"
                    : "bg-white border-slate-300 text-slate-400"
                }`}
              >
                {done ? <Check size={16} /> : i + 1}
              </div>
              <div className={vertical ? "" : "md:text-center"}>
                <div
                  className={`text-sm font-semibold ${
                    done || active ? "text-slate-900" : "text-slate-500"
                  }`}
                >
                  {s.label}
                </div>
                {active && (
                  <div className="text-xs text-accent font-semibold mt-0.5">Current stage</div>
                )}
              </div>
              {!vertical && i < STAGES.length - 1 && (
                <div
                  className={`hidden md:block absolute top-5 left-1/2 w-full h-0.5 -z-0 ${
                    done ? "bg-accent" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;

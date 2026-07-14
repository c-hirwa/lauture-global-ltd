import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useClientData } from "@/hooks/useClientData";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/StatusBadge";
import {
  LayoutDashboard,
  Package,
  FileText,
  CalendarDays,
  LifeBuoy,
  LogOut,
  Menu,
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
    <div className="min-h-screen bg-background flex">
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[hsl(var(--navy-dark))] text-primary-foreground z-40 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Lauture Global" className="h-8 w-auto" />
          </Link>
          <p className="text-[10px] uppercase tracking-widest text-white/40 mt-2">Client Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
                    ? "text-white/25 cursor-not-allowed"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/45 mb-3 truncate px-1">{user?.email}</p>
          <Button variant="outline-light" size="sm" className="w-full" onClick={signOut}>
            <LogOut size={14} /> Sign out
          </Button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-border flex items-center justify-between gap-4 px-4 lg:px-8 h-16">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden text-foreground p-1"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <h2 className="font-heading text-lg font-semibold text-foreground">
              {NAV.find((n) => n.key === section)?.label}
            </h2>
          </div>
          <Button variant="outline" size="sm" onClick={signOut} className="hidden sm:inline-flex">
            <LogOut size={14} /> Sign out
          </Button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="animate-spin text-accent" size={28} />
            </div>
          ) : isError ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">Couldn't load your dashboard data.</p>
              <Button variant="gold" onClick={() => refetch()}>Try again</Button>
            </div>
          ) : !client ? (
            <NoIntakeState />
          ) : (
            <>
              {section === "overview" && (
                <div className="space-y-8">
                  <div>
                    <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                      Welcome back, {firstName}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                      Here's a snapshot of your relocation journey with Lauture Global.
                    </p>
                  </div>

                  <JourneyTracker stage={client.stage} />

                  <div className="grid sm:grid-cols-3 gap-4">
                    <StatCard label="Package" value={client.package_title ?? "—"} />
                    <StatCard label="Payment" value={prettyStatus(client.payment_status)} />
                    <StatCard label="Upcoming sessions" value={String(upcomingCount(bookings))} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <QuickAction
                      title="Book a consultation"
                      desc="Schedule your next session with our team"
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
                  <p className="text-muted-foreground">Your current relocation stage:</p>
                  <JourneyTracker stage={client.stage} vertical />
                </div>
              )}

              {section === "package" && (
                <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
                  <h3 className="font-heading text-2xl font-bold text-foreground mb-1">
                    {client.package_title ?? "No package selected"}
                  </h3>
                  {client.package_price != null && (
                    <p className="text-muted-foreground mb-5">
                      ${Number(client.package_price).toLocaleString()}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mb-8">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">Payment</span>
                    <StatusBadge status={client.payment_status} kind="payment" />
                  </div>
                  <Button variant="gold" onClick={() => goTo("bookings")}>
                    Book a consultation <ArrowRight size={16} />
                  </Button>
                </div>
              )}

              {section === "bookings" && (
                <div className="space-y-8">
                  <BookSession client={client} />
                  <div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-4">Your sessions</h3>
                    {bookings.length === 0 ? (
                      <EmptyState
                        icon={CalendarDays}
                        title="No bookings yet"
                        desc="Schedule your first consultation above to get started."
                        actionLabel="Scroll to calendar"
                        onAction={() =>
                          document.querySelector("[data-booking-widget]")?.scrollIntoView({ behavior: "smooth" })
                        }
                      />
                    ) : (
                      <div className="space-y-3">
                        {bookings.map((b) => (
                          <BookingCard key={b.id} booking={b} />
                        ))}
                      </div>
                    )}
                  </div>
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
                        className="bg-card rounded-xl border border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-accent/40 transition-colors"
                      >
                        <div className="min-w-0">
                          <h4 className="font-semibold text-foreground">{d.title}</h4>
                          {d.description && (
                            <p className="text-sm text-muted-foreground mt-1">{d.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            {d.category && (
                              <span className="px-2 py-0.5 rounded bg-muted">{d.category}</span>
                            )}
                            <span>{new Date(d.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild className="self-start sm:self-center">
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
                  <SupportCard
                    href="mailto:info@lautureglobal.com"
                    icon={Mail}
                    title="Email support"
                    detail="info@lautureglobal.com"
                    cta="Send email"
                  />
                  <SupportCard
                    href="https://wa.me/250792866210"
                    icon={MessageCircle}
                    title="WhatsApp"
                    detail="+250 792 866 210"
                    cta="Message us"
                    external
                    iconClass="bg-emerald-100 text-emerald-600"
                  />
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
  const dateLabel = start
    ? start.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })
    : "Date TBD";
  const timeLabel = start
    ? start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : "Time TBD";

  return (
    <div className="bg-card rounded-xl border border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="min-w-0 space-y-1">
        <h4 className="font-heading font-semibold text-lg text-foreground">
          {b.package_title ?? b.event_type ?? "Consultation"}
        </h4>
        <p className="text-sm text-muted-foreground">
          {dateLabel} · {timeLabel}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {past && <span className="status-badge bg-slate-100 text-slate-600">Past</span>}
        <StatusBadge status={b.status || (past ? "confirmed" : "pending")} kind="booking" />
      </div>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
    <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">{label}</div>
    <div className="font-heading text-lg font-bold text-foreground truncate">{value}</div>
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
    type="button"
    onClick={onClick}
    className="bg-card rounded-xl border border-border p-5 text-left hover:border-accent/50 hover:shadow-sm transition-all group"
  >
    <h4 className="font-heading font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
      {title}
    </h4>
    <p className="text-sm text-muted-foreground">{desc}</p>
  </button>
);

const EmptyState = ({
  icon: Icon,
  title,
  desc,
  actionLabel,
  onAction,
}: {
  icon: typeof FileText;
  title: string;
  desc: string;
  actionLabel?: string;
  onAction?: () => void;
}) => (
  <div className="bg-card rounded-2xl border border-dashed border-border p-10 md:p-12 text-center">
    <Icon size={36} className="mx-auto text-muted-foreground/60 mb-4" />
    <h3 className="font-heading font-bold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">{desc}</p>
    {actionLabel && onAction && (
      <Button variant="gold" size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

const SupportCard = ({
  href,
  icon: Icon,
  title,
  detail,
  cta,
  external,
  iconClass = "bg-accent/15 text-accent",
}: {
  href: string;
  icon: typeof Mail;
  title: string;
  detail: string;
  cta: string;
  external?: boolean;
  iconClass?: string;
}) => (
  <a
    href={href}
    target={external ? "_blank" : undefined}
    rel={external ? "noreferrer" : undefined}
    className="bg-card rounded-2xl border border-border p-6 hover:border-accent/40 hover:shadow-md transition-all flex items-start gap-4"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconClass}`}>
      <Icon size={22} />
    </div>
    <div>
      <h4 className="font-heading font-bold text-foreground mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{detail}</p>
      <span className="inline-flex items-center gap-1 text-xs text-accent font-semibold mt-2">
        {cta} <ExternalLink size={12} />
      </span>
    </div>
  </a>
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
    <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
      <h3 className="font-heading text-xl font-bold text-foreground mb-6">My Journey Status</h3>
      <div
        className={
          vertical
            ? "space-y-5"
            : "flex flex-col md:flex-row md:items-start gap-5 md:gap-2"
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
                className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 border-2 transition-all ${
                  done
                    ? "bg-primary border-primary text-primary-foreground"
                    : active
                    ? "bg-accent border-accent text-accent-foreground ring-4 ring-accent/25"
                    : "bg-white border-border text-muted-foreground"
                }`}
              >
                {done ? <Check size={16} /> : i + 1}
              </div>
              <div className={vertical ? "" : "md:text-center"}>
                <div
                  className={`text-sm font-semibold ${
                    done || active ? "text-foreground" : "text-muted-foreground"
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
                  className={`hidden md:block absolute top-[22px] left-[calc(50%+22px)] right-[-50%] h-0.5 ${
                    done ? "bg-primary" : "bg-border"
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

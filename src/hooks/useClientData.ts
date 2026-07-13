import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Tables } from "@/integrations/supabase/types";

export type ClientRecord = Tables<"clients">;
export type BookingRecord = Tables<"bookings">;
export type DocumentRecord = Tables<"documents">;

export type ClientDashboardData = {
  client: ClientRecord | null;
  bookings: BookingRecord[];
  documents: DocumentRecord[];
};

async function fetchClientDashboard(email: string): Promise<ClientDashboardData> {
  const normalized = email.toLowerCase();

  const [clientRes, bookingsRes, documentsRes] = await Promise.all([
    supabase
      .from("clients")
      .select("*")
      .ilike("email", normalized)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("bookings")
      .select("*")
      .ilike("attendee_email", normalized)
      .order("start_time", { ascending: false }),
    supabase
      .from("documents")
      .select("*")
      .ilike("client_email", normalized)
      .order("created_at", { ascending: false }),
  ]);

  if (clientRes.error) throw clientRes.error;
  if (bookingsRes.error) throw bookingsRes.error;
  if (documentsRes.error) throw documentsRes.error;

  return {
    client: clientRes.data,
    bookings: bookingsRes.data ?? [],
    documents: documentsRes.data ?? [],
  };
}

export function useClientData(email: string | undefined) {
  return useQuery({
    queryKey: ["client-dashboard", email],
    queryFn: () => fetchClientDashboard(email!),
    enabled: !!email,
    staleTime: 30_000,
  });
}

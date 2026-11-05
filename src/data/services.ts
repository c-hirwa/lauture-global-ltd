import { Home, Plane, Globe, Shield, Building, Map, type LucideIcon } from "lucide-react";
import serviceVacation from "@/assets/service-vacation.webp";
import serviceMoving from "@/assets/service-moving.webp";
import serviceIntegration from "@/assets/service-integration.webp";
import serviceConsultation from "@/assets/service-consultation.webp";
import serviceExplore from "@/assets/service-explore.webp";
import serviceInvestment from "@/assets/service-investment.webp";

// Shared by the homepage cards and the Services page so the two always match.
export type Service = {
  id: string;
  icon: LucideIcon;
  image: string;
  title: string;
  summary: string;
  description: string;
};

export const SERVICES: Service[] = [
  {
    id: "residential-relocation",
    icon: Home,
    image: serviceVacation,
    title: "Residential Relocation",
    summary: "Find the right home and settle in without the stress.",
    description:
      "From finding the perfect home to settling in, we handle every detail of your move to Rwanda. Our team scouts properties, negotiates leases, and ensures a smooth transition.",
  },
  {
    id: "vacation-planning",
    icon: Plane,
    image: serviceExplore,
    title: "Vacation & Exploration",
    summary: "Gorilla treks, Lake Kivu and Kigali, planned around you.",
    description:
      "Discover Rwanda's gorilla treks, Lake Kivu retreats, and vibrant Kigali nightlife with curated itineraries designed around your interests and budget.",
  },
  {
    id: "business-consulting",
    icon: Globe,
    image: serviceInvestment,
    title: "Business & Investment",
    summary: "Company setup, permits and real opportunities.",
    description:
      "Starting a business or investing in Rwanda? We guide you through company registration, permits, real estate and local partnerships to get you operational quickly.",
  },
  {
    id: "visa-immigration",
    icon: Shield,
    image: serviceMoving,
    title: "Visa & Immigration",
    summary: "Work permits, residency and paperwork, handled.",
    description:
      "Navigate Rwanda's immigration system with confidence. We assist with work permits, residency visas, and all required documentation.",
  },
  {
    id: "corporate-relocation",
    icon: Building,
    image: serviceConsultation,
    title: "Corporate Relocation",
    summary: "Moving a team? Housing, schools and orientation.",
    description:
      "Comprehensive packages for companies moving employees to Rwanda — including housing, schooling, and cultural orientation programs.",
  },
  {
    id: "cultural-integration",
    icon: Map,
    image: serviceIntegration,
    title: "Cultural Integration",
    summary: "Language, community and feeling at home.",
    description:
      "Language classes, local networking events, and guided community introductions to help you feel at home in Rwanda.",
  },
];

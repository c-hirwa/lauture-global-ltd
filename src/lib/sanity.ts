import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: "tu7ioy3r",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

type SanityImageSource = Parameters<typeof builder.image>[0];

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export type Partner = {
  _id: string;
  name: string;
  category?: string;
  group: "kigali" | "kibuye" | "gisenyi" | "tourism";
  order?: number;
  logo?: SanityImageSource;
};

export const PARTNER_GROUPS: { value: Partner["group"]; label: string }[] = [
  { value: "kigali", label: "Kigali" },
  { value: "kibuye", label: "Kibuye (Karongi)" },
  { value: "gisenyi", label: "Gisenyi (Rubavu)" },
  { value: "tourism", label: "Tourism and Travel Partners" },
];

export const PARTNERS_QUERY = `*[_type == "partner"] | order(group asc, order asc, name asc) {
  _id, name, category, group, order, logo
}`;

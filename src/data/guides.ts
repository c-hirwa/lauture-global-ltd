import { Briefcase, Users, Globe2, Wallet, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Guide {
  slug: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  intro: string;
  sections: { heading: string; body: string }[];
}

export const guides: Guide[] = [
  {
    slug: "business-setup",
    icon: Briefcase,
    title: "Business Setup Guide",
    tagline: "How to register a company in Rwanda",
    intro:
      "Rwanda is one of Africa's easiest places to do business. This guide walks you through company registration, licensing, and the practical steps to get operational in Kigali.",
    sections: [
      {
        heading: "1. Choose your legal structure",
        body: "Most foreign founders register a Private Limited Company (Ltd) through the Rwanda Development Board (RDB). Sole proprietorships, partnerships, and branches of foreign companies are also available.",
      },
      {
        heading: "2. Register online with RDB",
        body: "Company registration is fully online via businessprocedures.rdb.rw. The process typically takes 6 hours to 2 business days and includes your TIN (tax ID) and social security registration.",
      },
      {
        heading: "3. Open a corporate bank account",
        body: "Major banks include Bank of Kigali, Equity Bank, I&M, and Ecobank. You'll need your RDB certificate, articles of association, and director IDs/passports.",
      },
      {
        heading: "4. Sector licenses & permits",
        body: "Tourism, financial services, education, and health businesses require additional sector licenses. We help you identify and secure exactly what you need.",
      },
      {
        heading: "5. Tax & compliance",
        body: "Corporate tax is 30% (with incentives for priority sectors), VAT is 18%. Monthly PAYE and quarterly tax filings apply. Lauture Global partners with local accountants for ongoing compliance.",
      },
    ],
  },
  {
    slug: "community-social",
    icon: Users,
    title: "Community & Social Life Guide",
    tagline: "Expat clubs, churches, and social groups",
    intro:
      "Settling in is more than logistics — it's finding your people. Kigali's expat community is warm, diverse, and easy to plug into.",
    sections: [
      {
        heading: "Expat networks",
        body: "Kigali Expats and Internations Kigali host monthly meetups. Living in Kigali (Facebook group, 30k+ members) is the go-to for advice, housing, and events.",
      },
      {
        heading: "Faith communities",
        body: "Catholic, Protestant, Anglican, Pentecostal, Muslim, and Hindu communities are all active. Notable: Christian Life Assembly (English services), Saint Famille Cathedral, Kigali Islamic Cultural Centre.",
      },
      {
        heading: "Sports & wellness clubs",
        body: "Cercle Sportif de Kigali and Kigali Golf Club offer pools, tennis, and gyms. Hash House Harriers run weekly. Yoga studios and Crossfit boxes are growing fast in Kacyiru and Nyarutarama.",
      },
      {
        heading: "Professional groups",
        body: "Norrsken House Kigali (East Africa's largest entrepreneur hub), Westerwelle Startup Haus, and chamber of commerce events connect you with the local business scene.",
      },
      {
        heading: "Family & schools",
        body: "Green Hills Academy, International School of Kigali, and Riviera High School serve expat families. Most have active parent communities.",
      },
    ],
  },
  {
    slug: "cultural",
    icon: Globe2,
    title: "Cultural Guide",
    tagline: "Customs, language basics, and etiquette",
    intro:
      "Rwandan culture values respect, modesty, and community. A little awareness goes a long way in building trust and friendships.",
    sections: [
      {
        heading: "Languages",
        body: "Kinyarwanda is the national language; English and French are official. Swahili is widely understood. Learning basic Kinyarwanda greetings is deeply appreciated.",
      },
      {
        heading: "Essential phrases",
        body: "Muraho (hello), Murakoze (thank you), Yego/Oya (yes/no), Amakuru? (how are you?), Ni meza (I'm well), Witwa nde? (what's your name?).",
      },
      {
        heading: "Greetings & respect",
        body: "A handshake — often with the left hand supporting the right forearm — is standard. Use titles (Mr., Mrs., Dr.) until invited otherwise. Stand when elders enter the room.",
      },
      {
        heading: "Umuganda",
        body: "On the last Saturday of each month from 8–11am, the country pauses for community service. Most businesses close. Joining your neighborhood's Umuganda is a powerful way to integrate.",
      },
      {
        heading: "Dress & conduct",
        body: "Modest dress is standard — shoulders and knees covered in professional and rural settings. Public displays of affection are uncommon. Plastic bags are banned nationwide.",
      },
    ],
  },
  {
    slug: "financial",
    icon: Wallet,
    title: "Financial Planning Guide",
    tagline: "Taxes, investments, and sending money abroad",
    intro:
      "Rwanda offers an attractive, transparent financial environment for expats and investors. Here's how to manage money smartly while based in Kigali.",
    sections: [
      {
        heading: "Personal income tax",
        body: "Residents pay 0% on income up to RWF 60,000/month, 20% up to RWF 100,000, and 30% above. Tax residency typically applies after 183 days in-country.",
      },
      {
        heading: "Banking & mobile money",
        body: "MTN MoMo and Airtel Money dominate daily transactions. Most expats hold a USD account alongside RWF for hedging. Wise and Remitly offer competitive international transfers.",
      },
      {
        heading: "Investment opportunities",
        body: "High-growth sectors include real estate (Kigali property yields 8–12%), tourism, agribusiness, ICT, and renewable energy. The Kigali International Financial Centre offers tax incentives for holding companies and funds.",
      },
      {
        heading: "Sending money abroad",
        body: "Up to USD 10,000 per transaction can be sent through commercial banks with documentation. Wise, Remitly, and WorldRemit work both directions. Always keep receipts for tax purposes.",
      },
      {
        heading: "Insurance & retirement",
        body: "RSSB covers locals and registered employees. Expats typically maintain international health insurance (Allianz, Cigna, AXA). We can connect you with vetted local advisors for long-term planning.",
      },
    ],
  },
  {
    slug: "packing-moving",
    icon: Package,
    title: "Packing & Moving Guide",
    tagline: "What to bring, shipping, and moving companies",
    intro:
      "Rwanda has most of what you need — but a few items are worth shipping. Here's our practical packing and shipping playbook.",
    sections: [
      {
        heading: "Bring with you",
        body: "Quality electronics, specialty toiletries, prescription medications (with documentation), favorite spices, and any specific professional gear. Books and decor are easy to ship later.",
      },
      {
        heading: "Buy locally",
        body: "Furniture (excellent local craftsmanship), basic kitchenware, fresh produce, coffee, and clothing for the climate. Kigali's Kimironko Market and Simba Supermarkets cover most needs.",
      },
      {
        heading: "Shipping options",
        body: "Sea freight (8–12 weeks via Mombasa or Dar es Salaam) is most economical for full households. Air freight (1–2 weeks) suits smaller, urgent shipments. Plan for customs duties of 5–35%.",
      },
      {
        heading: "Recommended movers",
        body: "AGS Frasers, Crown Relocations, and Bolloré Logistics all operate in Kigali. We provide vetted introductions and help review quotes for fairness and completeness.",
      },
      {
        heading: "Customs & duties",
        body: "Returning Rwandans and accredited expats may import personal effects duty-free under specific conditions. Vehicles older than 10 years are restricted. We handle all paperwork as part of our relocation packages.",
      },
    ],
  },
];

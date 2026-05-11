import { Briefcase, Users, Globe2, Wallet, Package, MapPin, Plane, HeartPulse, GraduationCap, Home, Bus, Mountain, ShieldCheck, Landmark } from "lucide-react";
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
  {
    slug: "about-rwanda",
    icon: MapPin,
    title: "About Rwanda — Country Overview",
    tagline: "Land of a Thousand Hills at a glance",
    intro:
      "Rwanda is a small, landlocked East African nation known for its dramatic mountain landscapes, remarkable post-genocide transformation, and reputation as one of Africa's safest, cleanest, and most forward-looking countries.",
    sections: [
      {
        heading: "Geography & population",
        body: "Rwanda covers 26,338 km² and is home to roughly 13.8 million people, making it Africa's most densely populated mainland country. It borders Uganda, Tanzania, Burundi, and the DRC. The capital, Kigali, sits in the center of the country at around 1,567m elevation.",
      },
      {
        heading: "Government & stability",
        body: "Rwanda is a presidential republic led by President Paul Kagame. The country is widely recognized for its strong governance, low corruption (consistently top-ranked in Africa by Transparency International), and long-term Vision 2050 development strategy.",
      },
      {
        heading: "Economy",
        body: "GDP is around USD 14 billion with sustained 7–8% annual growth. Key sectors include services, tourism, ICT, agriculture (coffee, tea), construction, and mining. Rwanda is positioning itself as a regional hub for finance, conferences (MICE), and innovation.",
      },
      {
        heading: "Why people are moving here",
        body: "Safety, ease of doing business (World Bank top 2 in Africa), modern infrastructure, English as an official language, fast internet, visa-on-arrival for most nationalities, and a government that actively welcomes investors and skilled professionals.",
      },
    ],
  },
  {
    slug: "rdb",
    icon: Landmark,
    title: "Rwanda Development Board (RDB)",
    tagline: "The one-stop shop for investors and businesses",
    intro:
      "The Rwanda Development Board (RDB) is the government agency responsible for fast-tracking investment, tourism, business registration, and economic development. For anyone moving to Rwanda for business, RDB is your first and most important institutional contact.",
    sections: [
      {
        heading: "What RDB does",
        body: "RDB consolidates the functions of nine former agencies into one — investment promotion, company registration, work permits, tourism & conservation, special economic zones, and skills development. It is the single point of contact for serious investors.",
      },
      {
        heading: "Investment incentives",
        body: "Registered investors can access: 0% corporate income tax for international company HQs, 15% preferential rate for priority sectors (energy, manufacturing, ICT, tourism), VAT exemptions on capital equipment, and accelerated depreciation. Minimum investment thresholds apply.",
      },
      {
        heading: "Company registration",
        body: "Online registration via businessprocedures.rdb.rw takes 6 hours to 2 business days, costs nothing for the basic certificate, and includes your TIN and social security registration in a single application.",
      },
      {
        heading: "Work permits & residency",
        body: "RDB partners with the Directorate General of Immigration & Emigration to issue investor visas, work permits (Class A–H), and residency. Investors meeting RDB thresholds qualify for renewable 5-year permits.",
      },
      {
        heading: "Useful links",
        body: "Official site: rdb.rw • Business registration: businessprocedures.rdb.rw • Visit Rwanda (tourism arm): visitrwanda.com • Irembo (government e-services): irembo.gov.rw",
      },
    ],
  },
  {
    slug: "visa-immigration",
    icon: Plane,
    title: "Visa & Immigration Guide",
    tagline: "Entry, residency, and work permits",
    intro:
      "Rwanda has one of Africa's most open visa regimes. Most travelers can enter visa-free or get a visa on arrival, and pathways to residency are clear and well-documented.",
    sections: [
      {
        heading: "Visa on arrival",
        body: "Citizens of all countries can obtain a 30-day tourist visa on arrival at Kigali International Airport for USD 50. Citizens of the African Union, Commonwealth, and Francophonie countries enter visa-free for up to 30 or 90 days.",
      },
      {
        heading: "East Africa Tourist Visa",
        body: "A USD 100 multiple-entry visa valid 90 days across Rwanda, Kenya, and Uganda. Ideal if you plan regional travel. Apply online via irembo.gov.rw before travel.",
      },
      {
        heading: "Work & residency permits",
        body: "Class T (work permit) requires a sponsoring employer or registered company. Class G (investor) is available to those investing USD 250,000+. Class H (retiree) and Class I (digital nomad / remote worker) options also exist. Permits run 1–5 years and are renewable.",
      },
      {
        heading: "Required documents",
        body: "Valid passport (6+ months), yellow fever certificate, criminal record check (apostilled), academic/professional certificates, and a sponsor letter or RDB investment certificate where applicable.",
      },
      {
        heading: "Processing times",
        body: "Most permits are issued within 10 working days through Irembo. Lauture Global handles the full application end-to-end as part of our exploration and relocation packages.",
      },
    ],
  },
  {
    slug: "healthcare",
    icon: HeartPulse,
    title: "Healthcare in Rwanda",
    tagline: "Hospitals, insurance, and what to expect",
    intro:
      "Rwanda has one of Africa's most respected universal healthcare systems, with rapidly improving private facilities in Kigali serving expats and medical tourists.",
    sections: [
      {
        heading: "Top hospitals & clinics",
        body: "King Faisal Hospital (Kigali's flagship referral hospital), Rwanda Military Hospital, Legacy Clinics, Polyclinic du Plateau, and Baho International Hospital are the go-to facilities for expats. Most have English-speaking staff.",
      },
      {
        heading: "Health insurance",
        body: "Locals use Mutuelle de Santé (community-based, ~USD 8/year) or RSSB. Expats typically maintain international cover (Allianz, Cigna, AXA, IMG) for full evacuation and overseas treatment options. Local private insurance (Radiant, Sanlam, Britam) is also available.",
      },
      {
        heading: "Pharmacies & medication",
        body: "Pharmacies are widespread — Pharmacie Conseil and Pharmacie Continentale have multiple locations. Most common medications are available; bring a 3-month supply and prescription for anything specialized.",
      },
      {
        heading: "Vaccinations & health prep",
        body: "Yellow fever certificate is required for entry. Recommended: Hepatitis A & B, typhoid, rabies, and meningitis. Malaria prophylaxis is advised in lowland areas; Kigali itself is low-risk.",
      },
      {
        heading: "Emergencies",
        body: "Dial 912 for ambulance services. SOS International and AMREF Flying Doctors offer medical evacuation cover — strongly recommended for expats.",
      },
    ],
  },
  {
    slug: "education",
    icon: GraduationCap,
    title: "Education & Schools",
    tagline: "International schools and universities",
    intro:
      "Rwanda offers excellent international schooling options in Kigali, with British, American, French, and IB curricula available. Higher education and professional training are also rapidly expanding.",
    sections: [
      {
        heading: "International schools",
        body: "Green Hills Academy (IB, K–12), International School of Kigali (American curriculum), Kigali International Community School (Christian, US curriculum), École Belge de Kigali (Belgian/French), and Riviera High School (Cambridge IGCSE/A-Levels).",
      },
      {
        heading: "Tuition expectations",
        body: "International school tuition ranges from USD 8,000 to USD 25,000 per year depending on grade and curriculum. Most schools have waitlists — apply 3–6 months in advance.",
      },
      {
        heading: "Universities & higher ed",
        body: "University of Rwanda (largest public), African Leadership University, Carnegie Mellon University Africa (Kigali campus), University of Global Health Equity, and Adventist University of Central Africa.",
      },
      {
        heading: "Languages of instruction",
        body: "English is the primary language of instruction across most schools and universities since 2008. French and Kinyarwanda are also widely taught.",
      },
    ],
  },
  {
    slug: "housing",
    icon: Home,
    title: "Housing & Real Estate",
    tagline: "Where to live in Kigali and what it costs",
    intro:
      "Kigali offers a wide range of housing — from modern apartments to spacious villas — across distinct neighborhoods. The market is competitive but transparent and reasonably priced by global standards.",
    sections: [
      {
        heading: "Top expat neighborhoods",
        body: "Kacyiru (diplomatic area, modern), Nyarutarama (upscale, lake views, golf course), Kimihurura (central, lively, restaurants), Gacuriro (family-friendly, gated estates), and Rebero (hilltop villas, panoramic views).",
      },
      {
        heading: "Rental costs",
        body: "Furnished 2-bed apartment in a prime area: USD 1,200–2,500/month. Family villa with garden: USD 2,500–6,000/month. Most leases are 1 year, paid quarterly or annually in advance, in USD or RWF.",
      },
      {
        heading: "Buying property",
        body: "Foreigners can own land via leasehold (typically 99 years) and freely own buildings. Property prices in prime Kigali range from USD 1,200–2,500/m². Yields on rental property average 8–12%.",
      },
      {
        heading: "Utilities & internet",
        body: "Electricity (REG) ~USD 0.20/kWh, water (WASAC) is inexpensive. Fiber internet (Liquid, MTN, Canal Box) starts at USD 40/month for 50 Mbps. Backup power is recommended; outages are rare but possible.",
      },
      {
        heading: "Finding a home",
        body: "Major portals: Imali.biz, House.rw, and Property24 Rwanda. Trusted agencies handle most quality listings. Lauture Global pre-vets neighborhoods, agents, and contracts for our clients.",
      },
    ],
  },
  {
    slug: "transportation",
    icon: Bus,
    title: "Getting Around",
    tagline: "Transport, driving, and connectivity",
    intro:
      "Kigali is one of the easiest African capitals to navigate — clean, safe roads, organized traffic, and reliable ride-hailing apps make daily life simple.",
    sections: [
      {
        heading: "Ride-hailing & taxis",
        body: "Yego Cabs, Move (by Volkswagen Rwanda), and motorcycle apps SafeMotos and YegoMoto dominate. Standard car ride across town: USD 3–7. Moto rides: USD 1–3. All trackable, metered, and cashless.",
      },
      {
        heading: "Driving in Rwanda",
        body: "Rwanda drives on the right. Roads are well-maintained and traffic is orderly. Foreign licenses are valid for 6 months; after that, convert to a Rwandan license through Irembo. Used cars and SUVs are widely available; Land Cruisers and RAV4s dominate.",
      },
      {
        heading: "Public transport",
        body: "Kigali Bus Services and RFTC operate clean, cashless city buses (tap card system). Kigali International Airport connects to 25+ destinations across Africa, Europe, and Asia, primarily via national carrier RwandAir.",
      },
      {
        heading: "Inter-city & regional",
        body: "Comfortable coach lines (Volcano, Ritco, Horizon Express) run between Kigali and all provincial cities. Cross-border buses link to Kampala, Bujumbura, Goma, and Dar es Salaam.",
      },
    ],
  },
  {
    slug: "tourism",
    icon: Mountain,
    title: "Tourism & Things to Do",
    tagline: "Gorillas, lakes, and unforgettable landscapes",
    intro:
      "Rwanda is a world-class tourism destination — best known for mountain gorilla trekking, but offering lakes, savannah safari, cultural villages, and one of Africa's most exciting culinary scenes.",
    sections: [
      {
        heading: "Volcanoes National Park",
        body: "Home to roughly a third of the world's remaining mountain gorillas. Trekking permits cost USD 1,500 per person. The park also offers golden monkey treks and the Dian Fossey hike.",
      },
      {
        heading: "Akagera National Park",
        body: "Rwanda's Big Five savannah park in the east — lions, rhinos, elephants, leopards, and buffalo. Self-drive and guided safaris available; lodges range from budget to ultra-luxury (Magashi).",
      },
      {
        heading: "Nyungwe Forest",
        body: "Ancient rainforest in the southwest with chimpanzee tracking, a thrilling canopy walkway, and 13 primate species. Pair with a stay at One&Only Nyungwe House.",
      },
      {
        heading: "Lake Kivu",
        body: "One of Africa's Great Lakes — bilharzia-free, hippo- and crocodile-free swimming. Lakeside towns Rubavu (Gisenyi), Karongi (Kibuye), and Rusizi (Cyangugu) offer beach hotels, kayaking, and the Congo Nile Trail.",
      },
      {
        heading: "Kigali itself",
        body: "Visit the Kigali Genocide Memorial (essential and moving), Inema Arts Center, Kimironko Market, Caplaki craft village, and the rooftop bars of Kimihurura. Don't miss a Saturday morning Umuganda or coffee at Question Coffee.",
      },
    ],
  },
  {
    slug: "safety",
    icon: ShieldCheck,
    title: "Safety & Daily Life",
    tagline: "Why Rwanda is one of Africa's safest countries",
    intro:
      "Rwanda consistently ranks among the safest countries in Africa and globally — comfortable for solo travelers, women, and night walks more than most major Western capitals.",
    sections: [
      {
        heading: "Crime levels",
        body: "Violent crime is extremely rare. Petty theft exists in markets and crowded areas but is uncommon. Police presence is visible, professional, and helpful. Emergency number: 112.",
      },
      {
        heading: "Cleanliness & order",
        body: "Plastic bags are banned nationwide. Streets are immaculate thanks to Umuganda (monthly community service). Littering carries fines.",
      },
      {
        heading: "Women & solo travelers",
        body: "Rwanda is widely considered Africa's most comfortable country for solo female travelers. Walking after dark in Kigali is generally safe; standard precautions still apply.",
      },
      {
        heading: "LGBTQ+ context",
        body: "Same-sex relations are legal in Rwanda (one of few African countries). Public displays of affection (any orientation) are uncommon. Discretion is the norm.",
      },
      {
        heading: "Health & environment",
        body: "Tap water is generally not for drinking — bottled or filtered is standard. Altitude (Kigali 1,567m) may cause mild fatigue the first few days. UV is strong year-round.",
      },
    ],
  },
];

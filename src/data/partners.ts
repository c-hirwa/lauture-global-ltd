export interface Partner {
  name: string;
  category: string;
  description: string;
  website?: string;
  image?: string;
}

export interface PartnerGroup {
  group: string;
  items: Partner[];
}

export const partnerGroups: PartnerGroup[] = [
  {
    group: "Preferred Hotels and Lodges (Kigali)",
    items: [
      {
        name: "Kigali Marriott Hotel",
        category: "Hotel",
        description:
          "A landmark 5-star hotel in the heart of Kigali offering world-class hospitality, refined dining, and premium comfort for business and leisure travelers.",
        website: "https://www.marriott.com/en-us/hotels/kglmc-kigali-marriott-hotel/overview/",
        image: "/src/assets/kigali-marriott.jpg",
      },
      {
        name: "Akira Hotel",
        category: "Hotel",
        description:
          "A modern boutique hotel in Kigali known for its warm service, contemporary design, and convenient access to the city's business districts.",
        website: "https://akirahotel.com/",
        image: "/src/assets/akira-hotel.jpg",
      },
      {
        name: "Zaria Court Kigali, Tapestry Collection by Hilton",
        category: "Hotel",
        description:
          "A vibrant lifestyle hotel combining sport, culture, and hospitality — an energetic hub for travelers seeking a distinctly Rwandan experience.",
        website: "https://zariacourt.com/",
        image: "/src/assets/zaria-court.jpg",
      },
    ],
  },
  {
    group: "Preferred Hotels and Lodges (Karongi / Lake Kivu)",
    items: [
      {
        name: "Chateau Le Marara by Royal Retreat",
        category: "Lodge",
        description:
          "An elegant lakeside retreat on the shores of Lake Kivu offering panoramic views, refined interiors, and a serene escape into nature.",
        website: "https://www.marara.rw/",
        image: "/src/assets/chateau-le-marara.jpg",
      },
    ],
  },
  {
    group: "Tourism and Experience Partners",
    items: [
      {
        name: "Love Rwanda",
        category: "Tour Operator",
        description:
          "A trusted tour operator crafting immersive Rwandan experiences — from gorilla trekking to cultural discovery journeys.",
      },
      {
        name: "INAM World",
        category: "Travel Agency",
        description:
          "A full-service travel agency specializing in tailored itineraries, ticketing, and seamless travel logistics across Africa and beyond.",
      },
    ],
  },
  {
    group: "Real Estate and Relocation Partners",
    items: [
      {
        name: "Green Estate Rwanda",
        category: "Real Estate",
        description:
          "A trusted real estate partner helping clients find secure, comfortable homes and investment properties across Rwanda.",
      },
      {
        name: "PIMAR LTD",
        category: "Real Estate",
        description:
          "A professional real estate and property management firm dedicated to smooth relocations and quality housing solutions.",
      },
    ],
  },
  {
    group: "Business and Investment Partners",
    items: [
      {
        name: "Baho Housing Solutions",
        category: "Housing Solutions",
        description:
          "A strategic partner providing innovative housing and accommodation solutions for individuals, families, and businesses relocating to Rwanda.",
      },
      {
        name: "Kama Heritage",
        category: "Investment Partner",
        description:
          "A business and investment partner committed to connecting clients with meaningful opportunities in Rwanda's growing economy.",
      },
    ],
  },
  {
    group: "Culture and Community Partners",
    items: [
      {
        name: "Centre Culturel Ubuntu",
        category: "Cultural Center",
        description:
          "A cultural hub fostering community, creativity, and connection — helping newcomers feel at home through arts, language, and shared experiences.",
      },
      {
        name: "Haitiens Tout Kote",
        category: "Community Partner",
        description:
          "A vibrant community partner bringing people together through cultural events, social networks, and support systems for newcomers in Rwanda.",
      },
    ],
  },
];

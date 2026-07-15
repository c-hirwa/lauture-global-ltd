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
    group: "Kigali",
    items: [
      {
        name: "Kigali Marriott Hotel",
        category: "Hotel",
        description:
          "A landmark 5-star hotel in the heart of Kigali offering world-class hospitality, refined dining, and premium comfort for business and leisure travelers.",
        website: "https://www.marriott.com/en-us/hotels/kglmc-kigali-marriott-hotel/overview/",
        image: "/src/assets/placeholder-kigali-marriott.jpg",
      },
      {
        name: "Akira Hotel",
        category: "Hotel",
        description:
          "A modern boutique hotel in Kigali known for its warm service, contemporary design, and convenient access to the city's business districts.",
        website: "https://akirahotel.com/",
        image: "/src/assets/placeholder-akira-hotel.jpg",
      },
      {
        name: "Zaria Court Hotel",
        category: "Hotel",
        description:
          "A vibrant lifestyle hotel combining sport, culture, and hospitality — an energetic hub for travelers seeking a distinctly Rwandan experience.",
        website: "https://zariacourt.com/",
        image: "/src/assets/placeholder-zaria-court.jpg",
      },
    ],
  },
  {
    group: "Kibuye (Karongi)",
    items: [
      {
        name: "Chateau Le Marara",
        category: "Lodge",
        description:
          "An elegant lakeside retreat on the shores of Lake Kivu offering panoramic views, refined interiors, and a serene escape into nature.",
        website: "https://www.marara.rw/",
        image: "/src/assets/placeholder-chateau-le-marara.jpg",
      },
      {
        name: "Umurobyi Lodge",
        category: "Lodge",
        description:
          "A tranquil lakeside lodge inspired by Rwandan fishing heritage, offering cozy accommodations and authentic local charm.",
        image: "/src/assets/placeholder-umurobyi-lodge.jpg",
      },
    ],
  },
  {
    group: "Gisenyi (Rubavu)",
    items: [
      {
        name: "Musanto Hotel",
        category: "Hotel",
        description:
          "A modern hotel near the shores of Lake Kivu offering comfortable rooms, quality dining, and easy access to Gisenyi's best attractions.",
        image: "/src/assets/placeholder-musanto-hotel.jpg",
      },
      {
        name: "Araucaria Residence",
        category: "Residence",
        description:
          "A peaceful residence blending comfort and privacy — ideal for travelers seeking a home-away-from-home experience in Rubavu.",
        image: "/src/assets/placeholder-araucaria-residence.jpg",
      },
      {
        name: "Tam Tam Restaurant",
        category: "Restaurant",
        description:
          "A beloved lakeside restaurant in Gisenyi serving fresh, flavorful dishes with stunning views of Lake Kivu.",
        image: "/src/assets/placeholder-tam-tam.jpg",
      },
    ],
  },
  {
    group: "Tourism and Travel Partners",
    items: [
      {
        name: "Love Rwanda",
        category: "Tour Operator",
        description:
          "A trusted tour operator crafting immersive Rwandan experiences — from gorilla trekking to cultural discovery journeys.",
        image: "/src/assets/placeholder-love-rwanda.jpg",
      },
      {
        name: "INAM World",
        category: "Travel Agency",
        description:
          "A full-service travel agency specializing in tailored itineraries, ticketing, and seamless travel logistics across Africa and beyond.",
        image: "/src/assets/placeholder-inam-world.jpg",
      },
      {
        name: "Safaris Car Sharing",
        category: "Car Sharing",
        description:
          "A reliable mobility partner offering flexible car sharing and rental solutions for exploring Rwanda with ease and confidence.",
        image: "/src/assets/placeholder-safaris-car-sharing.jpg",
      },
    ],
  },
];

export interface Partner {
  name: string;
  category: string;
  description: string;
  website?: string;
  image?: string;
}
import kigaliMarriott from '../assets/kigali-marriott.jpg'
import akiraHotel from '../assets/akira-hotel.jpg'
import zariaCourt from '../assets/zaria-court.jpg'
import chateauLeMarara from '../assets/chateau-le-marara.jpg'
import araucaria from '../assets/araucaria-residence.jpg'
import musanto from '../assets/musanto-hotel.jpg'
import lovaRwanda from '../assets/LoveRwanda.jpeg'
import greenEstate from '../assets/greenEstate.jpeg'

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
        image: kigaliMarriott,
      },
      {
        name: "Four Points by Sheraton Kigali",
        category: "Hotel",
        description:
          "A contemporary hotel in Kigali blending comfort and style with reliable service, modern amenities, and a welcoming atmosphere for every traveler.",
        website: "https://www.marriott.com/en-us/hotels/kglfp-four-points-kigali/overview/",
      },
      {
        name: "Akira Hotel",
        category: "Hotel",
        description:
          "A modern boutique hotel in Kigali known for its warm service, contemporary design, and convenient access to the city's business districts.",
        website: "https://akirahotel.com/",
        image: akiraHotel,
      },
      {
        name: "Zaria Court Kigali, Tapestry Collection by Hilton",
        category: "Hotel",
        description:
          "A vibrant lifestyle hotel combining sport, culture, and hospitality — an energetic hub for travelers seeking a distinctly Rwandan experience.",
        website: "https://zariacourt.com/",
        image: zariaCourt,
      },
    ],
  },
  {
    group: "Preferred Hotels and Lodges (Bugesera)",
    items: [
      {
        name: "Bugesera Lodge",
        category: "Lodge",
        description:
          "A serene lodge retreat in Bugesera offering a peaceful escape surrounded by nature, ideal for travelers seeking relaxation and authentic Rwandan scenery.",
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
        image: chateauLeMarara,
      },
    ],
  },
  {
    group: "Preferred Hotels and Lodges (Gisenyi / Rubavu)",
    items: [
      {
        name: "Araucaria Residence",
        category: "Hospitality",
        description:
          "A comfortable, well-appointed residence in Gisenyi offering a relaxed home-away-from-home base near the shores of Lake Kivu.",
          image: araucaria,
      },
      {
        name: "Musanto Hotel - Gisenyi",
        category: "Hotel",
        description:
          "A welcoming Gisenyi hotel combining warm Rwandan hospitality with easy access to Lake Kivu's beaches, dining, and border crossings.",
          image: musanto,
      },
    ],
  },
  {
    group: "Preferred Hotels and Lodges (Uganda)",
    items: [
      {
        name: "Nyamunyonyi Lake Resort",
        category: "Resort",
        description:
          "A tranquil lakeside resort in Uganda offering comfortable accommodation, scenic views, and a relaxing base for cross-border exploration and leisure.",
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
          image: lovaRwanda,
      },
      {
        name: "Nziza Adventures",
        category: "Tour Agency",
        description:
          "An adventure-focused tour agency curating guided treks, safaris, and off-the-beaten-path journeys across Rwanda's landscapes.",
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
          image: greenEstate,
      },
      {
        name: "FunLife Properties Kenya",
        category: "Real Estate",
        description:
          "A regional property partner in Kenya offering cross-border real estate and investment opportunities for East Africa-bound clients.",
      },
      {
        name: "The Oak Residences",
        category: "Real Estate",
        description:
          "A premium real estate partner in Kenya delivering elegant residential and investment properties for clients seeking quality homes in East Africa.",
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

const avatarImages = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=160&q=80",
];

const places = [
  {
    id: "khai-island",
    title: "Khai Island Beach",
    location: "Chang Wat Phang-nga",
    country: "Thailand",
    category: "Beach",
    description:
      "A bright island escape with turquoise water, soft sand, easy snorkeling, and peaceful beach cafes for slow afternoons.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
    ],
    price: 80,
    rating: 4.9,
    reviews: 280,
    peopleJoined: 50,
    isPopular: true,
  },
  {
    id: "niladri-reservoir",
    title: "Niladri Reservoir",
    location: "Tekergat, Sunamganj",
    country: "Bangladesh",
    category: "Waterfall",
    description:
      "Blue water framed by hills and quiet villages, perfect for boating, photography, and a calm day outside the city.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=400&q=80",
    ],
    price: 459,
    rating: 4.8,
    reviews: 176,
    peopleJoined: 24,
    isPopular: true,
  },
  {
    id: "casa-las-tortugas",
    title: "Casa Las Tortugas",
    location: "Av. Damero, Holbox",
    country: "Mexico",
    category: "Resort",
    description:
      "A colorful seaside hideaway with breezy rooms, fresh seafood, and island streets made for walking at sunset.",
    image:
      "https://images.unsplash.com/photo-1512100356356-de1b84283e18?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=400&q=80",
    ],
    price: 894,
    rating: 4.7,
    reviews: 198,
    peopleJoined: 31,
    isPopular: true,
  },
  {
    id: "hisma-desert",
    title: "Hisma Desert",
    location: "NEOM",
    country: "Saudi Arabia",
    category: "Desert",
    description:
      "Red sand, sandstone formations, and enormous open skies make this desert route feel cinematic from sunrise to stars.",
    image:
      "https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1547234935-80c7145ec969?auto=format&fit=crop&w=400&q=80",
    ],
    price: 681,
    rating: 4.9,
    reviews: 142,
    peopleJoined: 18,
    isPopular: true,
  },
  {
    id: "rain-vortex",
    title: "HSBC Rain Vortex",
    location: "Jewel Changi Airport",
    country: "Singapore",
    category: "City",
    description:
      "A dramatic indoor waterfall surrounded by lush gardens, food halls, elevated walkways, and glowing night shows.",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1496939376851-89342e90adcd?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=400&q=80",
    ],
    price: 924,
    rating: 4.8,
    reviews: 310,
    peopleJoined: 42,
    isPopular: true,
  },
  {
    id: "siargao-island",
    title: "Siargao Island",
    location: "Surigao del Norte",
    country: "Philippines",
    category: "Beach",
    description:
      "Palm roads, lagoon tours, surf breaks, and small local cafes make Siargao a warm island base for explorers.",
    image:
      "https://images.unsplash.com/photo-1537956965359-7573183d1f57?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
    ],
    price: 977,
    rating: 4.5,
    reviews: 121,
    peopleJoined: 27,
    isPopular: false,
  },
  {
    id: "ban-gioc",
    title: "Ban Gioc Waterfall",
    location: "Cao Bang",
    country: "Vietnam",
    category: "Waterfall",
    description:
      "Layered limestone falls, emerald rice fields, and mountain roads turn this borderland into a memorable northern route.",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=400&q=80",
    ],
    price: 389,
    rating: 4.7,
    reviews: 96,
    peopleJoined: 22,
    isPopular: false,
  },
  {
    id: "ha-long-bay",
    title: "Ha Long Bay",
    location: "Quang Ninh",
    country: "Vietnam",
    category: "Mountain",
    description:
      "Limestone towers, overnight cruises, caves, and calm morning water make Ha Long Bay a classic scenic journey.",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=400&q=80",
    ],
    price: 512,
    rating: 4.6,
    reviews: 204,
    peopleJoined: 36,
    isPopular: true,
  },
];

const tripPackages = [
  {
    id: "package-niladri",
    placeId: "niladri-reservoir",
    title: "Niladri Reservoir",
    image: places[1].image,
    startDate: "16 July",
    endDate: "28 July",
    price: 789,
    rating: 4.8,
    joined: 24,
  },
  {
    id: "package-casa",
    placeId: "casa-las-tortugas",
    title: "Casa Las Tortugas",
    image: places[2].image,
    startDate: "08 August",
    endDate: "16 August",
    price: 849,
    rating: 4.7,
    joined: 18,
  },
  {
    id: "package-rain-vortex",
    placeId: "rain-vortex",
    title: "Singapore City Lights",
    image: places[4].image,
    startDate: "04 Sept",
    endDate: "10 Sept",
    price: 699,
    rating: 4.8,
    joined: 35,
  },
  {
    id: "package-siargao",
    placeId: "siargao-island",
    title: "Siargao Island Escape",
    image: places[5].image,
    startDate: "12 Sept",
    endDate: "21 Sept",
    price: 929,
    rating: 4.5,
    joined: 20,
  },
];

const scheduleItems = [
  {
    id: "schedule-hisma",
    placeId: "hisma-desert",
    title: "Hisma Desert",
    image: places[3].image,
    date: "23 January 2026",
    location: "NEOM, Saudi Arabia",
  },
  {
    id: "schedule-vortex",
    placeId: "rain-vortex",
    title: "HSBC Rain Vortex",
    image: places[4].image,
    date: "31 January 2026",
    location: "Jewel Changi, Singapore",
  },
  {
    id: "schedule-siargao",
    placeId: "siargao-island",
    title: "Siargao Island",
    image: places[5].image,
    date: "29 February 2026",
    location: "Siargao, Philippines",
  },
];

const notifications = [
  {
    id: "notification-1",
    title: "Super Offer",
    description: "Get 60% off on our first booking",
    time: "Sun, 12:40pm",
    avatar: avatarImages[0],
    status: "recent",
  },
  {
    id: "notification-2",
    title: "Super Offer",
    description: "Get 60% off on our first booking",
    time: "Mon, 11:50pm",
    avatar: avatarImages[1],
    status: "earlier",
  },
  {
    id: "notification-3",
    title: "Super Offer",
    description: "Get 60% off on our first booking",
    time: "Tue, 10:50pm",
    avatar: avatarImages[2],
    status: "archived",
  },
];

const onboardingSlides = [
  {
    id: "onboarding-1",
    titleKey: "onboarding1Title",
    descriptionKey: "onboarding1Description",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "onboarding-2",
    titleKey: "onboarding2Title",
    descriptionKey: "onboarding2Description",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "onboarding-3",
    titleKey: "onboarding3Title",
    descriptionKey: "onboarding3Description",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  },
];

const aiChatStarterMessages = [
  {
    id: "ai-welcome",
    role: "assistant",
    text: "Hi, I am your Travel Explorer AI. Ask me for trip ideas, budgets, packing tips, or a quick itinerary.",
    time: "Now",
  },
];

const users = [
  {
    id: "user-demo",
    name: "Imane fh",
    firstName: "fh",
    lastName: "imane",
    email: "imanefh28@gmail.com",
    password: "travelapp",
    avatar: avatarImages[0],
    location: "Algeria",
    mobileNumber: "+213 7653247990",
    isEmailVerified: true,
    emailVerifiedAt: "2026-01-01T00:00:00.000Z",
    rewardPoints: 50,
    travelTrips: 40,
    bucketList: 200,
    favoritePlaceIds: ["niladri-reservoir", "casa-las-tortugas"],
  },
];

module.exports = {
  aiChatStarterMessages,
  avatarImages,
  notifications,
  onboardingSlides,
  places,
  scheduleItems,
  tripPackages,
  users,
};

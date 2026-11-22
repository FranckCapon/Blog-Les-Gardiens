// Informations du club, reprises de l'ancien site (FRONT/src/components).
export const club = {
  name: "Les Gardiens de la Légende",
  shortName: "Les Gardiens",
  tagline: "Club de jeux à Avrillé depuis 1987",
  foundedIn: 1987,
  email: "contact@lesgardiensdelalegende.fr",
  address: {
    street: "62 allée des Châtaigniers",
    postalCode: "49240",
    city: "Avrillé",
  },
  // Coordonnées du local, pour la carte de la page Contact.
  geo: { lat: 47.488206, lng: -0.5919 },
  mjc: { name: "MJC d'Avrillé", url: "https://www.mjc-avrille.asso.fr/" },
  openingHours: [
    { day: "Mardi", hours: "20 h 30 – minuit" },
    { day: "Vendredi", hours: "21 h – 1 h" },
    { day: "Samedi", hours: "14 h – 1 h" },
  ],
  activities: [
    {
      name: "Jeux de rôle",
      description: "Campagnes et one-shots, du médiéval fantastique à l'horreur.",
    },
    { name: "Grandeur nature", description: "Des aventures en costume, à vivre en vrai." },
    { name: "Jeux de plateau", description: "Classiques, nouveautés et gros jeux experts." },
    {
      name: "Jeux de cartes",
      description: "Jeux à collectionner, deckbuilding et jeux d'ambiance.",
    },
    { name: "Jeux de figurines", description: "Peinture, armées et batailles sur table." },
    { name: "Jeux vidéo", description: "Parties en réseau et soirées entre joueurs." },
  ],
} as const;

export const mainNav = [
  { href: "/les-gardiens", label: "Le club" },
  { href: "/jeux", label: "Nos jeux" },
  { href: "/evenements", label: "Événements" },
  { href: "/articles", label: "Articles" },
  { href: "/contact", label: "Contact" },
] as const;

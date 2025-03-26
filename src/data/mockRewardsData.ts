
import { UserReward, Badge, Challenge, LeaderboardUser, CollectiveImpact } from "@/types/rewards";

// Mock data for user rewards
export const mockUserRewards: UserReward = {
  ecoPoints: 745,
  currentLevel: {
    level: 2,
    title: "Cycliste Conscient",
    minPoints: 500,
    maxPoints: 1499,
    icon: "🚲"
  },
  nextLevel: {
    level: 3,
    title: "Aventurier Vert",
    minPoints: 1500,
    maxPoints: 2999,
    icon: "🌳"
  },
  progressToNextLevel: 25,
  badges: [
    {
      id: "badge1",
      title: "Premier Trajet",
      description: "Complétez votre premier trajet écologique",
      icon: "🚲",
      category: "debutant",
      condition: "Effectuer un premier trajet avec l'application",
      obtained: true,
      unlockedAt: "15 juin 2023"
    },
    {
      id: "badge2",
      title: "Semaine Verte",
      description: "Effectuez au moins un trajet écologique chaque jour pendant une semaine",
      icon: "🌱",
      category: "debutant",
      condition: "Trajets consécutifs pendant 7 jours",
      obtained: true,
      unlockedAt: "22 juin 2023"
    },
    {
      id: "badge3",
      title: "Économiseur de CO₂",
      description: "Épargnez l'équivalent de 10 kg de CO₂",
      icon: "🍃",
      category: "debutant",
      condition: "Économiser 10 kg de CO₂",
      obtained: true,
      unlockedAt: "1 juillet 2023"
    },
    {
      id: "badge4",
      title: "Premier Mois",
      description: "Utilisez l'application régulièrement pendant un mois",
      icon: "📅",
      category: "debutant",
      condition: "30 jours d'utilisation régulière",
      obtained: true,
      unlockedAt: "10 juillet 2023"
    },
    {
      id: "badge5",
      title: "Explorateur Urbain",
      description: "Découvrez 10 nouveaux itinéraires",
      icon: "🧭",
      category: "intermediaire",
      condition: "10 itinéraires différents empruntés",
      obtained: false,
      progress: 70
    },
    {
      id: "badge6",
      title: "Marathon Écologique",
      description: "Parcourez 100 km en mobilité douce",
      icon: "🏃",
      category: "intermediaire",
      condition: "100 km parcourus au total",
      obtained: false,
      progress: 80
    },
    {
      id: "badge7",
      title: "Arbre Virtuel",
      description: "Économisez l'équivalent d'un arbre en CO₂",
      icon: "🌳",
      category: "intermediaire",
      condition: "Économiser 25 kg de CO₂",
      obtained: true,
      unlockedAt: "12 juillet 2023"
    },
    {
      id: "badge8",
      title: "Météo Difficile",
      description: "Effectuez un trajet écologique malgré une météo défavorable",
      icon: "⛈️",
      category: "intermediaire",
      condition: "Trajet par mauvais temps",
      obtained: false,
      progress: 0
    },
    {
      id: "badge9",
      title: "Ambassadeur Eco",
      description: "Partagez l'application avec 5 amis qui l'utilisent",
      icon: "🤝",
      category: "intermediaire",
      condition: "5 amis parrainés actifs",
      obtained: false,
      progress: 40
    },
    {
      id: "badge10",
      title: "Eco-Warrior",
      description: "Économisez 100 kg de CO₂",
      icon: "🛡️",
      category: "expert",
      condition: "100 kg de CO₂ économisés",
      obtained: false,
      progress: 42
    },
    {
      id: "badge11",
      title: "Route Légendaire",
      description: "Parcourez 500 km en mobilité douce",
      icon: "🏆",
      category: "expert",
      condition: "500 km parcourus au total",
      obtained: false,
      progress: 20
    },
    {
      id: "badge12",
      title: "Sauveur de Planète",
      description: "Économisez l'équivalent de 10 arbres en CO₂",
      icon: "🌍",
      category: "expert",
      condition: "Économiser 250 kg de CO₂",
      obtained: false,
      progress: 15
    },
    {
      id: "badge13",
      title: "Fidélité Exemplaire",
      description: "Utilisez l'application pendant 6 mois consécutifs",
      icon: "⭐",
      category: "expert",
      condition: "6 mois d'utilisation régulière",
      obtained: false,
      progress: 30
    },
    {
      id: "badge14",
      title: "Premier de la Classe",
      description: "Atteignez le top 10 du classement",
      icon: "🥇",
      category: "special",
      condition: "Entrer dans le top 10 du classement général",
      obtained: false,
      progress: 0
    },
    {
      id: "badge15",
      title: "Événement Spécial",
      description: "Participez à un événement écologique communautaire",
      icon: "🎪",
      category: "special",
      condition: "Participer à un événement organisé",
      obtained: false,
      progress: 0
    }
  ],
  availableTitles: [
    "Débutant Écolo",
    "Cycliste Conscient",
    "Aventurier Vert",
    "Champion Durable",
    "Maître Écologique",
    "Sauveur de CO₂",
    "Explorateur Urbain",
    "Ambassadeur Planète",
    "Éco-Héros",
    "Protecteur de l'Air"
  ],
  selectedTitle: "Cycliste Conscient",
  availableAvatars: [
    "Avatar Standard",
    "Éco Guerrier",
    "Cycliste Pro",
    "Défenseur Vert",
    "Champion Nature",
    "Protecteur Urbain",
    "Éco Voyageur",
    "Guide Écolo",
    "Expert Planète",
    "Maître Mobilité"
  ],
  selectedAvatar: "Cycliste Pro",
  availableThemes: [
    "Éco Standard",
    "Bleu Océan",
    "Soleil Couchant",
    "Forêt Profonde",
    "Aurore Boréale"
  ],
  selectedTheme: "Éco Standard"
};

// Mock data for challenges
export const mockChallenges: Challenge[] = [
  {
    id: "challenge1",
    title: "Premier pas écologique",
    description: "Effectuez votre premier trajet de la journée",
    type: "daily",
    points: 10,
    progress: 1,
    goal: 1,
    deadline: "Aujourd'hui",
    completed: true,
    icon: "🚶"
  },
  {
    id: "challenge2",
    title: "Double trajet",
    description: "Réalisez deux trajets écologiques aujourd'hui",
    type: "daily",
    points: 15,
    progress: 1,
    goal: 2,
    deadline: "Aujourd'hui",
    completed: false,
    icon: "🔄"
  },
  {
    id: "challenge3",
    title: "Triathlon urbain",
    description: "Utilisez trois modes de transport écologiques différents cette semaine",
    type: "weekly",
    points: 50,
    progress: 2,
    goal: 3,
    deadline: "Dimanche",
    completed: false,
    icon: "🏆"
  },
  {
    id: "challenge4",
    title: "Habitué de la semaine",
    description: "Effectuez au moins un trajet écologique chaque jour de la semaine",
    type: "weekly",
    points: 70,
    progress: 4,
    goal: 7,
    deadline: "Dimanche",
    completed: false,
    icon: "📆"
  },
  {
    id: "challenge5",
    title: "Économiseur CO₂",
    description: "Économisez 5 kg de CO₂ cette semaine",
    type: "weekly",
    points: 60,
    progress: 3.2,
    goal: 5,
    deadline: "Dimanche",
    completed: false,
    icon: "🌬️"
  },
  {
    id: "challenge6",
    title: "Marathonien écologique",
    description: "Parcourez 100 km en mobilité douce ce mois-ci",
    type: "monthly",
    points: 150,
    progress: 42,
    goal: 100,
    deadline: "31 juillet",
    completed: false,
    icon: "🏃"
  },
  {
    id: "challenge7",
    title: "Forêt virtuelle",
    description: "Économisez l'équivalent d'un arbre en CO₂ ce mois-ci",
    type: "monthly",
    points: 200,
    progress: 10,
    goal: 25,
    deadline: "31 juillet",
    completed: false,
    icon: "🌳"
  },
  {
    id: "challenge8",
    title: "Défi communauté",
    description: "Participez au défi commun : 10 000 km collectifs",
    type: "special",
    points: 100,
    progress: 128,
    goal: 200,
    completed: false,
    icon: "🌍"
  },
  {
    id: "challenge9",
    title: "Événement estival",
    description: "Participez à l'événement 'Été Vert' en ville",
    type: "special",
    points: 120,
    progress: 0,
    goal: 1,
    deadline: "15 août",
    completed: false,
    icon: "☀️"
  }
];

// Mock data for leaderboard
export const mockLeaderboard: LeaderboardUser[] = [
  {
    id: "user1",
    name: "Émilie Dupont",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Émilie",
    level: 5,
    points: 3245,
    isFriend: true,
    rank: 1
  },
  {
    id: "user2",
    name: "Lucas Martin",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Lucas",
    level: 4,
    points: 2980,
    isFriend: false,
    rank: 2
  },
  {
    id: "user3",
    name: "Sophie Bernard",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Sophie",
    level: 4,
    points: 2745,
    isFriend: true,
    rank: 3
  },
  {
    id: "current",
    name: "Thomas Dubois",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Thomas",
    level: 2,
    points: 745,
    isFriend: false,
    rank: 12
  },
  {
    id: "user4",
    name: "Julie Petit",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Julie",
    level: 3,
    points: 1845,
    isFriend: true,
    rank: 4
  },
  {
    id: "user5",
    name: "Antoine Leroy",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Antoine",
    level: 3,
    points: 1720,
    isFriend: false,
    rank: 5
  },
  {
    id: "user6",
    name: "Claire Moreau",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Claire",
    level: 3,
    points: 1650,
    isFriend: false,
    rank: 6
  },
  {
    id: "user7",
    name: "Hugo Robert",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Hugo",
    level: 3,
    points: 1590,
    isFriend: true,
    rank: 7
  },
  {
    id: "user8",
    name: "Léa Fournier",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Léa",
    level: 3,
    points: 1480,
    isFriend: false,
    rank: 8
  },
  {
    id: "user9",
    name: "Maxime Girard",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Maxime",
    level: 2,
    points: 1320,
    isFriend: false,
    rank: 9
  },
  {
    id: "user10",
    name: "Camille Dubois",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Camille",
    level: 2,
    points: 1180,
    isFriend: true,
    rank: 10
  }
];

// Mock data for collective impact
export const mockCollectiveImpact: CollectiveImpact = {
  co2Saved: 42500, // 42.5 tonnes
  treesEquivalent: 1700,
  distanceCovered: 425000, // 425k km
  participatingUsers: 15400,
  tripsCompleted: 128500
};

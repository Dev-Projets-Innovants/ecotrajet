
export interface TutorialVideo {
  id: string;
  title: string;
  description: string;
  author: string;
  likes: number;
  comments: number;
  shares: number;
  views: string;
  thumbnailUrl: string;
  videoUrl: string;
  steps: string[];
}

export const tutorialVideos: TutorialVideo[] = [
  {
    id: '1',
    title: 'Comment débloquer un Velib\'',
    description: 'Découvrez comment débloquer facilement un Velib\' avec l\'application EcoTrajet en quelques étapes simples.',
    author: 'EcoTrajet Officiel',
    likes: 1240,
    comments: 56,
    shares: 28,
    views: '24.5K',
    thumbnailUrl: 'https://images.unsplash.com/photo-1626053560166-08b1be41e507?q=80&w=1970&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    steps: [
      "Ouvrez l'application ÉcoTrajet sur votre téléphone",
      "Scannez le QR code sur le vélo ou entrez son numéro",
      "Confirmez votre sélection et attendez le déverrouillage",
      "Le vélo est prêt à être utilisé quand vous entendez un bip"
    ]
  },
  {
    id: '2',
    title: 'Les meilleures pistes cyclables de Paris',
    description: 'Top 5 des itinéraires les plus agréables pour se déplacer en Velib\' dans Paris tout en profitant du paysage.',
    author: 'Paris à Vélo',
    likes: 856,
    comments: 42,
    shares: 19,
    views: '18.9K',
    thumbnailUrl: 'https://images.unsplash.com/photo-1482029255085-35a4a48b7084?q=80&w=1974&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    steps: [
      "Piste cyclable des Berges de Seine",
      "Canal Saint-Martin",
      "Coulée Verte René-Dumont",
      "Avenue de Breteuil",
      "Promenade Plantée"
    ]
  },
  {
    id: '3',
    title: 'Régler correctement la hauteur de selle',
    description: 'Un réglage correct de la hauteur de selle est essentiel pour une expérience de cyclisme confortable et efficace.',
    author: 'Vélo Ergonomie',
    likes: 723,
    comments: 31,
    shares: 15,
    views: '12.3K',
    thumbnailUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2070&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    steps: [
      "Positionnez le vélo contre un mur ou sur un support",
      "Asseyez-vous sur la selle et placez un talon sur la pédale",
      "Ajustez la hauteur pour que votre jambe soit tendue",
      "Vérifiez que vos pieds touchent confortablement le sol"
    ]
  },
  {
    id: '4',
    title: 'Sécurité à vélo en ville',
    description: 'Conseils essentiels pour rouler en toute sécurité dans le trafic urbain et éviter les accidents.',
    author: 'Sécurité Cycliste',
    likes: 1567,
    comments: 89,
    shares: 45,
    views: '32.1K',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=2022&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    steps: [
      "Portez toujours un casque homologué",
      "Respectez le code de la route et la signalisation",
      "Rendez-vous visible avec des vêtements clairs et réfléchissants",
      "Signalez vos intentions avec des gestes de la main",
      "Maintenez une distance de sécurité avec les véhicules"
    ]
  },
  {
    id: '5',
    title: 'Comment utiliser l\'application ÉcoTrajet',
    description: 'Guide complet pour maîtriser toutes les fonctionnalités de l\'application ÉcoTrajet et optimiser vos trajets.',
    author: 'ÉcoTrajet Officiel',
    likes: 932,
    comments: 47,
    shares: 36,
    views: '19.8K',
    thumbnailUrl: 'https://images.unsplash.com/photo-1617886322168-72b886573c5f?q=80&w=1974&auto=format&fit=crop',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    steps: [
      "Téléchargez et installez l'application depuis l'App Store ou Google Play",
      "Créez un compte ou connectez-vous",
      "Configurez vos préférences de trajet et de transport",
      "Utilisez la carte pour trouver les stations à proximité",
      "Suivez vos statistiques d'utilisation et votre impact écologique"
    ]
  },
];

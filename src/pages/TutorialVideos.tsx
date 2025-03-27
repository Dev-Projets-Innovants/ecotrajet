
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Share2, 
  BookmarkPlus, 
  Play, 
  Volume2, 
  VolumeX,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon
} from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { 
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineTitle,
  TimelineBody
} from '@/components/timeline';
import { cn } from '@/lib/utils';

// Mock data for tutorial videos
const videos = [
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

const VideoCard = ({ video, onNext }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);
  
  const toggleLike = () => setLiked(!liked);
  const toggleBookmark = () => setBookmarked(!bookmarked);
  const toggleMute = () => setMuted(!muted);
  
  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  return (
    <Card className="w-full border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">{video.title}</CardTitle>
        <CardDescription className="text-base">
          {video.author} • {video.views} vues
        </CardDescription>
      </CardHeader>
      
      <div className="relative aspect-video bg-black rounded-md overflow-hidden mx-4 flex items-center justify-center" 
           aria-label={`Vidéo: ${video.title}`}>
        {/* For demo purposes, using iframe instead of video element */}
        <iframe 
          src={`${video.videoUrl}?autoplay=0&mute=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          title={video.title}
        ></iframe>
        
        {/* Overlay for play/pause control */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
          aria-label={playing ? "Pause la vidéo" : "Jouer la vidéo"}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              togglePlay();
            }
          }}
        >
          {!playing && (
            <div className="bg-black bg-opacity-50 rounded-full p-4">
              <Play className="h-12 w-12 text-white" aria-hidden="true" />
            </div>
          )}
        </div>
        
        {/* Video controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
          <div className="flex justify-between items-center">
            <button 
              onClick={toggleMute} 
              className="bg-gray-800 rounded-full p-2"
              aria-label={muted ? "Activer le son" : "Couper le son"}
            >
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-2">Description:</h3>
        <p className="text-gray-700 mb-4">{video.description}</p>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Étapes à suivre:</h3>
          <Timeline>
            {video.steps.map((step, index) => (
              <TimelineItem key={index}>
                {index < video.steps.length - 1 && <TimelineConnector />}
                <TimelineHeader>
                  <TimelineIcon>
                    <span className="text-xs">{index + 1}</span>
                  </TimelineIcon>
                  <TimelineTitle>{step}</TimelineTitle>
                </TimelineHeader>
                <TimelineBody>
                  <p className="text-sm text-gray-500"></p>
                </TimelineBody>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex space-x-4">
          <button 
            onClick={toggleLike}
            className={`flex items-center ${liked ? 'text-red-500' : 'text-gray-600'}`}
            aria-label={liked ? "Retirer le j'aime" : "J'aime"}
          >
            <Heart className={`h-6 w-6 ${liked ? 'fill-current' : ''}`} />
            <span className="ml-1 text-base">{liked ? video.likes + 1 : video.likes}</span>
          </button>
          <button className="flex items-center text-gray-600" aria-label="Commenter">
            <MessageCircle className="h-6 w-6" />
            <span className="ml-1 text-base">{video.comments}</span>
          </button>
        </div>
        <div className="flex space-x-4">
          <button className="flex items-center text-gray-600" aria-label="Partager">
            <Share2 className="h-6 w-6" />
            <span className="ml-1 text-base">{video.shares}</span>
          </button>
          <button 
            onClick={toggleBookmark}
            className={`flex items-center ${bookmarked ? 'text-eco-green' : 'text-gray-600'}`}
            aria-label={bookmarked ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <BookmarkPlus className={`h-6 w-6 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </CardFooter>
      
      {/* Next button to simulate swiping */}
      <div className="pb-4 flex justify-center">
        <Button 
          className="bg-eco-green hover:bg-eco-dark-green text-white text-base py-6"
          onClick={onNext}
          aria-label="Voir le prochain tutoriel"
        >
          Voir le prochain tutoriel
        </Button>
      </div>
    </Card>
  );
};

const TutorialVideos = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [fontSize, setFontSize] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const scrollContainerRef = useRef(null);

  const handleNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      setCurrentVideoIndex(0); // Loop back to the first video
    }
  };

  const increaseFontSize = () => {
    if (fontSize < 1.5) {
      setFontSize(fontSize + 0.1);
    }
  };

  const decreaseFontSize = () => {
    if (fontSize > 0.8) {
      setFontSize(fontSize - 0.1);
    }
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  useEffect(() => {
    // Scroll to the current video when index changes
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({
        top: currentVideoIndex * container.clientHeight,
        behavior: 'smooth'
      });
    }

    // Announce to screen readers that the content has changed
    const announcement = document.getElementById('video-announcement');
    if (announcement) {
      announcement.textContent = `Tutoriel chargé: ${videos[currentVideoIndex].title}`;
    }
  }, [currentVideoIndex]);

  return (
    <Layout title="Tutoriels ÉcoTrajet">
      {/* Accessibility announcement for screen readers */}
      <div 
        id="video-announcement" 
        className="sr-only" 
        aria-live="polite" 
        role="status"
      ></div>

      <main className={cn(
        "flex-grow pt-20 pb-8 px-4",
        highContrast ? "bg-black text-white" : "bg-white text-gray-900"
      )} style={{ fontSize: `${fontSize}rem` }}>
        <div className="container mx-auto max-w-7xl">
          <div className="mb-6 flex justify-between items-center">
            <Link to="/guide" className={cn(
              "inline-flex items-center text-base font-medium",
              highContrast ? "text-yellow-400 hover:text-yellow-300" : "text-eco-green hover:text-eco-dark-green"
            )}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au Guide
            </Link>
            <h1 className="text-2xl font-bold text-center">Tutoriels ÉcoTrajet</h1>
            
            {/* Accessibility controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={decreaseFontSize}
                aria-label="Réduire la taille du texte"
                className={highContrast ? "bg-yellow-400 text-black border-yellow-400" : ""}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={increaseFontSize}
                aria-label="Augmenter la taille du texte"
                className={highContrast ? "bg-yellow-400 text-black border-yellow-400" : ""}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleHighContrast}
                aria-label={highContrast ? "Désactiver le mode contraste élevé" : "Activer le mode contraste élevé"}
                className={highContrast ? "bg-yellow-400 text-black border-yellow-400" : ""}
              >
                {highContrast ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar with video list */}
            <div className="md:w-1/4 w-full">
              <Card className={cn(
                "shadow-md",
                highContrast ? "bg-gray-900 border-yellow-400" : "bg-white"
              )}>
                <CardHeader>
                  <CardTitle className="text-xl">Tous les tutoriels</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3" role="list" aria-label="Liste des tutoriels">
                    {videos.map((video, index) => (
                      <li key={video.id}>
                        <button 
                          className={cn(
                            "flex items-start w-full p-3 rounded-lg text-left transition-colors",
                            index === currentVideoIndex 
                              ? (highContrast ? "bg-yellow-500 text-black" : "bg-eco-light-green") 
                              : (highContrast ? "hover:bg-gray-800" : "hover:bg-gray-50")
                          )}
                          onClick={() => setCurrentVideoIndex(index)}
                          aria-current={index === currentVideoIndex ? "true" : "false"}
                        >
                          <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden mr-3">
                            <img 
                              src={video.thumbnailUrl} 
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                              <Play className="h-6 w-6 text-white" aria-hidden="true" />
                            </div>
                          </div>
                          <div className="flex-grow">
                            <h3 className="font-medium text-base line-clamp-2">{video.title}</h3>
                            <p className={cn(
                              "text-sm",
                              highContrast ? "text-gray-300" : "text-gray-500"
                            )}>{video.views} vues</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            {/* Main video display area */}
            <div className="md:w-3/4 w-full">
              <ScrollArea 
                ref={scrollContainerRef} 
                className={cn(
                  "h-[calc(100vh-220px)]",
                  highContrast ? "bg-gray-900" : "bg-white"
                )}
              >
                <div className="snap-y snap-mandatory h-full">
                  {videos.map((video, index) => (
                    <div 
                      key={video.id} 
                      className="snap-start h-full w-full py-6 px-4"
                      role="tabpanel"
                      id={`video-panel-${video.id}`}
                      aria-labelledby={`video-tab-${video.id}`}
                      hidden={index !== currentVideoIndex}
                    >
                      {index === currentVideoIndex && (
                        <VideoCard 
                          video={video} 
                          onNext={handleNextVideo}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default TutorialVideos;


import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2, BookmarkPlus, Play, Volume2, VolumeX } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <div className="video-card flex flex-col h-full w-full max-w-2xl mx-auto relative">
      <div className="relative aspect-[9/16] bg-black rounded-xl overflow-hidden flex items-center justify-center">
        {/* For demo purposes, using iframe instead of video element */}
        <iframe 
          src={`${video.videoUrl}?autoplay=0&mute=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        ></iframe>
        
        {/* Overlay for play/pause control */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          {!playing && (
            <div className="bg-black bg-opacity-50 rounded-full p-4">
              <Play className="h-12 w-12 text-white" />
            </div>
          )}
        </div>
        
        {/* Video controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
              <p className="text-sm text-gray-300">{video.author} • {video.views} vues</p>
            </div>
            <button onClick={toggleMute} className="bg-gray-800 rounded-full p-2">
              {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Video description */}
      <div className="p-4">
        <p className="text-gray-700 mb-4">{video.description}</p>
        
        {/* Interaction buttons */}
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <button 
              onClick={toggleLike}
              className={`flex items-center ${liked ? 'text-red-500' : 'text-gray-600'}`}
            >
              <Heart className={`h-6 w-6 ${liked ? 'fill-current' : ''}`} />
              <span className="ml-1">{liked ? video.likes + 1 : video.likes}</span>
            </button>
            <button className="flex items-center text-gray-600">
              <MessageCircle className="h-6 w-6" />
              <span className="ml-1">{video.comments}</span>
            </button>
          </div>
          <div className="flex space-x-4">
            <button className="flex items-center text-gray-600">
              <Share2 className="h-6 w-6" />
              <span className="ml-1">{video.shares}</span>
            </button>
            <button 
              onClick={toggleBookmark}
              className={`flex items-center ${bookmarked ? 'text-eco-green' : 'text-gray-600'}`}
            >
              <BookmarkPlus className={`h-6 w-6 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Next button to simulate swiping */}
      <div className="mt-auto pb-4 flex justify-center">
        <Button 
          className="bg-eco-green hover:bg-eco-dark-green text-white"
          onClick={onNext}
        >
          Voir le prochain tutoriel
        </Button>
      </div>
    </div>
  );
};

const TutorialVideos = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      setCurrentVideoIndex(0); // Loop back to the first video
    }
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
  }, [currentVideoIndex]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-6 flex justify-between items-center">
            <Link to="/guide" className="inline-flex items-center text-eco-green hover:text-eco-dark-green">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au Guide
            </Link>
            <h1 className="text-2xl font-bold text-center">Tutoriels ÉcoTrajet</h1>
            <div className="w-24"></div> {/* Empty div for spacing */}
          </div>
          
          <div className="flex md:flex-row flex-col gap-6">
            {/* Sidebar with video list */}
            <div className="md:w-1/4 w-full">
              <div className="bg-white rounded-xl shadow-md p-4">
                <h2 className="font-semibold text-lg mb-4">Tous les tutoriels</h2>
                <ul className="space-y-3">
                  {videos.map((video, index) => (
                    <li key={video.id}>
                      <button 
                        className={`flex items-start w-full p-2 rounded-lg text-left hover:bg-gray-50 transition-colors ${index === currentVideoIndex ? 'bg-eco-light-green' : ''}`}
                        onClick={() => setCurrentVideoIndex(index)}
                      >
                        <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden mr-2">
                          <img 
                            src={video.thumbnailUrl} 
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                          <p className="text-xs text-gray-500">{video.views} vues</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Main video display area */}
            <div className="md:w-3/4 w-full">
              <div className="bg-white rounded-xl shadow-md overflow-hidden h-[calc(100vh-220px)]">
                <ScrollArea ref={scrollContainerRef} className="h-full">
                  <div className="snap-y snap-mandatory h-full">
                    {videos.map((video, index) => (
                      <div 
                        key={video.id} 
                        className="snap-start h-full w-full py-6 px-4"
                      >
                        <VideoCard 
                          video={video} 
                          onNext={handleNextVideo}
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TutorialVideos;

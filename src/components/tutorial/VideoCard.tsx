
import React, { useRef, useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  BookmarkPlus, 
  Play, 
  Volume2, 
  VolumeX
} from 'lucide-react';
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
import { TutorialVideo } from '@/data/tutorialVideosData';

interface VideoCardProps {
  video: TutorialVideo;
  onNext: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onNext }) => {
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
        <iframe 
          src={`${video.videoUrl}?autoplay=0&mute=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          title={video.title}
        ></iframe>
        
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

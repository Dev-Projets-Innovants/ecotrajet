
import React from 'react';
import { Play } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TutorialVideo } from '@/data/tutorialVideosData';

interface TutorialSidebarProps {
  videos: TutorialVideo[];
  currentVideoIndex: number;
  highContrast: boolean;
  onVideoSelect: (index: number) => void;
}

export const TutorialSidebar: React.FC<TutorialSidebarProps> = ({
  videos,
  currentVideoIndex,
  highContrast,
  onVideoSelect
}) => {
  return (
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
                  onClick={() => onVideoSelect(index)}
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
  );
};

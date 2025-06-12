
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { tutorialVideos } from '@/data/tutorialVideosData';
import { VideoCard } from '@/components/tutorial/VideoCard';
import { AccessibilityControls } from '@/components/tutorial/AccessibilityControls';
import { TutorialSidebar } from '@/components/tutorial/TutorialSidebar';

const TutorialVideos = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [fontSize, setFontSize] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const scrollContainerRef = useRef(null);

  const handleNextVideo = () => {
    if (currentVideoIndex < tutorialVideos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    } else {
      setCurrentVideoIndex(0);
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
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTo({
        top: currentVideoIndex * container.clientHeight,
        behavior: 'smooth'
      });
    }

    const announcement = document.getElementById('video-announcement');
    if (announcement) {
      announcement.textContent = `Tutoriel chargé: ${tutorialVideos[currentVideoIndex].title}`;
    }
  }, [currentVideoIndex]);

  return (
    <Layout title="Tutoriels ÉcoTrajet">
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
            
            <AccessibilityControls
              fontSize={fontSize}
              highContrast={highContrast}
              onIncreaseFontSize={increaseFontSize}
              onDecreaseFontSize={decreaseFontSize}
              onToggleHighContrast={toggleHighContrast}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <TutorialSidebar
              videos={tutorialVideos}
              currentVideoIndex={currentVideoIndex}
              highContrast={highContrast}
              onVideoSelect={setCurrentVideoIndex}
            />
            
            <div className="md:w-3/4 w-full">
              <ScrollArea 
                ref={scrollContainerRef} 
                className={cn(
                  "h-[calc(100vh-220px)]",
                  highContrast ? "bg-gray-900" : "bg-white"
                )}
              >
                <div className="snap-y snap-mandatory h-full">
                  {tutorialVideos.map((video, index) => (
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

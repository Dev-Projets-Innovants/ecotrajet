
import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Autoplay vidéo quand le composant est monté
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Lecture automatique de la vidéo impossible:", error);
      });
    }
  }, []);

  const scrollToContent = () => {
    const contentSection = document.getElementById('features');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16 pb-20 overflow-hidden">
      {/* Vidéo en arrière-plan */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <video
          ref={videoRef}
          className="absolute w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/video-poster.jpg"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-9561-large.mp4" type="video/mp4" />
          Votre navigateur ne prend pas en charge la lecture de vidéos.
        </video>
      </div>
      
      {/* Overlay gradients animés pour ajouter de la profondeur */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <motion.div 
          className="absolute top-1/4 left-1/3 w-64 h-64 bg-eco-light-green rounded-full mix-blend-overlay filter blur-3xl opacity-20"
          animate={{ 
            y: [0, -20, 0], 
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        ></motion.div>
        <motion.div 
          className="absolute top-1/2 right-1/4 w-72 h-72 bg-eco-light-blue rounded-full mix-blend-overlay filter blur-3xl opacity-20"
          animate={{ 
            y: [0, 20, 0], 
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        ></motion.div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-eco-green/20 text-white border border-eco-green/30 backdrop-blur-sm mb-4 shadow-lg">
              Mobilité durable
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6 text-white drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Paris plus vert, <span className="relative inline-block">
              <span className="relative z-10 text-eco-green">trajet</span>
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-3 bg-eco-light-green/40 rounded-lg -z-0"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 1 }}
              ></motion.span>
            </span> après <span className="relative inline-block">
              <span className="relative z-10 text-eco-green">trajet</span>
              <motion.span 
                className="absolute bottom-0 left-0 w-full h-3 bg-eco-light-green/40 rounded-lg -z-0"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 1.3 }}
              ></motion.span>
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-white mb-10 leading-relaxed text-balance drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            ÉcoTrajet vous aide à réduire votre empreinte carbone en choisissant les options de transport les plus écologiques pour vos déplacements quotidiens à Paris.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Button 
                className="group rounded-full px-6 py-6 h-12 w-full sm:w-auto bg-eco-green hover:bg-eco-dark-green text-white shadow-lg transition-all duration-300 flex items-center justify-center space-x-2 backdrop-blur-sm"
                asChild
              >
                <Link to="/signup">
                  <span>Commencer maintenant</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight size={18} />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto"
            >
              <Button 
                variant="outline" 
                className="rounded-full px-6 py-6 h-12 w-full sm:w-auto border-eco-green text-white hover:bg-eco-light-green/20 hover:text-white transition-all duration-300 backdrop-blur-sm"
                onClick={scrollToContent}
              >
                En savoir plus
              </Button>
            </motion.div>
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { delay: 1.5, duration: 0.7 },
            y: { delay: 1.5, duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
          onClick={scrollToContent}
        >
          <ChevronDown className="text-white w-8 h-8 drop-shadow-md" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

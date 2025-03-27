
import React, { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, Bike, Bus, Car, TramFront } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';

const Hero = () => {
  const isMobile = useIsMobile();

  const scrollToContent = () => {
    const contentSection = document.getElementById('features');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-16 pb-20 overflow-hidden">
      {/* Animated background with sustainable mobility elements */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-gradient-to-b from-eco-light-blue/40 to-eco-light-green/50">
        <div className="absolute inset-0 bg-black/5 z-10"></div>
        
        {/* Animated mobility icons - augmenté l'opacité */}
        <motion.div 
          className="absolute top-1/4 left-1/4 text-eco-green opacity-30"
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear" 
          }}
        >
          <Bike size={isMobile ? 80 : 120} strokeWidth={1.5} />
        </motion.div>
        
        <motion.div 
          className="absolute bottom-1/3 right-1/4 text-eco-blue opacity-30"
          animate={{ 
            x: [0, -120, 0], 
            y: [0, 60, 0],
            rotate: [0, -8, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
        >
          <Bus size={isMobile ? 100 : 150} strokeWidth={1.5} />
        </motion.div>
        
        <motion.div 
          className="absolute top-2/3 left-1/3 text-eco-light-green opacity-30"
          animate={{ 
            x: [0, 80, 0], 
            y: [0, 40, 0],
            rotate: [0, 12, 0]
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            ease: "linear",
            delay: 5
          }}
        >
          <TramFront size={isMobile ? 90 : 130} strokeWidth={1.5} />
        </motion.div>
        
        <motion.div 
          className="absolute top-1/2 right-1/3 text-eco-green opacity-30"
          animate={{ 
            x: [0, -60, 0], 
            y: [0, -70, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 22,
            repeat: Infinity,
            ease: "linear",
            delay: 8
          }}
        >
          <Car size={isMobile ? 80 : 110} strokeWidth={1.5} />
        </motion.div>
        
        {/* Eiffel Tower silhouette - augmenté l'opacité */}
        <motion.div 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-96 opacity-25"
          animate={{ 
            y: [5, 0, 5], 
            opacity: [0.20, 0.30, 0.20]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path fill="currentColor" className="text-eco-dark-green" d="M50,0 L60,100 L70,100 L75,150 L80,150 L85,180 L15,180 L20,150 L25,150 L30,100 L40,100 Z M40,180 L60,180 L58,200 L42,200 Z" />
          </svg>
        </motion.div>
      </div>
      
      {/* Overlay gradients animés pour ajouter de la profondeur */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <motion.div 
          className="absolute top-1/4 left-1/3 w-64 h-64 bg-eco-light-green rounded-full mix-blend-overlay filter blur-3xl opacity-40"
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
          className="absolute top-1/2 right-1/4 w-72 h-72 bg-eco-light-blue rounded-full mix-blend-overlay filter blur-3xl opacity-40"
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
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-eco-green/30 text-white border border-eco-green/40 backdrop-blur-sm mb-4 shadow-lg">
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
            className="flex justify-center items-center"
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

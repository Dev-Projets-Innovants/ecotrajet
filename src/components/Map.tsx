
import React, { useEffect, useRef } from 'react';

const MapPreview = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);

  // Simulated data for Vélib stations
  const stations = [
    { id: 1, name: 'Station Hôtel de Ville', lat: 48.857, lng: 2.351, bikes: 8 },
    { id: 2, name: 'Station République', lat: 48.867, lng: 2.363, bikes: 12 },
    { id: 3, name: 'Station Bastille', lat: 48.853, lng: 2.369, bikes: 5 },
    { id: 4, name: 'Station Châtelet', lat: 48.858, lng: 2.348, bikes: 10 },
    { id: 5, name: 'Station Saint-Lazare', lat: 48.875, lng: 2.325, bikes: 7 },
  ];

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      root: null,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    if (mapRef.current) observer.observe(mapRef.current);
    if (animationRef.current) observer.observe(animationRef.current);

    return () => {
      if (mapRef.current) observer.unobserve(mapRef.current);
      if (animationRef.current) observer.unobserve(animationRef.current);
    };
  }, []);

  return (
    <section id="map" className="py-20 bg-white relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-eco-light-green text-eco-green text-sm font-medium mb-4">
            Carte Interactive
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Trouvez facilement les options écologiques</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Localisez en temps réel les stations Vélib', les bornes de recharge électrique et planifiez vos trajets écologiques.
          </p>
        </div>
        
        <div 
          ref={mapRef}
          className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl animate-on-scroll bg-eco-light-blue"
        >
          {/* Simulated Map UI */}
          <div className="absolute inset-0 bg-eco-light-blue overflow-hidden">
            {/* Map grid lines */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}></div>
            
            {/* Decorative elements */}
            <div className="absolute left-1/4 top-1/4 w-24 h-24 rounded-full bg-eco-light-green opacity-40"></div>
            <div className="absolute right-1/3 bottom-1/3 w-32 h-32 rounded-full bg-eco-light-green opacity-30"></div>
            
            {/* Simulated stations */}
            {stations.map((station) => (
              <div 
                key={station.id}
                className="absolute w-10 h-10 glass-card rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110"
                style={{
                  left: `${((station.lng - 2.32) / 0.06) * 100}%`,
                  top: `${((station.lat - 48.85) / 0.05) * 100}%`,
                  animation: `pulse-gentle ${2 + (station.id % 3)}s infinite`,
                  animationDelay: `${station.id * 0.2}s`
                }}
                title={`${station.name} - ${station.bikes} vélos disponibles`}
              >
                <span className="bg-eco-green text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {station.bikes}
                </span>
              </div>
            ))}
            
            {/* Map overlay gradient */}
            <div className="absolute inset-0 map-overlay pointer-events-none"></div>
            
            {/* Map UI elements */}
            <div className="absolute top-4 right-4 glass-card rounded-lg p-2 text-sm">
              <div className="flex items-center space-x-2 font-medium">
                <span className="w-3 h-3 bg-eco-green rounded-full"></span>
                <span>Vélib disponibles</span>
              </div>
              <div className="flex items-center space-x-2 mt-1 font-medium">
                <span className="w-3 h-3 bg-eco-blue rounded-full"></span>
                <span>Bornes de recharge</span>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 glass-card rounded-lg p-3 text-sm">
              <div className="flex items-center space-x-4">
                <button className="w-8 h-8 rounded-full glass-card flex items-center justify-center">+</button>
                <button className="w-8 h-8 rounded-full glass-card flex items-center justify-center">-</button>
              </div>
            </div>
          </div>
        </div>
        
        <div 
          ref={animationRef}
          className="text-center mt-8 animate-on-scroll"
        >
          <p className="text-sm text-gray-500">
            Ceci est une prévisualisation simplifiée. Inscrivez-vous pour accéder à la carte interactive complète.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MapPreview;

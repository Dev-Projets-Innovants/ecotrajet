
import React from 'react';
import Map from '@/components/Map';

const MapPlaceholder = () => {
  return (
    <section id="map" className="py-16 md:py-20 bg-white relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        {/* En-tête de la section carte */}
        <div className="text-center mb-10 md:mb-16">
          {/* Badge de catégorie */}
          <div className="inline-block px-3 py-1 rounded-full bg-eco-light-green text-eco-green text-sm font-medium mb-4">
            Carte Interactive
          </div>
          
          {/* Titre principal de la section */}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">Trouvez facilement les options écologiques</h2>
          
          {/* Description de la fonctionnalité de carte */}
          <p className="text-gray-600 max-w-2xl mx-auto px-2">
            Localisez en temps réel les stations Vélib', les bornes de recharge électrique et planifiez vos trajets écologiques.
          </p>
        </div>
        
        {/* Conteneur de la carte avec aspect ratio préservé */}
        <div className="w-full max-w-7xl mx-auto">
          <div className="relative aspect-video rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-2xl mb-8 md:mb-10">
            {/* Intégration du composant Map */}
            <Map />
          </div>
        </div>
        
        {/* Note informative sous la carte */}
        <div className="text-center">
          <p className="text-xs md:text-sm text-gray-500 px-2">
            Notre carte interactive utilise les données des transports en commun pour vous offrir l'expérience la plus complète possible.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MapPlaceholder;


/**
 * Composant MapPlaceholder
 * 
 * Ce composant affiche une section de la page d'accueil présentant la carte interactive
 * de l'application. Il sert d'aperçu visuel et d'introduction à la fonctionnalité
 * de cartographie des stations Vélib' et autres options de mobilité écologique.
 * 
 * Caractéristiques:
 * - Intégration du composant Map dans une présentation attractive
 * - Design responsive avec gestion des espacements
 * - Présentation textuelle décrivant les fonctionnalités de la carte
 * - Utilisation de badges et indicateurs visuels
 */

import React from 'react';
import Map from '@/components/Map';

const MapPlaceholder = () => {
  return (
    <section id="map" className="py-20 bg-white relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        {/* En-tête de la section carte */}
        <div className="text-center mb-16">
          {/* Badge de catégorie */}
          <div className="inline-block px-3 py-1 rounded-full bg-eco-light-green text-eco-green text-sm font-medium mb-4">
            Carte Interactive
          </div>
          
          {/* Titre principal de la section */}
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Trouvez facilement les options écologiques</h2>
          
          {/* Description de la fonctionnalité de carte */}
          <p className="text-gray-600 max-w-2xl mx-auto">
            Localisez en temps réel les stations Vélib', les bornes de recharge électrique et planifiez vos trajets écologiques.
          </p>
        </div>
        
        {/* Conteneur de la carte avec aspect ratio préservé */}
        <div className="w-full max-w-7xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl mb-10">
            {/* Intégration du composant Map */}
            <Map />
          </div>
        </div>
        
        {/* Note informative sous la carte */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Notre carte interactive utilise les données des transports en commun pour vous offrir l'expérience la plus complète possible.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MapPlaceholder;

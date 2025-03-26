
import React from 'react';
import { Bike, Zap, Route, Car, MapPin, Leaf } from 'lucide-react';
import MapFeatureCard from './MapFeatureCard';

const MapFeatures = () => {
  const features = [
    {
      icon: Bike,
      title: "Vélos et trottinettes",
      description: "Stations de vélos en libre-service, zones de stationnement des trottinettes."
    },
    {
      icon: Zap,
      title: "Recharge électrique",
      description: "Bornes de recharge pour véhicules électriques, temps d'attente estimés."
    },
    {
      icon: Route,
      title: "Itinéraires verts",
      description: "Pistes cyclables, chemins piétons, voies réservées aux transports en commun."
    },
    {
      icon: Car,
      title: "Covoiturage et autopartage",
      description: "Points de rendez-vous covoiturage, stations d'autopartage, véhicules disponibles."
    },
    {
      icon: MapPin,
      title: "Points d'intérêt écologiques",
      description: "Espaces verts, marchés bio, commerces responsables, initiatives locales."
    },
    {
      icon: Leaf,
      title: "Impact environnemental",
      description: "Visualisez l'impact CO2 des différents modes de transport et options d'itinéraire."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {features.map((feature, index) => (
        <MapFeatureCard 
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
};

export default MapFeatures;

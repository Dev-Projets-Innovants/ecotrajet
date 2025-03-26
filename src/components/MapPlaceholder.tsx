
import React from 'react';
import { MapPin, Bike, Zap, Route, Car, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MapPlaceholder = () => {
  return (
    <section id="map" className="py-20 bg-white relative overflow-hidden">
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-eco-light-green text-eco-green text-sm font-medium mb-4">
            Carte Interactive
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Trouvez facilement les options écologiques</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez une expérience de navigation écologique avec notre carte interactive. Planifiez des trajets optimisés et découvrez les options de transport les plus respectueuses de l'environnement.
          </p>
        </div>
        
        <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl mb-10 bg-eco-light-blue">
          {/* Placeholder for the Google Maps integration */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-eco-green text-xl font-medium mb-3">Carte interactive en développement</div>
            <div className="text-gray-600 max-w-md text-center mb-6">
              Bientôt, vous pourrez explorer les options de transports écologiques en temps réel.
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl px-4">
              {/* Feature previews */}
              <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                <Bike className="h-8 w-8 text-eco-green mb-2" />
                <span className="text-sm font-medium">Vélos en libre-service</span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                <Zap className="h-8 w-8 text-eco-green mb-2" />
                <span className="text-sm font-medium">Bornes de recharge</span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                <Route className="h-8 w-8 text-eco-green mb-2" />
                <span className="text-sm font-medium">Trajets optimisés</span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                <Car className="h-8 w-8 text-eco-green mb-2" />
                <span className="text-sm font-medium">Covoiturage</span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                <MapPin className="h-8 w-8 text-eco-green mb-2" />
                <span className="text-sm font-medium">Points d'intérêt verts</span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                <Leaf className="h-8 w-8 text-eco-green mb-2" />
                <span className="text-sm font-medium">Impact environnemental</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">Planifiez votre trajet écologique</h3>
            <p className="text-gray-600 mb-4">
              Comparez facilement les options de transport et choisissez celle qui a le plus faible impact environnemental.
            </p>
            <Button variant="outline" className="bg-eco-light-green text-eco-green border-eco-green hover:bg-eco-green hover:text-white">
              Bientôt disponible
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">Trouvez des services à proximité</h3>
            <p className="text-gray-600 mb-4">
              Localisez les stations de vélos, bornes de recharge et initiatives écologiques autour de vous.
            </p>
            <Button variant="outline" className="bg-eco-light-green text-eco-green border-eco-green hover:bg-eco-green hover:text-white">
              Bientôt disponible
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-3">Gagnez des points éco</h3>
            <p className="text-gray-600 mb-4">
              Chaque trajet écologique vous rapporte des points convertibles en réductions chez nos partenaires.
            </p>
            <Button variant="outline" className="bg-eco-light-green text-eco-green border-eco-green hover:bg-eco-green hover:text-white">
              Bientôt disponible
            </Button>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Notre carte interactive utilisera l'API Google Maps, les données des transports en commun, et bien plus pour vous offrir l'expérience la plus complète possible.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MapPlaceholder;

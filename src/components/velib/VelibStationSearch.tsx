
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Bike, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { VelibStationWithAvailability } from '@/services/supabaseVelibService';

interface VelibStationSearchProps {
  stations: VelibStationWithAvailability[];
  onStationSelect: (station: VelibStationWithAvailability) => void;
  selectedStation?: VelibStationWithAvailability | null;
}

const VelibStationSearch = ({ stations, onStationSelect, selectedStation }: VelibStationSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStations, setFilteredStations] = useState<VelibStationWithAvailability[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = stations.filter(station =>
        station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        station.nom_arrondissement_communes?.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 10); // Limiter à 10 résultats
      
      setFilteredStations(filtered);
      setShowResults(true);
    } else {
      setFilteredStations([]);
      setShowResults(false);
    }
  }, [searchTerm, stations]);

  const handleStationClick = (station: VelibStationWithAvailability) => {
    onStationSelect(station);
    setSearchTerm(station.name);
    setShowResults(false);
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio > 0.6) return 'text-green-600';
    if (ratio > 0.3) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="relative mb-4 z-50">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher une station Vélib' (ex: République, Châtelet...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2"
        />
      </div>

      {showResults && filteredStations.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-[9999] mt-1 max-h-96 overflow-y-auto shadow-xl border border-gray-200 bg-white">
          <CardContent className="p-0">
            {filteredStations.map((station) => (
              <Button
                key={station.stationcode}
                variant="ghost"
                className="w-full p-4 justify-start text-left h-auto hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                onClick={() => handleStationClick(station)}
              >
                <div className="flex items-start w-full space-x-3">
                  <MapPin className="h-4 w-4 text-eco-green mt-1 flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {station.name}
                    </div>
                    
                    {station.nom_arrondissement_communes && (
                      <div className="text-xs text-gray-500 mb-2">
                        {station.nom_arrondissement_communes}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <Bike className="h-3 w-3 text-eco-green" />
                        <span className={getAvailabilityColor(station.numbikesavailable || 0, station.capacity)}>
                          {station.numbikesavailable || 0} vélos
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-eco-blue"></div>
                        <span className="text-gray-600">
                          {station.ebike || 0} électriques
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        <span className="text-gray-600">
                          {station.numdocksavailable || 0} places
                        </span>
                      </div>
                    </div>
                    
                    {station.last_updated && (
                      <div className="flex items-center space-x-1 text-xs text-gray-400 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>MAJ: {new Date(station.last_updated).toLocaleTimeString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      {showResults && filteredStations.length === 0 && searchTerm.length >= 2 && (
        <Card className="absolute top-full left-0 right-0 z-[9999] mt-1 shadow-xl border border-gray-200 bg-white">
          <CardContent className="p-4 text-center text-gray-500">
            <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>Aucune station trouvée pour "{searchTerm}"</p>
            <p className="text-xs mt-1">Essayez avec un nom de rue, quartier ou arrondissement</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VelibStationSearch;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Locate, Info } from 'lucide-react';
import MapSearchBar from './MapSearchBar';
import MapFilterMenu from './MapFilterMenu';

const MapControls = () => {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <MapSearchBar />
      <MapFilterMenu />
      <Button variant="outline" className="flex items-center gap-2">
        <Locate className="h-4 w-4" />
        <span>Ma position</span>
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <Info className="h-4 w-4" />
        <span>Légende</span>
      </Button>
    </div>
  );
};

export default MapControls;

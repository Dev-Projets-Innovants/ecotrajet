
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface VelibStationHeaderProps {
  stationName: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const VelibStationHeader: React.FC<VelibStationHeaderProps> = ({
  stationName,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
      <CardTitle className="text-lg font-semibold">{stationName}</CardTitle>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleFavorite}
        className={isFavorite ? 'text-red-500' : 'text-gray-400'}
      >
        <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
      </Button>
    </CardHeader>
  );
};

export default VelibStationHeader;


import React from 'react';
import { Bike, ParkingCircle, Zap } from 'lucide-react';

interface VelibStationAvailabilityProps {
  numbikesavailable: number;
  ebike: number;
  numdocksavailable: number;
  capacity: number;
}

const VelibStationAvailability: React.FC<VelibStationAvailabilityProps> = ({
  numbikesavailable,
  ebike,
  numdocksavailable,
  capacity
}) => {
  const getStatusColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio > 0.6) return 'text-green-600';
    if (ratio > 0.3) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-3 gap-3 text-sm">
      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
        <Bike className={`h-5 w-5 mb-1 ${getStatusColor(numbikesavailable || 0, capacity)}`} />
        <span className="font-medium">{numbikesavailable || 0}</span>
        <span className="text-xs text-gray-500">Vélos</span>
      </div>
      
      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
        <Zap className={`h-5 w-5 mb-1 ${getStatusColor(ebike || 0, numbikesavailable || 0)}`} />
        <span className="font-medium">{ebike || 0}</span>
        <span className="text-xs text-gray-500">Électriques</span>
      </div>
      
      <div className="flex flex-col items-center p-2 bg-gray-50 rounded-lg">
        <ParkingCircle className={`h-5 w-5 mb-1 ${getStatusColor(numdocksavailable || 0, capacity)}`} />
        <span className="font-medium">{numdocksavailable || 0}</span>
        <span className="text-xs text-gray-500">Places</span>
      </div>
    </div>
  );
};

export default VelibStationAvailability;

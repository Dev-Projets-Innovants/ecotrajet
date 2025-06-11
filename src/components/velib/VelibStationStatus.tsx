
import React from 'react';

interface VelibStationStatusProps {
  is_installed: boolean;
}

const VelibStationStatus: React.FC<VelibStationStatusProps> = ({ is_installed }) => {
  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${is_installed ? 'bg-green-500' : 'bg-red-500'}`} />
      <span>
        {is_installed ? 'Station active' : 'Station hors service'}
      </span>
    </div>
  );
};

export default VelibStationStatus;

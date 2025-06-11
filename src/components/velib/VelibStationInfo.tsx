
import React from 'react';

interface VelibStationInfoProps {
  mechanical: number;
  capacity: number;
  nom_arrondissement_communes?: string | null;
  last_updated?: string;
}

const VelibStationInfo: React.FC<VelibStationInfoProps> = ({
  mechanical,
  capacity,
  nom_arrondissement_communes,
  last_updated
}) => {
  return (
    <div className="text-xs text-gray-500 space-y-1">
      <div>Vélos mécaniques: {mechanical || 0}</div>
      <div>Capacité totale: {capacity} emplacements</div>
      {nom_arrondissement_communes && (
        <div>Secteur: {nom_arrondissement_communes}</div>
      )}
      {last_updated && (
        <div>Mis à jour: {new Date(last_updated).toLocaleTimeString()}</div>
      )}
    </div>
  );
};

export default VelibStationInfo;

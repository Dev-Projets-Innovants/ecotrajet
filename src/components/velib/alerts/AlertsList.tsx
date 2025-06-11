
import React from 'react';
import { UserAlert } from '@/services/supabaseVelibService';
import AlertCard from './AlertCard';
import EmptyAlertsState from './EmptyAlertsState';

interface AlertsListProps {
  alerts: UserAlert[];
  isLoading: boolean;
  onDeleteAlert: (alertId: string) => void;
}

const AlertsList: React.FC<AlertsListProps> = ({ alerts, isLoading, onDeleteAlert }) => {
  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'bikes_available': return 'Vélos disponibles';
      case 'docks_available': return 'Places libres';
      case 'ebikes_available': return 'Vélos électriques';
      case 'mechanical_bikes': return 'Vélos mécaniques';
      default: return type;
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'bikes_available': return 'bg-green-100 text-green-800';
      case 'docks_available': return 'bg-blue-100 text-blue-800';
      case 'ebikes_available': return 'bg-purple-100 text-purple-800';
      case 'mechanical_bikes': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyLabel = (frequency?: string) => {
    switch (frequency) {
      case 'immediate': return 'Immédiat';
      case 'hourly': return 'Toutes les heures';
      case 'daily': return 'Une fois par jour';
      default: return 'Immédiat';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Chargement de vos alertes...</div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return <EmptyAlertsState />;
  }

  return (
    <div className="grid gap-4">
      {alerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          onDelete={onDeleteAlert}
          getAlertTypeLabel={getAlertTypeLabel}
          getAlertTypeColor={getAlertTypeColor}
          getFrequencyLabel={getFrequencyLabel}
        />
      ))}
    </div>
  );
};

export default AlertsList;


import React from 'react';

interface ExperienceStatsCardsProps {
  stats: {
    total: number;
    approved: number;
    pending: number;
  };
}

const ExperienceStatsCards: React.FC<ExperienceStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-sm font-medium text-gray-500">Total</h3>
        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-sm font-medium text-gray-500">Approuvées</h3>
        <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-sm font-medium text-gray-500">En attente</h3>
        <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
      </div>
    </div>
  );
};

export default ExperienceStatsCards;

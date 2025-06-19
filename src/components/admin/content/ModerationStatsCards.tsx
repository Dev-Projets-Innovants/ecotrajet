
import React from 'react';
import { MessageSquare, FileText } from 'lucide-react';

interface ModerationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface ModerationStatsCardsProps {
  stats: ModerationStats;
  activeTab: string;
}

const ModerationStatsCards: React.FC<ModerationStatsCardsProps> = ({
  stats,
  activeTab
}) => {
  const getItemLabel = () => activeTab === 'posts' ? 'Posts' : 'Commentaires';

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total {getItemLabel()}</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <FileText className="h-8 w-8 text-blue-500" />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">En attente</p>
            <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
          </div>
          <MessageSquare className="h-8 w-8 text-amber-500" />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Approuvés</p>
            <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <MessageSquare className="h-8 w-8 text-green-500" />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rejetés</p>
            <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
          </div>
          <MessageSquare className="h-8 w-8 text-red-500" />
        </div>
      </div>
    </div>
  );
};

export default ModerationStatsCards;

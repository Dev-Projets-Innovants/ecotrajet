
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PendingItemsAlertProps {
  pendingCount: number;
  postsPendingCount: number;
  commentsPendingCount: number;
}

const PendingItemsAlert: React.FC<PendingItemsAlertProps> = ({
  pendingCount,
  postsPendingCount,
  commentsPendingCount
}) => {
  if (pendingCount === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center space-x-3">
      <AlertCircle className="h-5 w-5 text-amber-600" />
      <div className="flex-1">
        <p className="text-amber-800 font-medium">
          {pendingCount} élément{pendingCount > 1 ? 's' : ''} en attente de modération
        </p>
        <p className="text-amber-700 text-sm">
          {postsPendingCount} post{postsPendingCount > 1 ? 's' : ''} 
          {postsPendingCount > 0 && commentsPendingCount > 0 && ' et '}
          {commentsPendingCount > 0 && `${commentsPendingCount} commentaire${commentsPendingCount > 1 ? 's' : ''}`}
        </p>
      </div>
    </div>
  );
};

export default PendingItemsAlert;

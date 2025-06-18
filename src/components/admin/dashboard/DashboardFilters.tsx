
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, RefreshCw, Database, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface DashboardFiltersProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  lastUpdated?: string;
  autoRefresh: boolean;
  onAutoRefreshToggle: () => void;
  dataFreshness?: 'fresh' | 'stale' | 'outdated';
  onTriggerSync?: () => Promise<void>;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  timeRange,
  onTimeRangeChange,
  isRefreshing,
  onRefresh,
  lastUpdated,
  autoRefresh,
  onAutoRefreshToggle,
  dataFreshness = 'fresh',
  onTriggerSync,
}) => {
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleTriggerSync = async () => {
    if (!onTriggerSync) return;
    
    setIsSyncing(true);
    try {
      await onTriggerSync();
    } catch (error) {
      console.error('Error triggering sync:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const getFreshnessIcon = () => {
    switch (dataFreshness) {
      case 'fresh':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'stale':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'outdated':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getFreshnessText = () => {
    switch (dataFreshness) {
      case 'fresh':
        return 'Données récentes';
      case 'stale':
        return 'Données légèrement anciennes';
      case 'outdated':
        return 'Données anciennes';
      default:
        return 'État inconnu';
    }
  };

  const getFreshnessColor = () => {
    switch (dataFreshness) {
      case 'fresh':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'stale':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'outdated':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-lg border">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 heures</SelectItem>
              <SelectItem value="7d">7 jours</SelectItem>
              <SelectItem value="30d">30 jours</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {lastUpdated && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Dernière MAJ: {new Date(lastUpdated).toLocaleString('fr-FR')}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {getFreshnessIcon()}
          <Badge variant="outline" className={getFreshnessColor()}>
            {getFreshnessText()}
          </Badge>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onAutoRefreshToggle}
          className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
        >
          {autoRefresh ? 'Auto ON' : 'Auto OFF'}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh} 
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>

        {onTriggerSync && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleTriggerSync} 
            disabled={isSyncing}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Database className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync Vélib
          </Button>
        )}
        
        {autoRefresh && (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Actualisation auto: 5min
          </Badge>
        )}
      </div>
    </div>
  );
};

export default DashboardFilters;

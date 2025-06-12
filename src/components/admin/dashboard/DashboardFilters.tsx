
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, RefreshCw } from 'lucide-react';

interface DashboardFiltersProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  lastUpdated?: string;
  autoRefresh: boolean;
  onAutoRefreshToggle: () => void;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  timeRange,
  onTimeRangeChange,
  isRefreshing,
  onRefresh,
  lastUpdated,
  autoRefresh,
  onAutoRefreshToggle,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-lg border">
      <div className="flex items-center gap-4">
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

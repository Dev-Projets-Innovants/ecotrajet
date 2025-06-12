
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface OptimizedStatsCardProps {
  title: string;
  value: string;
  trend: string;
  trendValue?: number;
  icon: LucideIcon;
  iconColor: string;
  isLoading?: boolean;
  lastUpdated?: string;
}

const OptimizedStatsCard: React.FC<OptimizedStatsCardProps> = ({
  title,
  value,
  trend,
  trendValue = 0,
  icon: Icon,
  iconColor,
  isLoading = false,
  lastUpdated,
}) => {
  const isTrendPositive = trendValue >= 0;
  
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-24" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-1">
          <p className={`text-xs flex items-center ${isTrendPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isTrendPositive ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {trend}
          </p>
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              {new Date(lastUpdated).toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedStatsCard;

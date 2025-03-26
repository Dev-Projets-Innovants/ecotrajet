
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  trend: string;
  trendValue?: number; // Positive for up, negative for down
  icon: LucideIcon;
  iconColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  trend,
  trendValue = 0,
  icon: Icon,
  iconColor,
}) => {
  const isTrendPositive = trendValue >= 0;
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs flex items-center mt-1 ${isTrendPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isTrendPositive ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 mr-1" />
          )}
          {trend}
        </p>
      </CardContent>
    </Card>
  );
};

export default StatsCard;

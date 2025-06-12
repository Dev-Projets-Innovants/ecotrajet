import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { VelibUsageData } from '@/services/admin';

interface OptimizedVelibUsageChartProps {
  data: VelibUsageData[];
  config: any;
  isLoading?: boolean;
}

const OptimizedVelibUsageChart: React.FC<OptimizedVelibUsageChartProps> = ({ 
  data, 
  config, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution de l'utilisation</CardTitle>
        <CardDescription>Taux d'occupation des stations sur 7 jours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full" style={{ aspectRatio: '16/9' }}>
          <ChartContainer config={config} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="occupancyRate"
                  stroke={config.occupancy.theme.light}
                  fill={config.occupancy.theme.light}
                  fillOpacity={0.3}
                  strokeWidth={2}
                  name="Taux d'occupation (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedVelibUsageChart;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { VelibUsageData } from '@/services/admin';

interface OptimizedVelibUsageChartProps {
  data: VelibUsageData[];
  config: any;
  isLoading?: boolean;
  timeRange?: string;
}

const OptimizedVelibUsageChart: React.FC<OptimizedVelibUsageChartProps> = ({ 
  data, 
  config, 
  isLoading = false,
  timeRange = '7d'
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

  const getTimeRangeDescription = () => {
    switch (timeRange) {
      case '24h': return 'sur les dernières 24h';
      case '30d': return 'sur les 30 derniers jours';
      default: return 'sur les 7 derniers jours';
    }
  };

  const getAverageOccupancy = () => {
    if (data.length === 0) return 0;
    return Math.round(data.reduce((sum, item) => sum + item.occupancyRate, 0) / data.length);
  };

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Évolution de l'utilisation</CardTitle>
          <CardDescription>Taux d'occupation des stations {getTimeRangeDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Aucune donnée d'utilisation trouvée pour la période sélectionnée.
              Vérifiez que la synchronisation des données Vélib fonctionne correctement.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const averageOccupancy = getAverageOccupancy();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Évolution de l'utilisation
        </CardTitle>
        <CardDescription>
          Taux d'occupation des stations {getTimeRangeDescription()} • 
          Moyenne: {averageOccupancy}% • {data.length} points de données
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full" style={{ aspectRatio: '16/9' }}>
          <ChartContainer config={config} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs" 
                  tick={{ fontSize: 12 }}
                  angle={data.length > 7 ? -45 : 0}
                  textAnchor={data.length > 7 ? "end" : "middle"}
                  height={data.length > 7 ? 60 : 40}
                />
                <YAxis 
                  className="text-xs" 
                  tick={{ fontSize: 12 }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value, name) => [
                      `${value}%`, 
                      name === 'occupancyRate' ? 'Taux d\'occupation' : name
                    ]}
                  />} 
                />
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

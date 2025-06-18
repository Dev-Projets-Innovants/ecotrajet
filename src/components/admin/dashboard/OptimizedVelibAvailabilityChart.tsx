import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { VelibAvailabilityTrend } from '@/services/admin';

interface OptimizedVelibAvailabilityChartProps {
  data: VelibAvailabilityTrend[];
  config: any;
  isLoading?: boolean;
}

const OptimizedVelibAvailabilityChart: React.FC<OptimizedVelibAvailabilityChartProps> = ({ 
  data, 
  config, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="h-[280px] w-full">
            <Skeleton className="h-full w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Disponibilité des vélos par heure</CardTitle>
        <CardDescription className="text-sm">Évolution de la disponibilité sur les dernières 24h</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="w-full" style={{ aspectRatio: '16/9' }}>
          <ChartContainer config={config} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={data} 
                margin={{ top: 20, right: 10, left: 10, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="hour" 
                  className="text-xs fill-muted-foreground" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                  interval={0}
                />
                <YAxis 
                  className="text-xs fill-muted-foreground" 
                  tick={{ fontSize: 10 }}
                  width={40}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  cursor={{ stroke: 'rgba(0, 0, 0, 0.1)' }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '10px' }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="bikes"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: "#10b981", strokeWidth: 2, fill: "#ffffff" }}
                  name="Vélos disponibles"
                />
                <Line
                  type="monotone"
                  dataKey="electric"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: "#3b82f6", strokeWidth: 2, fill: "#ffffff" }}
                  name="Vélos électriques"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedVelibAvailabilityChart;

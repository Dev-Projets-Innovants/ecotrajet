
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { VelibDistributionData } from '@/services/adminVelibService';

interface OptimizedVelibDistributionChartProps {
  data: VelibDistributionData[];
  config: any;
  isLoading?: boolean;
}

const OptimizedVelibDistributionChart: React.FC<OptimizedVelibDistributionChartProps> = ({ 
  data, 
  config, 
  isLoading = false 
}) => {
  const colors = [
    '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', 
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1',
  ];

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
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
        <CardTitle className="text-lg">Répartition par arrondissement</CardTitle>
        <CardDescription className="text-sm">Nombre de stations par zone</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="w-full" style={{ aspectRatio: '16/9' }}>
          <ChartContainer config={config} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data} 
                margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="arrondissement" 
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
                  width={30}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                />
                <Bar
                  dataKey="stations"
                  name="Stations"
                  radius={[2, 2, 0, 0]}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[index % colors.length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedVelibDistributionChart;

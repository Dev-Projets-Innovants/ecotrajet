
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { VelibUsageData } from '@/services/adminVelibService';

interface VelibUsageChartProps {
  data: VelibUsageData[];
  config: any;
}

const VelibUsageChart: React.FC<VelibUsageChartProps> = ({ data, config }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution de l'utilisation</CardTitle>
        <CardDescription>Taux d'occupation des stations sur 7 jours</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[300px]">
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
      </CardContent>
    </Card>
  );
};

export default VelibUsageChart;

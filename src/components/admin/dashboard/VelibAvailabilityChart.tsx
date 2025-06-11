
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { VelibAvailabilityTrend } from '@/services/adminVelibService';

interface VelibAvailabilityChartProps {
  data: VelibAvailabilityTrend[];
  config: any;
}

const VelibAvailabilityChart: React.FC<VelibAvailabilityChartProps> = ({ data, config }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Disponibilité des vélos par heure</CardTitle>
        <CardDescription>Évolution de la disponibilité sur les dernières 24h</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="hour" 
                className="text-xs" 
                tick={{ fontSize: 12 }}
              />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="bikes"
                stroke={config.bikes.theme.light}
                strokeWidth={2}
                dot={{ fill: config.bikes.theme.light, strokeWidth: 2, r: 4 }}
                name="Vélos disponibles"
              />
              <Line
                type="monotone"
                dataKey="electric"
                stroke={config.electric.theme.light}
                strokeWidth={2}
                dot={{ fill: config.electric.theme.light, strokeWidth: 2, r: 4 }}
                name="Vélos électriques"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default VelibAvailabilityChart;

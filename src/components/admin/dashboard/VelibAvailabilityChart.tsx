import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { VelibAvailabilityTrend } from '@/services/admin';

interface VelibAvailabilityChartProps {
  data: VelibAvailabilityTrend[];
  config: any;
}

const VelibAvailabilityChart: React.FC<VelibAvailabilityChartProps> = ({ data, config }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Disponibilité des vélos par heure</CardTitle>
        <CardDescription className="text-sm">Évolution de la disponibilité sur les dernières 24h</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ChartContainer config={config} className="h-[280px] w-full">
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
      </CardContent>
    </Card>
  );
};

export default VelibAvailabilityChart;

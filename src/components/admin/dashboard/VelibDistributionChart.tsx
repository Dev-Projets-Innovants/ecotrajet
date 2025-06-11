
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { VelibDistributionData } from '@/services/adminVelibService';

interface VelibDistributionChartProps {
  data: VelibDistributionData[];
  config: any;
}

const VelibDistributionChart: React.FC<VelibDistributionChartProps> = ({ data, config }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition par arrondissement</CardTitle>
        <CardDescription>Nombre de stations par zone</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="arrondissement" 
                className="text-xs" 
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="stations"
                fill={config.bikes.theme.light}
                name="Stations"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default VelibDistributionChart;

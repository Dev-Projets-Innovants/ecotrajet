
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

interface EmissionsChartProps {
  data: Array<{
    name: string;
    Économisées: number;
  }>;
  config: any;
}

const EmissionsChart: React.FC<EmissionsChartProps> = ({ data, config }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Émissions CO₂</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Émissions économisées (kg) par mois</CardDescription>
      </CardHeader>
      <CardContent className="aspect-video">
        <ChartContainer config={config} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                className="text-[8px] sm:text-xs" 
                tick={{ fontSize: 10 }} 
              />
              <YAxis className="text-[8px] sm:text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="Économisées" 
                name="emissions" 
                fill="#22c55e" 
                fillOpacity={0.3} 
                stroke="#22c55e" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default EmissionsChart;

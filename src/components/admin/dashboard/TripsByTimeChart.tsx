
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

interface TripsByTimeChartProps {
  data: Array<{
    hour: string;
    trips: number;
  }>;
  config: any;
}

const TripsByTimeChart: React.FC<TripsByTimeChartProps> = ({ data, config }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Trajets par heure</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Nombre de trajets par heure de la journée</CardDescription>
      </CardHeader>
      <CardContent className="aspect-video">
        <ChartContainer config={config} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="hour" 
                className="text-[8px] sm:text-xs" 
                tick={{ fontSize: 10 }} 
              />
              <YAxis className="text-[8px] sm:text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="trips" 
                name="trips" 
                stroke="#f59e0b" 
                strokeWidth={3} 
                dot={{ r: 4 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TripsByTimeChart;

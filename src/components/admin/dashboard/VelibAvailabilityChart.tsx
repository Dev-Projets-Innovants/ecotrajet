
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { VelibAvailabilityTrend } from '@/services/adminVelibService';

interface VelibAvailabilityChartProps {
  data: VelibAvailabilityTrend[];
  config: any;
}

const VelibAvailabilityChart: React.FC<VelibAvailabilityChartProps> = ({ data, config }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Disponibilité des vélos par heure
          <span className="text-sm font-normal text-muted-foreground">
            ({data.length} points de données)
          </span>
        </CardTitle>
        <CardDescription>
          Évolution de la disponibilité sur les dernières 24h - Mise à jour en temps réel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data} 
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="stroke-muted opacity-30" 
                vertical={false}
              />
              <XAxis 
                dataKey="hour" 
                className="text-xs font-medium" 
                tick={{ fontSize: 11, fill: 'currentColor' }}
                axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
                tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis 
                className="text-xs font-medium" 
                tick={{ fontSize: 11, fill: 'currentColor' }}
                axisLine={{ stroke: 'currentColor', strokeWidth: 1 }}
                tickLine={{ stroke: 'currentColor', strokeWidth: 1 }}
                label={{ 
                  value: 'Nombre de vélos', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fontSize: '12px' }
                }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent 
                  formatter={(value, name) => [
                    `${value?.toLocaleString()} vélos`,
                    name
                  ]}
                  labelFormatter={(label) => `Heure: ${label}`}
                />} 
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              
              {/* Vélos mécaniques */}
              <Line
                type="monotone"
                dataKey="mechanical"
                stroke={config.mechanical.theme.light}
                strokeWidth={3}
                dot={{ 
                  fill: config.mechanical.theme.light, 
                  strokeWidth: 2, 
                  r: 5,
                  stroke: '#fff'
                }}
                activeDot={{ 
                  r: 7, 
                  stroke: config.mechanical.theme.light,
                  strokeWidth: 3,
                  fill: '#fff'
                }}
                name="Vélos mécaniques"
              />
              
              {/* Vélos électriques */}
              <Line
                type="monotone"
                dataKey="electric"
                stroke={config.electric.theme.light}
                strokeWidth={3}
                dot={{ 
                  fill: config.electric.theme.light, 
                  strokeWidth: 2, 
                  r: 5,
                  stroke: '#fff'
                }}
                activeDot={{ 
                  r: 7, 
                  stroke: config.electric.theme.light,
                  strokeWidth: 3,
                  fill: '#fff'
                }}
                name="Vélos électriques"
                strokeDasharray="5 5"
              />
              
              {/* Total des vélos (ligne de référence) */}
              <Line
                type="monotone"
                dataKey="bikes"
                stroke={config.bikes.theme.light}
                strokeWidth={2}
                dot={false}
                name="Total vélos"
                opacity={0.7}
              />
              
              {/* Places disponibles */}
              <Line
                type="monotone"
                dataKey="docks"
                stroke={config.docks.theme.light}
                strokeWidth={2}
                dot={{ 
                  fill: config.docks.theme.light, 
                  strokeWidth: 1, 
                  r: 3,
                  stroke: '#fff'
                }}
                name="Places libres"
                opacity={0.8}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default VelibAvailabilityChart;

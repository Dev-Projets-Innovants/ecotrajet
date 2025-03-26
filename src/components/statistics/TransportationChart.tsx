
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface TransportationChartProps {
  timeframe?: 'daily' | 'weekly' | 'monthly';
}

const TransportationChart: React.FC<TransportationChartProps> = ({ timeframe = 'overall' }) => {
  // This would typically come from an API in a real application
  const getChartData = () => {
    switch (timeframe) {
      case 'daily':
        return [
          { name: 'Vélo', value: 2, color: '#10B981' },
          { name: 'Marche', value: 1, color: '#6366F1' },
          { name: 'Transport en commun', value: 1, color: '#F59E0B' },
          { name: 'Voiture', value: 0, color: '#EF4444' }
        ];
      case 'weekly':
        return [
          { name: 'Vélo', value: 8, color: '#10B981' },
          { name: 'Marche', value: 5, color: '#6366F1' },
          { name: 'Transport en commun', value: 7, color: '#F59E0B' },
          { name: 'Voiture', value: 3, color: '#EF4444' }
        ];
      case 'monthly':
        return [
          { name: 'Vélo', value: 18, color: '#10B981' },
          { name: 'Marche', value: 12, color: '#6366F1' },
          { name: 'Transport en commun', value: 14, color: '#F59E0B' },
          { name: 'Voiture', value: 4, color: '#EF4444' }
        ];
      default:
        return [
          { name: 'Vélo', value: 45, color: '#10B981' },
          { name: 'Marche', value: 30, color: '#6366F1' },
          { name: 'Transport en commun', value: 52, color: '#F59E0B' },
          { name: 'Voiture', value: 15, color: '#EF4444' }
        ];
    }
  };

  const data = getChartData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des modes de transport</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransportationChart;

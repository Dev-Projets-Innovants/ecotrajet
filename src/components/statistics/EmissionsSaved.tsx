
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EmissionsSavedProps {
  timeframe?: 'daily' | 'weekly' | 'monthly';
}

const EmissionsSaved: React.FC<EmissionsSavedProps> = ({ timeframe = 'overall' }) => {
  // This would typically come from an API in a real application
  const getChartData = () => {
    switch (timeframe) {
      case 'daily':
        return [
          { name: 'Aujourd\'hui', saved: 2, potential: 4 },
        ];
      case 'weekly':
        return [
          { name: 'Lun', saved: 3, potential: 5 },
          { name: 'Mar', saved: 2, potential: 4 },
          { name: 'Mer', saved: 4, potential: 4 },
          { name: 'Jeu', saved: 1, potential: 3 },
          { name: 'Ven', saved: 3, potential: 5 },
          { name: 'Sam', saved: 1, potential: 2 },
          { name: 'Dim', saved: 0, potential: 1 },
        ];
      case 'monthly':
        return [
          { name: 'Sem 1', saved: 14, potential: 25 },
          { name: 'Sem 2', saved: 18, potential: 24 },
          { name: 'Sem 3', saved: 12, potential: 28 },
          { name: 'Sem 4', saved: 17, potential: 26 },
        ];
      default:
        return [
          { name: 'Jan', saved: 35, potential: 48 },
          { name: 'Fév', saved: 28, potential: 42 },
          { name: 'Mar', saved: 32, potential: 45 },
          { name: 'Avr', saved: 38, potential: 46 },
          { name: 'Mai', saved: 48, potential: 52 },
          { name: 'Juin', saved: 42, potential: 50 },
        ];
    }
  };

  const data = getChartData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Émissions CO2 économisées (kg)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="saved" name="CO2 économisé" fill="#10B981" />
              <Bar dataKey="potential" name="Potentiel total" fill="#E5E7EB" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmissionsSaved;

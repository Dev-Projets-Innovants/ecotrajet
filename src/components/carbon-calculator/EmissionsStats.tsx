
import React, { useMemo } from 'react';
import { Trip } from '@/pages/CarbonCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Leaf, TrendingDown } from 'lucide-react';

interface EmissionsStatsProps {
  trips: Trip[];
}

const COLORS = ['#16a34a', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280'];

const EmissionsStats: React.FC<EmissionsStatsProps> = ({ trips }) => {
  const totalEmissions = useMemo(() => {
    return trips.reduce((sum, trip) => sum + trip.emissions, 0);
  }, [trips]);

  const emissionsByTransportType = useMemo(() => {
    const result: Record<string, number> = {};
    
    trips.forEach((trip) => {
      if (!result[trip.transportType]) {
        result[trip.transportType] = 0;
      }
      result[trip.transportType] += trip.emissions;
    });
    
    return Object.entries(result).map(([name, value]) => ({
      name: getTransportLabel(name),
      value: Math.round(value * 100) / 100
    }));
  }, [trips]);

  const emissionsByWeek = useMemo(() => {
    if (trips.length === 0) return [];
    
    const weekMap: Record<string, number> = {};
    const now = new Date();
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(now.getDate() - 28);
    
    // Initialiser les 4 dernières semaines
    for (let i = 0; i < 4; i++) {
      const weekDate = new Date();
      weekDate.setDate(now.getDate() - (i * 7));
      const weekKey = `Semaine -${i}`;
      weekMap[weekKey] = 0;
    }
    
    // Ajouter les émissions
    trips.forEach((trip) => {
      if (trip.date >= fourWeeksAgo) {
        const diffTime = Math.abs(now.getTime() - trip.date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const weekNumber = Math.floor(diffDays / 7);
        
        if (weekNumber < 4) {
          const weekKey = `Semaine -${weekNumber}`;
          weekMap[weekKey] += trip.emissions;
        }
      }
    });
    
    // Transformer en tableau pour le graphique
    return Object.entries(weekMap)
      .map(([name, value]) => ({
        name,
        emissions: Math.round(value * 100) / 100
      }))
      .reverse();
  }, [trips]);

  function getTransportLabel(type: string): string {
    const labels: Record<string, string> = {
      car: 'Voiture',
      motorbike: 'Moto/Scooter',
      bus: 'Bus',
      train: 'Train',
      bike: 'Vélo',
      walk: 'Marche',
      tram: 'Tramway',
      metro: 'Métro',
      velib: 'Vélib'
    };
    return labels[type] || type;
  }

  const getEmissionsTrend = () => {
    if (emissionsByWeek.length < 2) return null;
    
    const lastWeek = emissionsByWeek[emissionsByWeek.length - 1].emissions;
    const previousWeek = emissionsByWeek[emissionsByWeek.length - 2].emissions;
    
    if (previousWeek === 0) return null;
    
    const change = ((lastWeek - previousWeek) / previousWeek) * 100;
    return change;
  };

  const trend = getEmissionsTrend();

  if (trips.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Statistiques d'émissions</CardTitle>
          <CardDescription>Aucune donnée disponible</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <Leaf className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">Vous n'avez pas encore enregistré de trajets.</p>
          <p className="text-gray-500 mt-2">Utilisez l'onglet "Ajouter un trajet" pour commencer à suivre votre empreinte carbone.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Émissions totales</CardTitle>
            <CardDescription>Impact carbone cumulé de vos déplacements</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex flex-col items-center justify-center text-center p-4">
              <Leaf className="h-10 w-10 text-eco-green mb-2" />
              <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {totalEmissions.toFixed(2)} kg CO₂
              </span>
              <p className="text-sm text-gray-500 mt-2">
                Sur {trips.length} trajet{trips.length > 1 ? 's' : ''} enregistré{trips.length > 1 ? 's' : ''}
              </p>
              
              {trend !== null && (
                <div className={`mt-4 flex items-center gap-1 text-sm ${trend < 0 ? 'text-green-500' : 'text-red-500'}`}>
                  <TrendingDown className={`h-4 w-4 ${trend < 0 ? '' : 'transform rotate-180'}`} />
                  <span>{Math.abs(trend).toFixed(1)}% par rapport à la semaine précédente</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Répartition par transport</CardTitle>
            <CardDescription>Émissions CO₂ par mode de transport</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emissionsByTransportType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={1}
                    dataKey="value"
                    label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {emissionsByTransportType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} kg CO₂`, "Émissions"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Évolution hebdomadaire</CardTitle>
          <CardDescription>Tendance de vos émissions sur les 4 dernières semaines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emissionsByWeek}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit=" kg" />
                <Tooltip formatter={(value) => [`${value} kg CO₂`, "Émissions"]} />
                <Bar dataKey="emissions" name="Émissions CO₂" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmissionsStats;

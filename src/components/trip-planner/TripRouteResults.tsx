
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TripRoute } from './TripRoute';
import { Bike, Bus, Train, Car, LucideIcon } from 'lucide-react';

interface RouteOption {
  id: string;
  title: string;
  duration: string;
  distance: string;
  co2: string;
  ecoScore: number;
  price?: string;
  steps: RouteStep[];
}

interface RouteStep {
  type: 'walk' | 'bike' | 'bus' | 'metro' | 'train' | 'car';
  icon: LucideIcon;
  name: string;
  duration: string;
  distance: string;
  color: string;
}

const TripRouteResults = () => {
  // Mock data - in a real app this would come from an API
  const routes: RouteOption[] = [
    {
      id: '1',
      title: 'Le plus écologique',
      duration: '25 min',
      distance: '4,5 km',
      co2: '0 g',
      ecoScore: 100,
      steps: [
        {
          type: 'walk',
          icon: Bike,
          name: 'Vélib',
          duration: '20 min',
          distance: '4 km',
          color: 'text-eco-green'
        },
        {
          type: 'walk',
          icon: Bike,
          name: 'Marche',
          duration: '5 min',
          distance: '0,5 km',
          color: 'text-eco-green'
        }
      ]
    },
    {
      id: '2',
      title: 'Le plus rapide',
      duration: '18 min',
      distance: '5,2 km',
      co2: '32 g',
      ecoScore: 85,
      price: '1,90 €',
      steps: [
        {
          type: 'walk',
          icon: Bike,
          name: 'Marche',
          duration: '3 min',
          distance: '0,3 km',
          color: 'text-eco-green'
        },
        {
          type: 'metro',
          icon: Train,
          name: 'Métro Ligne 4',
          duration: '12 min',
          distance: '4,5 km',
          color: 'text-purple-500'
        },
        {
          type: 'walk',
          icon: Bike,
          name: 'Marche',
          duration: '3 min',
          distance: '0,4 km',
          color: 'text-eco-green'
        }
      ]
    },
    {
      id: '3',
      title: 'Transport en commun',
      duration: '28 min',
      distance: '5,8 km',
      co2: '45 g',
      ecoScore: 80,
      price: '1,90 €',
      steps: [
        {
          type: 'walk',
          icon: Bike,
          name: 'Marche',
          duration: '6 min',
          distance: '0,6 km',
          color: 'text-eco-green'
        },
        {
          type: 'bus',
          icon: Bus,
          name: 'Bus 96',
          duration: '15 min',
          distance: '4,2 km',
          color: 'text-eco-blue'
        },
        {
          type: 'walk',
          icon: Bike,
          name: 'Marche',
          duration: '7 min',
          distance: '1 km',
          color: 'text-eco-green'
        }
      ]
    },
    {
      id: '4',
      title: 'Voiture',
      duration: '15 min',
      distance: '6,2 km',
      co2: '1,4 kg',
      ecoScore: 20,
      price: '3,50 €',
      steps: [
        {
          type: 'car',
          icon: Car,
          name: 'Voiture',
          duration: '15 min',
          distance: '6,2 km',
          color: 'text-gray-500'
        }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Options d'itinéraires</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {routes.map(route => (
          <TripRoute key={route.id} route={route} />
        ))}
      </CardContent>
    </Card>
  );
};

export default TripRouteResults;

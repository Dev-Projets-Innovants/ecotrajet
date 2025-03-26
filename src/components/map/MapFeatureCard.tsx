
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MapFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const MapFeatureCard = ({ icon: Icon, title, description }: MapFeatureCardProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
      <h3 className="flex items-center gap-2 font-medium mb-2">
        <Icon className="h-5 w-5 text-eco-green" />
        <span>{title}</span>
      </h3>
      <p className="text-sm text-gray-600">
        {description}
      </p>
    </div>
  );
};

export default MapFeatureCard;

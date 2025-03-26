
import React from 'react';
import { Search } from 'lucide-react';

interface MapSearchBarProps {
  placeholder?: string;
}

const MapSearchBar = ({ placeholder = "Rechercher une adresse..." }: MapSearchBarProps) => {
  return (
    <div className="relative flex-grow max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input 
        type="text" 
        className="pl-10 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        placeholder={placeholder} 
      />
    </div>
  );
};

export default MapSearchBar;

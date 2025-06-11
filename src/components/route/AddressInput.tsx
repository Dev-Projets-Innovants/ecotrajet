
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, X, Navigation } from 'lucide-react';
import { geocodeAddress, GeocodingResult } from '@/services/routingService';

interface AddressInputProps {
  placeholder: string;
  icon: React.ReactNode;
  onAddressSelect: (result: GeocodingResult) => void;
  onCurrentLocation?: () => void;
  value?: string;
}

const AddressInput = ({ 
  placeholder, 
  icon, 
  onAddressSelect, 
  onCurrentLocation,
  value = '' 
}: AddressInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (inputValue.length > 2 && inputValue !== selectedAddress) {
      // Debounce the search
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(async () => {
        setIsLoading(true);
        try {
          const results = await geocodeAddress(inputValue);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Erreur de recherche:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inputValue, selectedAddress]);

  const handleSuggestionClick = (suggestion: GeocodingResult) => {
    setInputValue(suggestion.display_name);
    setSelectedAddress(suggestion.display_name);
    setShowSuggestions(false);
    onAddressSelect(suggestion);
  };

  const handleClear = () => {
    setInputValue('');
    setSelectedAddress('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationResult: GeocodingResult = {
            lat: latitude,
            lng: longitude,
            display_name: 'Ma position actuelle',
            place_id: 'current-location'
          };
          setInputValue('Ma position actuelle');
          setSelectedAddress('Ma position actuelle');
          onAddressSelect(locationResult);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
        }
      );
    }
    if (onCurrentLocation) {
      onCurrentLocation();
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {icon}
        </div>
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-20"
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
          {inputValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          {onCurrentLocation && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCurrentLocation}
              className="h-6 w-6 p-0"
            >
              <Navigation className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-3 text-center text-sm text-gray-500">
              Recherche en cours...
            </div>
          ) : (
            <div className="py-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.place_id}-${index}`}
                  type="button"
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-start gap-2 text-sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="truncate">{suggestion.display_name}</span>
                </button>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default AddressInput;

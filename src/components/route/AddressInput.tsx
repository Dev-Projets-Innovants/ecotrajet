
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, X, Navigation, AlertTriangle } from 'lucide-react';
import { geocodeAddress, GeocodingResult, createFallbackAddress } from '@/services/routingService';

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
  const [showFallbackOption, setShowFallbackOption] = useState(false);
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
        setShowFallbackOption(false);
        try {
          const results = await geocodeAddress(inputValue);
          setSuggestions(results);
          setShowSuggestions(true);
          
          // Si aucun résultat trouvé, proposer l'option fallback
          if (results.length === 0) {
            setShowFallbackOption(true);
          }
        } catch (error) {
          console.error('Erreur de recherche:', error);
          setSuggestions([]);
          setShowFallbackOption(true);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setShowFallbackOption(false);
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
    setShowFallbackOption(false);
    onAddressSelect(suggestion);
  };

  const handleFallbackSelection = () => {
    const fallbackAddress = createFallbackAddress(inputValue);
    setSelectedAddress(inputValue);
    setShowSuggestions(false);
    setShowFallbackOption(false);
    onAddressSelect(fallbackAddress);
  };

  const handleClear = () => {
    setInputValue('');
    setSelectedAddress('');
    setSuggestions([]);
    setShowSuggestions(false);
    setShowFallbackOption(false);
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
      {(showSuggestions || showFallbackOption) && (suggestions.length > 0 || isLoading || showFallbackOption) && (
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
                  className={`w-full px-3 py-2 text-left hover:bg-gray-100 flex items-start gap-2 text-sm ${
                    suggestion.is_fallback ? 'bg-yellow-50 border-b border-yellow-200' : ''
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <MapPin className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                    suggestion.is_fallback ? 'text-yellow-500' : 'text-gray-400'
                  }`} />
                  <span className="truncate">
                    {suggestion.display_name}
                    {suggestion.is_fallback && (
                      <span className="text-xs text-yellow-600 block">Recherche élargie</span>
                    )}
                  </span>
                </button>
              ))}
              
              {showFallbackOption && suggestions.length === 0 && (
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left hover:bg-orange-50 flex items-start gap-2 text-sm bg-orange-25 border-b border-orange-200"
                  onClick={handleFallbackSelection}
                >
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="truncate block">Utiliser "{inputValue}" (approximatif)</span>
                    <span className="text-xs text-orange-600">Adresse non trouvée, recherche dans Paris</span>
                  </div>
                </button>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default AddressInput;

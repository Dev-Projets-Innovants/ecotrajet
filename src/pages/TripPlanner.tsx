
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, MapPin, ArrowRight, Bike, Bus, Train, Car } from "lucide-react";
import TripRouteResults from '@/components/trip-planner/TripRouteResults';
import Map from '@/components/Map';

const TripPlanner = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  return (
    <Layout title="Planificateur de trajets">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-3">Planifiez votre trajet</h1>
          <p className="text-gray-600">
            Trouvez les itinéraires les plus écologiques pour vos déplacements quotidiens.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Options de trajet</CardTitle>
              <CardDescription>
                Entrez vos points de départ et d'arrivée pour trouver les meilleurs itinéraires.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Point de départ</label>
                  <div className="flex space-x-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-2" />
                    <Input placeholder="Votre position actuelle" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Destination</label>
                  <div className="flex space-x-2">
                    <MapPin className="h-5 w-5 text-eco-green mt-2" />
                    <Input placeholder="Où allez-vous ?" required />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Heure</label>
                    <Select defaultValue="now">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner l'heure" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="now">Maintenant</SelectItem>
                        <SelectItem value="departure">Départ à</SelectItem>
                        <SelectItem value="arrival">Arrivée à</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Préférences</label>
                  <div className="flex space-x-2">
                    <Button type="button" variant="outline" className="flex-1 flex justify-center">
                      <Bike className="h-5 w-5 text-eco-green" />
                    </Button>
                    <Button type="button" variant="outline" className="flex-1 flex justify-center">
                      <Bus className="h-5 w-5 text-eco-blue" />
                    </Button>
                    <Button type="button" variant="outline" className="flex-1 flex justify-center">
                      <Train className="h-5 w-5 text-purple-500" />
                    </Button>
                    <Button type="button" variant="outline" className="flex-1 flex justify-center">
                      <Car className="h-5 w-5 text-gray-500" />
                    </Button>
                  </div>
                </div>
              
                <Button type="submit" className="w-full">
                  Rechercher
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-0">
                <div className="h-[400px] relative rounded-md overflow-hidden">
                  <Map />
                </div>
              </CardContent>
            </Card>
            
            {showResults && <TripRouteResults />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TripPlanner;

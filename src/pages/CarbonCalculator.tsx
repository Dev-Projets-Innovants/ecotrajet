
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Leaf, AlertCircle, Car, Bike, Train, Bus, Plus, UserPlus, Users } from 'lucide-react';
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import TripsHistory from '@/components/carbon-calculator/TripsHistory';
import EmissionsStats from '@/components/carbon-calculator/EmissionsStats';

// Types pour les trajets
export type Trip = {
  id: string;
  date: Date;
  transportType: string;
  distance: number;
  isCarpool: boolean;
  passengerCount?: number;
  notes?: string;
  emissions: number;
}

const CarbonCalculator = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [transportType, setTransportType] = useState<string>("car");
  const [distance, setDistance] = useState<number>(10);
  const [isCarpool, setIsCarpool] = useState<boolean>(false);
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("add-trip");
  const [trips, setTrips] = useState<Trip[]>([]);

  // Emission factors in kg CO2 per km
  const emissionFactors = {
    car: 0.192,
    motorbike: 0.103,
    bus: 0.089,
    train: 0.041,
    bike: 0,
    walk: 0,
    tram: 0.035,
    metro: 0.025,
    velib: 0
  };

  const calculateEmissions = (mode: string, dist: number, carpool: boolean = false, passengers: number = 1): number => {
    if (mode === 'car' && carpool && passengers > 1) {
      // Répartition des émissions entre les passagers
      return (dist * emissionFactors[mode as keyof typeof emissionFactors]) / passengers;
    }
    return dist * emissionFactors[mode as keyof typeof emissionFactors];
  };

  const handleAddTrip = () => {
    const emissions = calculateEmissions(transportType, distance, isCarpool, passengerCount);
    
    const newTrip: Trip = {
      id: Date.now().toString(),
      date,
      transportType,
      distance,
      isCarpool,
      passengerCount: isCarpool ? passengerCount : undefined,
      notes: notes.trim() !== "" ? notes : undefined,
      emissions
    };
    
    setTrips([...trips, newTrip]);
    
    // Reset form
    setDate(new Date());
    setTransportType("car");
    setDistance(10);
    setIsCarpool(false);
    setPassengerCount(1);
    setNotes("");
    
    toast({
      title: "Trajet enregistré",
      description: `Votre trajet de ${distance} km a été ajouté avec succès.`,
    });
  };

  const transportIcons = {
    car: <Car className="h-6 w-6" />,
    motorbike: <Car className="h-6 w-6" />,
    bus: <Bus className="h-6 w-6" />,
    train: <Train className="h-6 w-6" />,
    bike: <Bike className="h-6 w-6" />,
    walk: <Users className="h-6 w-6" />,
    tram: <Train className="h-6 w-6" />,
    metro: <Train className="h-6 w-6" />,
    velib: <Bike className="h-6 w-6" />
  };

  const getTransportIcon = (type: string) => {
    return transportIcons[type as keyof typeof transportIcons] || <Car className="h-6 w-6" />;
  };

  const getTransportLabel = (type: string) => {
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
  };

  return (
    <Layout title="Suivi d'empreinte carbone">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-eco-green">Suivi d'empreinte carbone</h1>
        <p className="text-center mb-8 text-gray-600 dark:text-gray-300">
          Enregistrez vos trajets quotidiens pour suivre et réduire votre empreinte carbone liée aux déplacements.
        </p>
        
        <Tabs defaultValue="add-trip" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="add-trip">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un trajet
            </TabsTrigger>
            <TabsTrigger value="history">
              Historique
            </TabsTrigger>
            <TabsTrigger value="stats">
              Statistiques
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="add-trip" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enregistrer un nouveau trajet</CardTitle>
                <CardDescription>
                  Renseignez les détails de votre déplacement pour suivre votre impact carbone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date du trajet</label>
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
                          {date ? format(date, "dd MMMM yyyy", { locale: fr }) : <span>Choisir une date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(date) => date && setDate(date)}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                          locale={fr}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mode de transport</label>
                    <Select 
                      value={transportType} 
                      onValueChange={setTransportType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre mode de transport" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Voiture</SelectItem>
                        <SelectItem value="motorbike">Moto / Scooter</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="train">Train / TER</SelectItem>
                        <SelectItem value="metro">Métro</SelectItem>
                        <SelectItem value="tram">Tramway</SelectItem>
                        <SelectItem value="bike">Vélo personnel</SelectItem>
                        <SelectItem value="velib">Vélib / Vélo en libre-service</SelectItem>
                        <SelectItem value="walk">Marche</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Distance parcourue (km)</label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[distance]}
                      min={1}
                      max={100}
                      step={1}
                      onValueChange={(values) => setDistance(values[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={distance}
                      onChange={(e) => setDistance(Number(e.target.value))}
                      className="w-20"
                      min={0.1}
                      step={0.1}
                    />
                  </div>
                </div>
                
                {transportType === "car" && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="isCarpool" 
                        checked={isCarpool}
                        onCheckedChange={(checked) => setIsCarpool(checked === true)}
                      />
                      <label
                        htmlFor="isCarpool"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Trajet en covoiturage
                      </label>
                    </div>
                    
                    {isCarpool && (
                      <div className="space-y-2 ml-6">
                        <label className="text-sm font-medium">Nombre total de passagers (incluant le conducteur)</label>
                        <Select 
                          value={passengerCount.toString()} 
                          onValueChange={(val) => setPassengerCount(parseInt(val))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Nombre de passagers" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">2 personnes</SelectItem>
                            <SelectItem value="3">3 personnes</SelectItem>
                            <SelectItem value="4">4 personnes</SelectItem>
                            <SelectItem value="5">5 personnes ou plus</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes (facultatif)</label>
                  <Textarea 
                    placeholder="Ajoutez des détails sur votre trajet..." 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <Leaf className="h-5 w-5 text-eco-green" />
                    Impact estimé
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTransportIcon(transportType)}
                      <span>{getTransportLabel(transportType)}</span>
                      {transportType === "car" && isCarpool && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Covoiturage ({passengerCount} pers.)
                        </span>
                      )}
                    </div>
                    <span className="text-xl font-bold">
                      {calculateEmissions(transportType, distance, isCarpool, passengerCount).toFixed(2)} kg CO₂
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleAddTrip} 
                  className="w-full bg-eco-green hover:bg-eco-dark-green"
                >
                  Enregistrer ce trajet
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <TripsHistory 
              trips={trips} 
              getTransportIcon={getTransportIcon}
              getTransportLabel={getTransportLabel}
            />
          </TabsContent>
          
          <TabsContent value="stats">
            <EmissionsStats trips={trips} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CarbonCalculator;

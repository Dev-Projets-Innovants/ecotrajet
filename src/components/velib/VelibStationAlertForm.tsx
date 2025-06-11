
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Bell, AlertCircle, Mail, TestTube } from 'lucide-react';
import { createUserAlert, sendTestAlert } from '@/services/supabaseVelibService';
import { toast } from '@/components/ui/use-toast';

interface VelibStationAlertFormProps {
  stationcode: string;
}

const VelibStationAlertForm: React.FC<VelibStationAlertFormProps> = ({ stationcode }) => {
  const [alertThreshold, setAlertThreshold] = useState(1);
  const [alertType, setAlertType] = useState<'bikes_available' | 'docks_available' | 'ebikes_available' | 'mechanical_bikes'>('bikes_available');
  const [userEmail, setUserEmail] = useState('');
  const [notificationFrequency, setNotificationFrequency] = useState<'immediate' | 'hourly' | 'daily'>('immediate');
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleCreateAlert = async () => {
    if (!userEmail.trim()) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir votre adresse email pour recevoir les notifications.",
        variant: "destructive",
      });
      return;
    }

    if (!userEmail.includes('@')) {
      toast({
        title: "Email invalide",
        description: "Veuillez saisir une adresse email valide.",
        variant: "destructive",
      });
      return;
    }

    const success = await createUserAlert(
      stationcode, 
      alertType, 
      alertThreshold,
      userEmail,
      notificationFrequency
    );
    
    if (success) {
      setAlertThreshold(1);
      setUserEmail('');
    }
  };

  const handleSendTestAlert = async () => {
    if (!userEmail.trim()) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir votre adresse email pour le test.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingTest(true);
    try {
      await sendTestAlert(stationcode, userEmail, alertType, alertThreshold);
    } finally {
      setIsSendingTest(false);
    }
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'bikes_available': return 'Vélos disponibles';
      case 'docks_available': return 'Places libres';
      case 'ebikes_available': return 'Vélos électriques';
      case 'mechanical_bikes': return 'Vélos mécaniques';
      default: return type;
    }
  };

  return (
    <div className="border-t pt-4 space-y-3">
      <div className="flex items-center space-x-2">
        <AlertCircle className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium">Alerte par email</span>
      </div>
      
      <div className="space-y-3">
        <div>
          <Label htmlFor="email" className="text-xs text-gray-600">Votre email</Label>
          <div className="flex items-center space-x-1 mt-1">
            <Mail className="h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="flex-1 text-sm"
            />
          </div>
        </div>
        
        <div>
          <Label className="text-xs text-gray-600">Type d'alerte</Label>
          <Select value={alertType} onValueChange={(value: any) => setAlertType(value)}>
            <SelectTrigger className="w-full mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bikes_available">Vélos disponibles</SelectItem>
              <SelectItem value="mechanical_bikes">Vélos mécaniques</SelectItem>
              <SelectItem value="ebikes_available">Vélos électriques</SelectItem>
              <SelectItem value="docks_available">Places libres</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-600">Seuil</Label>
            <Input
              type="number"
              min="1"
              max="50"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(parseInt(e.target.value) || 1)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Fréquence</Label>
            <Select value={notificationFrequency} onValueChange={(value: any) => setNotificationFrequency(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immédiat</SelectItem>
                <SelectItem value="hourly">Toutes les heures</SelectItem>
                <SelectItem value="daily">Une fois par jour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button onClick={handleCreateAlert} size="sm" className="flex-1">
            <Bell className="h-4 w-4 mr-2" />
            Créer l'alerte
          </Button>
          <Button 
            onClick={handleSendTestAlert} 
            disabled={isSendingTest}
            variant="outline" 
            size="sm"
          >
            <TestTube className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
          💡 Vous recevrez un email quand il y aura au moins {alertThreshold} {getAlertTypeLabel(alertType).toLowerCase()} disponible(s).
        </div>
      </div>
    </div>
  );
};

export default VelibStationAlertForm;

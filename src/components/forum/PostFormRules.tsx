
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PostFormRules: React.FC = () => {
  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-sm text-orange-700">
        <strong>Règles de la communauté :</strong> Respectez autrui, restez constructif, 
        partagez responsable. Les contenus inappropriés peuvent être supprimés.
      </AlertDescription>
    </Alert>
  );
};

export default PostFormRules;
